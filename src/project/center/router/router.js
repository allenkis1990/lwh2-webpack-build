
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
import Root from '@center/views/root/root.vue'

// meta: {
//     keepAlive: false // 不需要被缓存
// },
export default new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: multiApp?'/center':'/',
            redirect: function () {
                if(multiApp){
                    return '/center/home'
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
                    component: () => import('@center/views/home/home.vue')
                }
            ]
        }
    ]
});


















