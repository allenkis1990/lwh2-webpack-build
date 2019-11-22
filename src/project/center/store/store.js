import Vue from 'vue'
import Vuex from 'vuex'
import {state} from '@center/store/state'
import {mutations} from '@center/store/mutations'
import {getters} from '@center/store/getters'
import {actions} from '@center/store/actions'
import {modules} from '@center/store/modules'



Vue.use(Vuex);
export default new Vuex.Store({
    // namespaced:true,
    strict:true,
    state,
    mutations,
    getters,
    actions,
    modules:{
        ...modules
    }
})





