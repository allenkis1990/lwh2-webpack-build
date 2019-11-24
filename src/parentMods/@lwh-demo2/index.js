/**
 * Created by Allen Liu on 2019/11/20.
 */
import fk from '@mods/@lwh-demo2/components/fk/index.vue'
import Routers from '@mods/@lwh-demo2/routers/index.js'
import Stores from '@mods/@lwh-demo2/store/modules.js'

class Demo2{
    constructor(){

    }
    install(Vue,options){
        Vue.prototype.ojbk = 'ojbk!!!!'
        console.log(options);
    }
}

var demo2 = new Demo2()

export const lwh_demo2 = demo2
export const lwh_demo2Components = {
    fk
}
export const lwh_demo2Routers = Routers
export const lwh_demo2Stores = Stores