import {state} from '@center/store/modules/moduleA/state'
import {getters} from '@center/store/modules/moduleA/getters'
import {mutations} from '@center/store/modules/moduleA/mutations'
import {actions} from '@center/store/modules/moduleA/actions'

export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
