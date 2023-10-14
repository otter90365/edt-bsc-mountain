import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted';
import i18n from '../i18n'

const cookies = require('vue-cookies')

Vue.config.productionTip = false

const app = new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(cookies);
Vue.use(Toasted, {
  // router,
  position: 'top-center',
  duration: 2000,
});

export default app