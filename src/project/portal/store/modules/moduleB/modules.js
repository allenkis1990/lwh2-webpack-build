/**
 * Created by Allen Liu on 2019/11/15.
 */
import {state} from '@portal/store/modules/moduleB/state'
import {getters} from '@portal/store/modules/moduleB/getters'
import {mutations} from '@portal/store/modules/moduleB/mutations'
import {actions} from '@portal/store/modules/moduleB/actions'

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}