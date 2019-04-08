import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import routes from './routes'
import store from './store'
import axios from 'axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify, {
	theme: {
		primary: '#ffffff',
		primary2: '#3F51B5',
		error: '#EF9A9A'
	}
})
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.use({
	install(vm) {
		vm.prototype.$request = function (options, cb) {
			options.headers = {
				'x-access-token': this.$store.state.token
			}
			this.$store.commit('loading', true)
			axios(options).then(({ data }) => {
				if(cb) cb(data)
			}).catch(err => {
				this.$store.commit('error', err.message)
			}).finally(() => {
				this.$store.commit('progress', 0)
				this.$store.commit('buffering', false)
				this.$store.commit('loading', false)
			})
		}
	}
})

new Vue({
	el: '#app',
	render: h => h(App),
	router: new VueRouter({
		routes,
		mode: 'history'
	}),
	store: new Vuex.Store(store)
})