<template>
    <div>
        @lwh-demo2
        <div>
            state:{{nickName}}
        </div>
        <div>
            getters:{{getNickName}}
        </div>
        <div>
            <button @click="changeNickName('hahahah')">mutations</button>
        </div>
        <div>
            <button @click="asyncChangeName()">actions</button>
        </div>
        <div>component: <fk></fk>  </div>
    </div>
</template>

<script>
    import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
    import fk from '@mods/@lwh-demo2/components/fk/index.vue'
    export default {
        data() {
            return {}
        },
        computed:{
            ...mapState('lwh_demo2',['nickName']),
            ...mapGetters('lwh_demo2',['getNickName'])
        },
        components: {
            fk
        },
        mounted() {

        },
        methods: {
            ...mapMutations('lwh_demo2',['changeNickName']),
            ...mapActions('lwh_demo2',['actionsChange']),
            asyncChangeName(){
                this.actionsChange('2秒后改变nickName').then(function(data){
                    console.log(data);
                })
            }
        }
    }
</script>
<style>
    body, html {
        width: 100%;
        height: 100%;
    }
</style>
<!--scoped-->
