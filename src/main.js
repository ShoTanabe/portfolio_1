import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
	apiKey: "AIzaSyCPTauWV6svIKWFLTscYKjCZRHUe4JJs3Y",
	authDomain: "my-portfolio-c7f24.firebaseapp.com",
	projectId: "my-portfolio-c7f24",
	storageBucket: "my-portfolio-c7f24.appspot.com",
	messagingSenderId: "250433775902",
	appId: "1:250433775902:web:9a254be6156f3923ae410f"
});

export { firebaseApp };


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

require('@/assets/css/destyle.css');
