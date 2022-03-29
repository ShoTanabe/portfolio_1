import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login'
import Home from './views/home'
import Signup from './views/signup'
import Dashboard from './views/dashboard'
import Chart from './views/chart'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'login',
      component: Login
    },
    { path: '/signup',
      name: 'signup',
      component: Signup
    },
    { path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    { path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    { path: '/chart',
      name: 'chart',
      component: Chart,
      meta: { requiresAuth: true }
    }
  ]
})

import { getAuth, onAuthStateChanged } from "firebase/auth";

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next()
      } else {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router

