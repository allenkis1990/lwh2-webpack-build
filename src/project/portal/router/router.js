
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
import Root from '@portal/views/root/root.vue'

// meta: {
//     keepAlive: false // 不需要被缓存
// },
export default new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: dev?'/portal':'/',
            redirect: function () {
                if(dev){
                    return '/portal/home'
                }else{
                    return '/home'
                }
            },
            name:'root',
            component: Root,
            children: [
                {
                    name: 'home',
                    path: 'home',
                    component: () => import(/* webpackChunkName: "portal/chunk/home" */'@portal/views/home/home.vue')
                },
                {
                    name: 'test',
                    path: 'test',
                    component: () => import(/* webpackChunkName: "portal/chunk/test" */'@portal/views/test/test.vue')
                }
            ]
        }
    ]
});


















