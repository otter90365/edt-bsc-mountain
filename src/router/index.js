import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import app from '../main'
import Home from '../views/Home.vue'
import Defi from '@/plugins/defi.js';
import Toasted from 'vue-toasted';
// import jwt_decode from "jwt-decode";
const cookies = require('vue-cookies')
Vue.use(VueRouter)
Vue.use(cookies);
Vue.use(Toasted, {
  // router,
  position: 'top-center',
  duration: 2000,
});

const routes = [
  // {
  //   path: '/:lang',
  //   name: 'Home',
  //   component: Home,
  //   meta: { requiresAuth: false },
  // },
  {
    path: '/:lang',
    name: 'Home',
    component: () => import('../views/Index.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/:lang/:token',
    name: 'DefiLayout',
    component: () => import('../DefiLayout.vue'),
    children: [
      {
        path: '',
        name: 'lang-token',
        component: Home,
      },
      // swap egt & eth
      {
        path: 'swap',
        name: 'Swap',
        component: () => import('../views/Swap/index.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'swap/egt',
        name: 'Swap-egt',
        component: () => import('../views/Swap/egt.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'swap/eth',
        name: 'Swap-eth',
        component: () => import('../views/Swap/eth.vue'),
        meta: { requiresAuth: true },
      },

      // EGT 換算器
      {
        path: 'calculator',
        name: 'Calculator',
        component: () => import('../views/Calculator/index.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'calculator/twd',
        name: 'Calculator-twd',
        component: () => import('../views/Calculator/twd.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'calculator/usdt',
        name: 'Calculator-usdt',
        component: () => import('../views/Calculator/usdt.vue'),
        meta: { requiresAuth: false },
      },

      // 註冊
      {
        path: 'registry',
        name: 'Defi-registry',
        component: () => import('../views/Defi/registry.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'registry/egt',
        name: 'Egt-registry',
        component: () => import('../views/Defi/registry-egt.vue'),
        meta: { requiresAuth: false },
      },

      // 我要投資
      {
        path: 'deposit',
        name: 'Defi-deposit',
        component: () => import('../views/Defi/deposit/index.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'deposit/list',
        name: 'Defi-deposit-list',
        component: () => import('../views/Defi/deposit/list.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'deposit/orders',
        name: 'Defi-deposit-orders',
        component: () => import('../views/Defi/deposit/orders.vue'),
        meta: { requiresAuth: true },
      },

      // 我要貸款
      {
        path: 'borrow',
        name: 'Defi-borrow',
        component: () => import('../views/Defi/borrow/index.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'borrow/create',
        name: 'Defi-borrow-create',
        component: () => import('../views/Defi/borrow/create/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'borrow/create/egt',
        name: 'Defi-borrow-create-egt',
        component: () => import('../views/Defi/borrow/create/egt.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'borrow/create/:swapToken',
        name: 'Defi-borrow-create-swapToken',
        component: () => import('../views/Defi/borrow/create/_swapToken.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'borrow/loans',
        name: 'Defi-borrow-loans',
        component: () => import('../views/Defi/borrow/loans.vue'),
        meta: { requiresAuth: true },
      },

      // community
      {
        path: 'community',
        name: 'Community',
        component: () => import('../views/Community.vue'),
        meta: { requiresAuth: true },
      },

      // ADT
      {
        path: 'adt',
        name: 'ADT',
        component: () => import('../views/Adt.vue'),
        meta: { requiresAuth: false },
      }
    ]
  },
  {
    // coming soon
    path: '/:lang/coming-soon',
    name: "ComingSoon",
    component: () => import('../views/ComingSoon.vue'),
    meta: { requiresAuth: false },
  },
  {
    // will match everything
    path: '*',
    component: () => import('../views/Other.vue'),
    meta: { requiresAuth: false },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  // console.log('to.params.lang', to.params.lang)
  if (!to.params.lang || !store.state.langs.includes(to.params.lang)){
    next('/tw')
  }

  // // Get user info from cookies
  // try{
  //   if (to.name !== 'Egt-swap' && to.name !== 'Ethegt-send' && to.name !== 'ADT'){
  //     let token = Vue.$cookies.get('tokenMining') || Vue.$cookies.get('token') || to.query.access_token
  //     if (token != undefined) {
  //       let decoded = jwt_decode(token);
  //       if (decoded.exp >= Date.now() / 1000){
  //         if ( store.state.token === '' ){
  //           try{
  //             await store.commit('updateToken', token)
  //             Vue.$cookies.set('tokenMining', token)
    
  //             if (to.query.access_token){
  //               next({ name: 'Index' });
  //             }else{
  //               next();
  //             }
  //           }catch(error){
  //             console.log('error', error)
  //             store.commit('clearInfo')
  //             Vue.$cookies.remove('tokenMining')
  //           }
  //         }
  //       }else{
  //         store.commit('clearInfo')
  //         Vue.$cookies.remove('tokenMining')
  //         window.location.href = 'https://absolute-uv.com/'
  //       }
  //     }else{
  //       // redirect to absolute's home page without login
  //       Vue.toasted.error(app ? app.$i18n.messages[store.state.locale]['loginFirst'] : '請先登入')
  //       window.location.href = 'https://absolute-uv.com/'
  //     }
  //   }
  // }catch(error){
  //   console.log('error', error)
  //   next();
  // }

  // update backendUrl
  if (store.state.currToken !== to.params.token){
    store.commit('updateCurrToken', to.params.token)
    try{
      await store.dispatch('getDefiContract')

      // Get contract address
      let defiContract = await new Defi()
      let tokenList = await defiContract.getToken()
      store.commit('updateTokenList', tokenList)
      // get contract address
      let address = await defiContract.getAddress()
      if (address === 'error'){
        console.log('error')
      }else{
        store.commit('updateAddress', address)
      }
    }catch(error){
      console.log('here error', error)
      window.location.reload()
    }
  }

  // Get user info from cookies
  try{
    let address = Vue.$cookies.get('address')
    if (address != undefined) {
      if ( store.state.account === '' ){
        try{
          store.commit('updateAccount', address)
        }catch(error){
          console.log('error', error)
        }
      }
    }
  }catch(error){
    console.log('error', error)
    next();
  }

  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if (to.matched.some(record => {
    // console.log(record.name, record.meta.requiresAuth);
    return record.meta.requiresAuth;
  })) {
    // 未登入
    if (store.state.account === ''){
      try{
        next({ name: 'Home' });
      }catch(error){
        console.log('error', error)
      }
    }else{
      next(); // 往下繼續執行
    }
  } else {
    next(); // 往下繼續執行
  }
});

router.afterEach(async (to) => {
  // Get lang from route path
  if (to.params.lang){
    store.commit('updateLang', to.params.lang)
    app.$i18n.locale = to.params.lang
  }
});


export default router
