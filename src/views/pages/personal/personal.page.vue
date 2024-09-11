<template>
  <div>
    <el-row>
      <div class="card">
        <div class="card-header">
          <h2>
            个人中心
          </h2>
        </div>
        <div class="card-body">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input disabled v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <span>******</span>
              <el-button @click="dialogVisible = true" type="text">修改密码</el-button>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="form.nickName"></el-input>
            </el-form-item>
            <el-form-item label="头像">  
            <el-upload  
              class="avatar-uploader"  
              action="http://192.168.200.130:9000/minio/test/"  
              :show-file-list="false"  
              :on-success="handleAvatarSuccess"  
              :before-upload="beforeAvatarUpload">  
              <img v-if="form.profilePicture" :src="form.profilePicture" class="avatar">  
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>  
            </el-upload>  
          </el-form-item>

            <el-form-item label="个人简介">
              <el-input type="textarea" v-model="form.personalProfile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateMessage">立即保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-width="80px">
        <el-form-item label="旧密码">
          <el-input v-model="changePassword.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="changePassword.newPassword"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateByPassword" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
        form: {
          username:'',
          password:'',
          nickName:'',
          profilePicture:'',
          personalProfile:'',
        },
        dialogVisible: false,
        changePassword: {
          oldPassword: '',
          newPassword: ''
        },

        returnMessage:'',
        upLoadFileName:'',
      };
    },

    created() {
      this.selectListById();
    },

    methods: {

      updateMessage() {
        this.$confirm('此操作将修改个人信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateByUser();
          this.$message({
            type: 'success',
            message: '修改成功！！！'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消修改！！！'
          });          
        });
      },

      updateByUser(){
        const id = localStorage.getItem('id');
        axios.post(this.$API_BASE_URL+'/user/updateByUser',{
          id:id,
          nickName:this.form.nickName,
          profilePicture:this.upLoadFileName,
          personalProfile:this.form.personalProfile
        })  
        .then(response => {  
          console.log('selectListByIdResponse.data', response.data);
          this.$router.go(0);
        })  
        .catch(error => {  
          console.error('error', error);  
        });
      }, 

      handleAvatarSuccess(res, file) {
        if (this.upLoadFileName) { 
          this.deleteFile(this.upLoadFileName); 
        }
        this.form.profilePicture = URL.createObjectURL(file.raw);
        let formData = new FormData();     
        let blob = new Blob([file.raw], { type:'image/jpeg' });
        formData.append('file', blob, file.name); 
        this.uploadFile(formData);

      },

      uploadFile(formData){
        axios.post(this.$API_BASE_URL+'/upLoadAndDeleteFile/uploadFile', formData)  
        .then(response => {  
          console.log('文件上传成功', response.data);
          this.upLoadFileName=response.data;
        })  
        .catch(error => {  
          console.error('文件上传失败', error);  
        });
      },

      deleteFile(fileName){
        axios.post(this.$API_BASE_URL+'/upLoadAndDeleteFile/deleteFile',null,{
          params: {  
          fileName: fileName  
        }  
        })  
        .then(response => { 
          console.log('文件删除成功', response.data); 
        })  
        .catch(error => {  
          console.error('文件删除失败', error);  
        });
      },

      

      beforeAvatarUpload(file) {
        const fileType = file.type;
        const isLt5M = file.size / 1024 / 1024 < 5;
       
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return fileType && isLt5M;
      },

      updateSucess() {
        this.$message({
          message: '修改成功！！！',
          type: 'success'
        });
      },

      updateError(message) {
        this.$message.error(message+"！！！");
      },

      updateByPassword(){
        const id = localStorage.getItem('id');
        axios.post(this.$API_BASE_URL+'/user/updateByPassword',{
          id:id,
          oldPassword:this.changePassword.oldPassword,
          newPassword:this.changePassword.newPassword
        })  
        .then(response => {  
          console.log('selectListByIdResponse.data', response.data);
          this.returnMessage=response.data.msg;
          console.log('this.returnMessage', this.returnMessage);
          if(response.data.code===200){
            this.updateSucess();
            this.dialogVisible = false;
          }else{
            this.updateError(this.returnMessage);
          }
        })  
        .catch(error => {  
          console.error('error', error);  
        });
      }, 


      selectListById(){
        const id = localStorage.getItem('id');
        axios.post(this.$API_BASE_URL+'/user/selectListById',{
          id:id
        })  
        .then(response => {  
          console.log('selectListByIdResponse.data', response.data);
          this.form.username=response.data.data[0].username;
          this.form.password=response.data.data[0].password;
          this.form.nickName=response.data.data[0].nickName;
          this.form.profilePicture=response.data.data[0].profilePicture;
          this.form.personalProfile=response.data.data[0].personalProfile;
        })  
        .catch(error => {  
          console.error('error', error);  
        });
      }, 

      handleClose() {
        this.dialogVisible = false;
      }
    }
  };
</script>

<style scoped>  
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

