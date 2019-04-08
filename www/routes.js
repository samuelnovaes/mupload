import login from './pages/login.vue'
import home from './pages/home.vue'

export default [
	{ path: '/', redirect: '/login' },
	{ path: '/login', component: login },
	{ path: '/home', component: home }
]