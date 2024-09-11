<template>
  <div class="login-page">
    <div class="box">
      <div class="dec">
        <div class="title">
          <span>Welcome</span>
          <span>后台管理系统</span>
        </div>
        <div class="support">
          <a href="javascript:;" style="color: #ccc">技术支持</a>
        </div>
      </div>
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <Vcode :show="isShow" @success="success('ruleForm')" @close="close" />
          <el-form-item style="margin-bottom: 10px">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="determineCode" style="width: 45%" type="primary">登录</el-button>
            <el-button style="width: 45%" type="warning" @click="goToRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import Vcode from "vue-puzzle-vcode";
import axios from 'axios';
export default {
    data() {
      return {

        isShow: false,

        ruleForm: {
          username: 'admin',
          password: 'admin',
          token:'',
          id: 0,
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        },
        checked: true
      };
    },
    created() {
      this.__setDocumentTitle('登录');
    },

    components: {
    Vcode
    },
    methods: {

    goToRegister() {  
      this.$router.push('/register'); 
    },

    determineCode(){
      this.isShow = true;
    },
    
    success(formName) {
      this.isShow = false;
      this. LoginSubmitForm(formName);
    },
    close() {
      this.isShow = false;
    },

      openSucess() {
        this.$message({
          message: '登录成功！！！',
          type: 'success'
        });
      },

      openError() {
        this.$message.error('账号或者密码错误！！！');
      },

      LoginSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            axios.post(this.$API_BASE_URL+'/user/login', {  
          username: this.ruleForm.username,  
          password: this.ruleForm.password  
        }).then(response => { 
          console.log('response.data', response.data);
          if (response.data.code===200){
            this.ruleForm.token=response.data.msg.split("_")[1];
            window.localStorage.setItem('token', this.ruleForm.token);
            window.localStorage.setItem('id', response.data.data.id);
            console.log('this.ruleForm.token', this.ruleForm.token);
          if (this.$route.query.__redirect) {  
            const redirect = this.$route.query.__redirect;  
            const query = { ...this.$route.query };  
            delete query.__redirect;  
            this.$router.replace({  
              name: redirect,  
              query  
            });  
          } else {  
            this.$router.replace('/');  
          }
          this.openSucess();
        }
        else{
          this.openError();
        }  
        }).catch(error => {  
          console.error(error);  
        });  
             }
      else {  
              return false;
            } 
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="scss">

  .login-page {
    width: 100%;
    height: 100%;
    background-color: #2a3f54;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
      width: 800px;
      height: 400px;
      background-color: rgba(255, 255, 255, .1);
      border-radius: 4px;
      display: flex;
      overflow: hidden;

      > div {
        height: 100%;
        width: 50%;
      }

      .form {
        background-color: #fff;
        padding: 30px 34px;
      }
    }

    .el-form-item__label {
      line-height: 20px;
      position: relative;
      left: -11px;
    }

    .el-input__inner {
      border-radius: 0;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      padding: 0;
      height: 28px;
    }
    .el-form-item__error {
      padding-top: 0;
    }

    .code {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;


      .code-con {
        position: relative;
        bottom: 28px;
      }
    }

    .dec {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 30px;

      .title {
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span:nth-child(1) {
          font-size: 60px;
          color: #fff;
          font-weight: bold;
        }

        span:nth-child(2) {
          color: #fff;
          font-size: 30px;

        }
      }
    }
  }
</style>
