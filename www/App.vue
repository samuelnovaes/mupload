<template>
	<v-app dark>
		<router-view></router-view>
		<v-dialog v-model="$store.state.loading" width="100%" max-width="200" persistent>
			<v-card>
				<v-card-text>
					<v-progress-linear
						:indeterminate="!$store.state.buffering"
						:value="$store.state.progress"
					></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-snackbar v-model="$store.state.error" color="error" class="black--text">
			{{$store.state.errorMessage}}
			<v-btn icon @click="$store.commit('error', false)" class="black--text">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-snackbar>
	</v-app>
</template>

<style>
	@font-face {
		font-family: logo;
		src: url(assets/logo.ttf);
	}
</style>

