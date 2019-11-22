<template>
    <div>
        test
        {{$store.state.job}}
    </div>
</template>

<script>
    export default {
        mounted() {

        },
        methods: {

        }
    }
</script>

<!--要想全局的body能吃到样式就必须再开一个不带scope的style标签-->
<style lang="less">
    @import "~@portal/less/style1.less";
</style>