<template>
	<v-container fill-height fluid>
		<v-layout column fill-height align-center justify-center>
			<v-card max-width="300" width="100%">
				<v-toolbar color="primary2" flat>
					<v-toolbar-title :style="{fontFamily: 'logo'}">MUpload</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form @submit="auth" ref="form">
						<v-text-field :rules="[rules.required]" label="Password" type="password" v-model="password"></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn color="primary2" @click="auth">Enter</v-btn>
				</v-card-actions>
			</v-card>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			password: '',
			rules: {
				required: v => !!v || 'Required'
			}
		}
	},
	created() {
		if (this.$store.state.token) this.$router.push('/home')
	},
	methods: {
		auth(e) {
			e.preventDefault()
			if (this.$refs.form.validate()) {
				this.$request({
					method: 'POST',
					url: '/auth',
					data: {
						password: this.password
					}
				}, token => {
					this.$store.commit('token', token)
					this.$router.push('/home')
				})
			}
		}
	}
}
</script>

