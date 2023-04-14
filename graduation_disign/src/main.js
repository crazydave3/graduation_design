import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
new Vue({
    render: h => h(App),
    router,
    store,

}).$mount('#app')