
console.log('当前是否开发环境'+dev);
//全局ajax拦截器
import interceptors from '@center/utils/interceptors'
import Vue from 'vue'
import App from '@center/App.vue'
import router from '@center/router/router'
import store from '@center/store/store'
import axios from 'axios'
import mixin from '@center/utils/mixin'
import elementUi from '@center/utils/element-ui'


//使用element-ui并且把各插件挂载到Vue上
elementUi(Vue)
//把axios挂载到Vue原型链上
Vue.prototype.$http = axios
// 混合
Vue.mixin(mixin)


var vm = new Vue({
    el:'#app',
    router,
    store,
    template:'<App/>',
    components:{App}
});

if(module.hot){
    module.hot.accept();
}
