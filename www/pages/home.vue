<template>
	<div>
		<v-toolbar color="primary2" app>
			<v-toolbar-title :style="{fontFamily: 'logo'}">MUpload</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="$refs.fileInput.click()">
				<v-icon>mdi-upload</v-icon>
			</v-btn>
			<v-menu>
				<template v-slot:activator="{on}">
					<v-btn icon v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-tile @click="logout">
						<v-list-tile-content>Logout</v-list-tile-content>
					</v-list-tile>
					<v-divider></v-divider>
					<v-list-tile @click="changePasswordDialog = true">
						<v-list-tile-content>Change Password</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>
		<v-content>
			<v-container grid-list-md fluid>
				<v-layout row wrap>
					<v-flex v-for="(file, i) in files" :key="i" xs12 sm6 md4 lg3>
						<v-card>
							<v-toolbar flat>
								<v-avatar tile size="30">
									<v-img :src="`/files/${file}/icon`" :aspect-ratio="1" contain></v-img>
								</v-avatar>
								<v-toolbar-title>{{file}}</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-menu>
									<template v-slot:activator="{on}">
										<v-btn icon v-on="on">
											<v-icon>mdi-dots-vertical</v-icon>
										</v-btn>
									</template>
									<v-list>
										<v-list-tile @click="downloadFile(file)">
											<v-list-tile-content>Download</v-list-tile-content>
										</v-list-tile>
										<v-divider></v-divider>
										<v-list-tile @click="remove(file)">
											<v-list-tile-content>Delete</v-list-tile-content>
										</v-list-tile>
									</v-list>
								</v-menu>
							</v-toolbar>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</v-content>
		<v-dialog v-model="changePasswordDialog" width="100%" max-width="300" persistent>
			<v-card>
				<v-card-text>
					<v-form ref="changePasswordForm" @submit="savePassword">
						<v-text-field
							type="password"
							label="Current Password"
							:rules="[rules.required]"
							v-model="currentPassword"
						></v-text-field>
						<v-text-field
							type="password"
							label="New Password"
							:rules="[rules.required, rules.password]"
							v-model="newPassword"
						></v-text-field>
						<v-text-field
							type="password"
							label="Confirm Password"
							:rules="[rules.required, rules.confirmPassword]"
							v-model="confirmPassword"
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn color="primary2" @click="savePassword">Save</v-btn>
					<v-btn color="secondary" @click="changePasswordClose">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<form ref="uploadForm">
			<input type="file" ref="fileInput" multiple @change="uploadFiles" name="files">
		</form>
	</div>
</template>

<style>
input[type="file"] {
	display: none;
}
</style>


<script>
import io from 'socket.io-client'
const socket = io()

export default {
	data() {
		const getPassword = () => this.newPassword
		return {
			files: [],
			changePasswordDialog: false,
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
			rules: {
				required: v => !!v || 'Required',
				password: v => v && v.length >= 5 || 'Minimun 5 characters required',
				confirmPassword: v => v == getPassword() || 'Passwords don\'t match'
			}
		}
	},
	created() {
		if (!this.$store.state.token) this.$router.push('/login')
		else this.refresh()
	},
	mounted() {
		socket.on('refresh', () => {
			this.refresh()
		})
	},
	methods: {
		logout() {
			this.$store.commit('token', null)
			this.$router.push('/login')
		},
		changePasswordClose() {
			this.$refs.changePasswordForm.reset()
			this.changePasswordDialog = false
		},
		savePassword() {
			if (this.$refs.changePasswordForm.validate()) {
				this.$request({
					method: 'PUT',
					url: '/password',
					data: {
						current: this.currentPassword,
						newpass: this.newPassword
					}
				}, () => {
					_alert('Password changed successfully. Please authenticate again.')
					this.logout()
				})
			}
		},
		refresh() {
			this.$request({
				method: 'GET',
				url: '/files'
			}, data => {
				this.files = data
			})
		},
		uploadFiles() {
			const data = new FormData(this.$refs.uploadForm)
			this.$store.commit('buffering', true)
			this.$request({
				method: 'POST',
				url: '/files',
				data,
				onUploadProgress: e => {
					this.$store.commit('progress', parseInt(((e.loaded / e.total) * 100)))
				}
			})
		},
		downloadFile(file) {
			this.$store.commit('buffering', true)
			this.$request({
				method: 'GET',
				url: `/files/${file}`,
				responseType: 'blob',
				onDownloadProgress: e => {
					this.$store.commit('progress', parseInt(((e.loaded / e.total) * 100)))
				}
			}, data => {
				const url = URL.createObjectURL(data)
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', file)
				link.click()
			})
		},
		remove(file) {
			this.$request({
				method: 'DELETE',
				url: `/files/${file}`
			})
		}
	}
}
</script>
