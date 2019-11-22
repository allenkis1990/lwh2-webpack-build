export const mutations = {
    //第一个参数state是固定store里的state  第二个开始才是真正的传参
    moduleAChangeName: function (state, name) {
        state.moduleAName = name;
    },
    changeName(state,name){
        state.moduleAName = name;
    }
}
