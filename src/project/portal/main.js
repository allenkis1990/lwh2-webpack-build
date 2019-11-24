
console.log('当前是否开发环境啊'+dev);
//全局ajax拦截器
import interceptors from '@portal/utils/interceptors'
import Vue from 'vue'
import App from '@portal/App.vue'
import router from '@portal/router/router'
import store from '@portal/store/store'
import axios from 'axios'
import mixin from '@portal/utils/mixin'
import elementUi from '@portal/utils/element-ui'
//引入mod加载器
import modLoader from '@portal/utils/mod-loader'
modLoader(Vue)

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
