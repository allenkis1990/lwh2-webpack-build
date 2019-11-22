export const getters = {
    initStateName: function (state) {
        return state.name + '666';
    },
    getGetters(state,getter){
        return state.name+getter.initStateName
    }
}
