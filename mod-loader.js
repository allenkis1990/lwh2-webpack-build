
import {lwh_demo2,lwh_demo2Components,lwh_demo2Routers,lwh_demo2Stores} from '@mods/@lwh-demo2/index'
//模块多了后一个个合并进来
export const Routers = [...lwh_demo2Routers]
export const Stores = {...lwh_demo2Stores}
export const Components = {...lwh_demo2Components}
export default function(Vue){
    Vue.use(lwh_demo2)
}