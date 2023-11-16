<template>
    <div class="common-layout">
        <el-container>
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">Aside1</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import {} from "vue"
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
</style>
