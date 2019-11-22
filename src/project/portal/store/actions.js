//actions的context相当于整个store可以调用state mutations getters调用的时候this.$store.dispatch('changeName')
export const actions = {
    changeName: function (context, name) {

        context.commit('changeName', name);
    },
    alert({commit,dispatch,state,getters},num){
        // console.log(arguments);
        console.log('state:',state)
        console.log('getters:',getters)
        console.log('commit:',commit)
        console.log('dispatch:',dispatch)
        // dispatch('asyncAlert','123').then(function(data){
        //     console.log(data);
        // })
        return num
        // alert(num);
    },
    asyncAlert(context,num){
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve(num)
            },2000)
        })
    }
}
