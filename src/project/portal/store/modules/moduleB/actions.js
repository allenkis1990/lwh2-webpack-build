export const actions = {
    actionFuck: function (context, name) {
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                context.commit('mutationFuck',name)
                resolve('actions is ok')
            },2000)
        })
    }
}
