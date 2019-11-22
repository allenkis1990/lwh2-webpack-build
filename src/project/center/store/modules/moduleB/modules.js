/**
 * Created by Allen Liu on 2019/11/15.
 */
import {state} from '@center/store/modules/moduleB/state'
import {getters} from '@center/store/modules/moduleB/getters'
import {mutations} from '@center/store/modules/moduleB/mutations'
import {actions} from '@center/store/modules/moduleB/actions'

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}