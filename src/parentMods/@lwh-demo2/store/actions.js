
//actions的context相当于整个store可以调用state mutations getters调用的时候this.$store.dispatch('changeName')
export const actions={
    actionsChange: function (context, name) {
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                context.commit('changeNickName', name);
                resolve(name)
            },2000)
        })
    }
}
