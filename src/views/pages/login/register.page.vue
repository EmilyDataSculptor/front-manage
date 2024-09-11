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
            <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="checkPassword" label="确认密码">
            <el-input type="password" v-model="ruleForm.checkPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <Vcode :show="isShow" @success="register" @close="close" />
          <el-form-item>
            <el-button style="width: 45%" type="primary" @click="goToLogin">登录</el-button>
            <el-button style="width: 45%" type="warning" @click="determineCode">注册</el-button>
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

      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validateCheckPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {

        isShow: false,

        ruleForm: {
          username: '',
          password: '',
          checkPassword: '',
        },

        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true,validator: validatePassword, trigger: 'blur'}
          ],
          checkPassword: [
            {required: true,validator: validateCheckPassword, trigger: 'blur'}
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

    goToLogin() {  
      this.$router.push('/login'); 
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
          message: '注册成功！！！',
          type: 'success'
        });
      },

      openError() {
        this.$message.error('注册失败，请稍后再试！！！');
      },

      openUserNameError() {
        this.$message.error('用户已存在！！！');
      },

      register() {
        this.isShow = false;
        this.$refs.ruleForm.validate((valid) => {  
          if (valid) {  
          axios.post(this.$API_BASE_URL+'/user/register', {  
            username: this.ruleForm.username,  
            password: this.ruleForm.password  
        }).then(response => {
          console.log("response",response.data); 
          if(response.data.code===500){
            this.openUserNameError();  
            return false;
          }
          this.openSucess();
          this.$router.push('/login'); 
        })
        .catch(error => {  
          console.error(error);  
        })
      }else {  
        this.openError();  
        return false;  
      } 

      });
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
