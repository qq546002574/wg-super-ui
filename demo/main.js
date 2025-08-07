import Vue from 'vue'
import Test from '../src'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(Test)
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../dist/lib/wg-component-library.css'
Vue.use(ElementUI)
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
