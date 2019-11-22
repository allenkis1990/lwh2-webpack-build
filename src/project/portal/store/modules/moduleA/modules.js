import {state} from '@portal/store/modules/moduleA/state'
import {getters} from '@portal/store/modules/moduleA/getters'
import {mutations} from '@portal/store/modules/moduleA/mutations'
import {actions} from '@portal/store/modules/moduleA/actions'

export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
