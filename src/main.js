import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/firebase/'
import './assets/styles.scss'
import './assets/fontawesome.min.css'
import './assets/solid.min.css'
import firebase from 'firebase/app';
import 'firebase/auth';

import { blogapi } from './BlogAPI/blogapi.js';
blogapi.settings(
	{
		api: "http://localhost/api/"
	}
);

Vue.prototype.$blogapi = blogapi;

Vue.config.productionTip = false

//router guard - check if auth needed for requested page
router.beforeEach( ( to, from, next ) =>
{
	const requiresAuth = to.matched.some( x => x.meta.requiresAuth );
	const currentUser = firebase.auth().currentUser;

	if ( requiresAuth && !currentUser )
	{
		next( '/login' );
	} else if ( requiresAuth && currentUser )
	{
		next();
	} else
	{
		next();
	}
} );

// make sure firebase is loaded
let app;
firebase.auth().onAuthStateChanged( () =>
{
	if ( !app )
		app = new Vue(
			{
				router,
				render: h => h( App )
			} ).$mount( '#app' );
} );
