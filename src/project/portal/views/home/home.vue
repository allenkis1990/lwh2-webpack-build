<template>
    <div>
        <div class="main" v-if="$route.name==='home'">
            <div>parent Hello Home!11112</div>
            <ul>
                <li><a href="javascript:void(0)" @click="goState('home')">/portal</a></li>
                <li><a href="javascript:void(0)" @click="goState('test')">test</a></li>
            </ul>
            <!--<img src="@portal/images/afei.jpg">
            <img src="@portal/images/皮卡22.jpg">-->
            <div class="lwh">lwh</div>
            <div class="bgImg"></div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
//            console.log(this.$http,'this');
            this.$http.get('/aaa', {
                params: {
                    a: '1'
                },
                headers: {
                    fuck: '2222'
                }
            }).then((data) => {
                if(data){
                    console.log(data.data, 'this');
                }
            })
        },
        methods: {
            goState: function (stateName) {
                this.$router.push({name: stateName});
            },
            goPath: function (path) {
                this.$router.push({path: path});
            }
        }
    }
</script>

<style scoped lang="less">
    /*如果在scoped的情况下引用的less里面带全局的标签例如body那么body就会变成body[data-1212]{}引用不到*/
    /*@import "~@portal/style/color.css";*/
    /*@import "~@portal/less/style1.less";*/
    .main {
        color: green;
        .lwh {
            color: red;
        }
    }

    .bgImg {
        width: 850px;
        height: 700px;
        background: url('~@portal/images/皮卡22.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>
<!--要想全局的body能吃到样式就必须再开一个不带scope的style标签-->
<style lang="less">
    @import "~@portal/less/style1.less";
</style>