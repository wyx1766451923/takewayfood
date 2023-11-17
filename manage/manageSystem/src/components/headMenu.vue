<template>
  <div class="header">
    <div class="title">
        奋斗外卖平台管理系统
    </div>
    <div class="admin">
        <div class="avatar">
            <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
        </div>
        <div class="adminName">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ 'admin' }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    .header{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }
    .title{
        font-size: 24px;
        margin: auto 0;
        color: rgb(88, 87, 87);
    }
    .admin{
        display: flex;
        cursor: pointer;
        .avatar{
            margin: auto 0;
        }
        .adminName{
            margin: auto 0;
        }
    }
</style>
