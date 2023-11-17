<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                    <SideMenu></SideMenu>
                </el-aside>
            <el-container>
                <el-header>
                    <HeadMenu></HeadMenu>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import {} from "vue"
import SideMenu from "../../components/sideMenu.vue";
import HeadMenu from "../../components/headMenu.vue";
import router from "../../router";
const toAbout = ()=>{
    router.push('/about')
}
</script>

<style lang="scss" scoped>
    .common-layout{ 
        height: 100%;
    }
    .el-container{
        height: 100%;
    }
    // .el-aside{
    //     height: 100%;
    // }
    // .el-main{
    //     height: 100%;
    // }
    .el-header{
        box-shadow: 0px 0px 10px rgb(226, 223, 223);
        margin: 5px 10px 10px 10px;
        border-radius: 10px;
    }
    .el-main{
        box-shadow: 0px 0px 10px rgb(226, 223, 223);
        margin: 5px 10px 10px 10px;
        border-radius: 10px;
    }
</style>
