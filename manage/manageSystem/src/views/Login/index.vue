<template>
  <div class="login">
    <div class="loginForm">
        <div class="hello">hello !</div>
        <div class="title">欢迎登录奋斗平台管理系统</div>
        <el-form
            :model="formLabelAlign"
        >
            <el-form-item>
                <el-input v-model="formLabelAlign.username" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model="formLabelAlign.password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
const formLabelAlign = reactive({
  username: '',
  password: ''

})
</script>

<style lang="scss" scoped>

    .login{
        width: 100%;
        height: 100%;
        background-image: url('/img/bg.jpg');
        background-position: center;
        .loginForm{
            .hello{
                font-size: 30px;
                color: white;
            }
            .title{
                margin: 15px 0;
                font-size: 16px;
                color: white;
            }
            box-shadow: 0 0 15px rgb(196, 191, 237);
            z-index: 100;
            width: 300px;
            padding: 10px;
            position: absolute;
            right: 200px;
            top: 30%;
            .el-form{
                margin:auto;
            }
            .el-form-item{
                width: 80%;
                margin: 15px auto;
                .el-button{
                    width: 100%;
                }
            }
        }
    }
</style>
