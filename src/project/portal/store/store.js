import Vue from 'vue'
import Vuex from 'vuex'
import {state} from '@portal/store/state'
import {mutations} from '@portal/store/mutations'
import {getters} from '@portal/store/getters'
import {actions} from '@portal/store/actions'
import {modules} from '@portal/store/modules'
import {Stores} from '@portal/utils/mod-loader'

Vue.use(Vuex);
export default new Vuex.Store({
    // namespaced:true,
    strict:true,
    state,
    mutations,
    getters,
    actions,
    modules:{
        ...Stores,
        ...modules
    }
})





