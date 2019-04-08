export default {
	state: {
		loading: false,
		token: localStorage.token,
		error: false,
		errorMessage: '',
		progress: 0,
		buffering: false
	},
	mutations: {
		loading(state, value) {
			state.loading = value
		},
		token(state, value) {
			state.token = value
			if(value) localStorage.token = value
			else delete localStorage.token
		},
		error(state, value) {
			state.errorMessage = value
			state.error = !!value
		},
		progress(state, value) {
			state.progress = value
		},
		buffering(state, value){
			state.buffering = value
		}
	}
}