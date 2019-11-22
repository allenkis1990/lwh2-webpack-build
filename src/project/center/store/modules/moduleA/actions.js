
//actions的context相当于整个store可以调用state mutations getters调用的时候this.$store.dispatch('changeName')
export const actions={
  moduleAChangeName:function(context,name){
    context.commit('moduleAChangeName',name);
  }
}
