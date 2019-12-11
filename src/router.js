import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Setup from './views/Setup.vue'
import Home from './views/Home.vue'
import Post from './views/Post.vue'
import Tags from './views/Tags.vue'
import Archive from './views/Archive.vue'

Vue.use( Router )

export default new Router(
	{
		mode: 'history',
		base: process.env.BASE_URL,
		routes: [
			{
				path: '/',
				name: 'home',
				component: Home,
			},
			{
				path: '/setup',
				name: 'setup',
				component: Setup
			},
			{
				path: '/login',
				name: 'login',
				component: Login
				//component: () => import( /* webpackChunkName: "about" */ './views/About.vue' )
			},
			{
				path: '/dashboard',
				name: 'dashboard',
				component: Dashboard,
				meta: {
					requiresAuth: true
				}
			},
			{
				path: '/post/:slug',
				name: 'post',
				component: Post
			},
			{
				path: '/tags/:tag',
				name: 'tags',
				component: Tags
			},
			{
				path: '/archive/:year/:month',
				name: 'archive',
				component: Archive
			}
		]
	} )