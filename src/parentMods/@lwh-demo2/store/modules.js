import {state} from '@mods/@lwh-demo2/store/state'
import {getters} from '@mods/@lwh-demo2/store/getters'
import {mutations} from '@mods/@lwh-demo2/store/mutations'
import {actions} from '@mods/@lwh-demo2/store/actions'
export default {
    lwh_demo2:{
        namespaced:true,
        state,
        getters,
        mutations,
        actions
    }
}
