<template>
    <div id="appRoot">
        <transition name="fuck" appear>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
        <transition name="fuck" appear>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        mounted(){
            console.log(1);
        },
        data(){
            return {}
        },
        methods: {

        }
    }
</script>
<style lang="less">
    @import "~@portal/less/style1.less";
</style>
<style>
</style>
