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
                <el-input v-model="formLabelAlign.password" placeholder="请输入密码" show-password/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import http from '../../api/http'
import { ElMessage } from 'element-plus'
const formLabelAlign = reactive({
  username: '',
  password: ''

})
const router = useRouter()
const onLogin = ()=>{
    http.post('/login',{
        username:formLabelAlign.username,
        password:formLabelAlign.password
    }).then(function (response) {
        if(response.data.login == 'ok'){
            let token = response.data.token
            localStorage.setItem('token',JSON.stringify(token))
            ElMessage({
                message: '登陆成功',
                type: 'success',
            })
            router.push('/home')
        }else if(response.data.login == 'pwdErro'){
            ElMessage({
                message: '密码错误，请检查您的密码',
                type: 'error',
            })
        }else{
            ElMessage({
                message: '没有此管理员，您不是管理员！',
                type: 'error',
            })
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

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
