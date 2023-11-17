<template>
    <el-menu
        :default-active="router.currentRoute.value.fullPath"
        class="el-menu-vertical-demo"
        :router="true"
      >
      <div class="log">
        <el-image style="width: 200px; height: 200px" src="/img/logo.png" fit="scale-down" />
      </div>
      <el-menu-item index="/home/index">
          <el-icon><House /></el-icon>
          <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/home/user">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/home/business">
          <el-icon><Shop /></el-icon>
          <span>商家管理</span>
      </el-menu-item>
      <el-menu-item index="/home/food">
          <el-icon><Food /></el-icon>
          <span>餐品管理</span>
      </el-menu-item>
      <el-menu-item index="/home/order">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
      </el-menu-item>
    </el-menu>
</template>

<script setup>
import { useRouter } from 'vue-router';

    const router = useRouter()
</script>

<style lang="scss" scoped>
.el-menu{
    border-right: none;
    background: rgb(81, 81, 82);
    height: 100%;
}
.el-menu-item{
    color: white;
    transition: all 1s;
    .el-icon{
        width: 30px;
        padding: 2px;
        border-radius: 10px;
        font-size: 30px;
        background: rgb(73, 73, 74);
        box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
    }
}
.is-active{
    background-color:rgb(149, 149, 152);
    box-shadow: 0 20px 27px rgb(149, 149, 152);
    margin-left: 20px;
    border-radius: 15px;
    transition: all 1s;
    .el-icon{
        background-color: red;
    }
    .el-icon svg{
        color: white;
    }

}
</style>
