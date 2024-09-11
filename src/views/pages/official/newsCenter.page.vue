<template>
  <div class="page">
    <va-container>
      <template v-slot:header>
        <div class="container-header">
          <div class="action">
            <el-button size="small" type="primary" icon="el-icon-plus" circle @click="handleViewByadd"></el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" circle @click="DeleteMultiple"></el-button>
          </div>

          <div class="filter">
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>主标题</span>
              </div>
              <el-input size="small" v-model="formInline.VagueMainTitle" placeholder="主标题"></el-input>
            </div>
            <div class="filter-item">
              <el-button size="small" type="primary" @click="selectVagueByMainTitle">查询</el-button>
            </div>
          </div>
        </div>

      </template>
      <template v-slot:body>
        
        <div class="card">
          <div class="card-body">
            <va-table
              @selection-change="handleSelectionChange" 
              :va-table-filter-cancel="vaTableFilterCancel"
              :va-table-filter-confirm="vaTableFilterConfirm"
              ref="table"
              :data="responseList"
              style="width: 100%">
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                fixed
                prop="mainTitle"
                label="主标题"
                width="250">
                <template v-slot="scope">  
                <span class="custom-title">{{ scope.row.mainTitle }}</span>  
              </template> 
              </el-table-column>
              <el-table-column
              prop="indexPicture"  
              label="首页展示图片"  
              width="260"> <!-- 可选，设置列宽 -->  
              <template slot-scope="scope">  
              <div class="image-container">  
                <img :src="scope.row.picture" alt="首页展示图片" class="hover-image">  
              </div>  
            </template>  
              </el-table-column>
              <el-table-column  
              prop="content"  
              label="内容"  
              width="500">  
              <template slot-scope="scope">  
                <span>  
                  {{ scope.row.content.slice(0, 500) + (scope.row.content.length > 500 ? '...' : '') }}  
                </span>  
              </template>  
            </el-table-column>
              <el-table-column  
              prop="creationDate"  
              label="创建日期"  
              width="150">  
              <template slot-scope="scope">  
                <span>  
                  {{ scope.row.creationDate.slice(0, 10) }}  
                </span>  
              </template>  
            </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="500">
                <template slot-scope="scope"> 
                <el-button type="success" round  @click="checkDetails(scope.row.id)">查看</el-button>
                <el-button type="warning" round @click="handleViewByUpdate(scope.row.id)">修改</el-button>
                <el-button type="danger" round @click="deleteMessage(scope.row.id)">删除</el-button>
              </template> 
              </el-table-column>
            </va-table>
          </div>
        </div>

      </template>
      <template v-slot:footer>
        <div class="container-footer">
          <el-pagination
              @size-change="handleSizeChange"  
              @current-change="handleCurrentChange"  
              :current-page="currentPage"  
              :page-sizes="[10, 20, 30, 40]"  
              :page-size="pageSize"  
              layout="total, sizes, prev, pager, next, jumper"  
              :total="total">  
          </el-pagination>
        </div>
      </template>
    </va-container>


    <el-dialog  
      title="查看详情"  
      :visible.sync="dialogVisible"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  
            <el-form-item label="主标题">
              <span style="font-weight: bold;color:green;font-size: 25px; ">{{ updateResponse.mainTitle }}</span>
            </el-form-item> 
            <el-form-item label="首页展示图片">  
              <img :src="updateResponse.picture" style="width: 500px; height: auto;">
            </el-form-item>  
            <el-form-item label="内容">  
              <span>{{ updateResponse.content }}</span> 
            </el-form-item>  
          </el-form>  
        </template>  
    </el-dialog> 
   

    <el-dialog  
      title="添加新闻"  
      :visible.sync="dialogVisibleByAdd"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="主标题" prop="addMainTitle">  
              <el-input v-model="form.addMainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="首页展示图片">  
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
            <el-form-item label="内容" prop="addContent">  
              <el-input type="textarea" v-model="form.addContent"></el-input>  
            </el-form-item> 

            <el-button type="primary" @click="submitForm">提交</el-button>  
            <el-button type="warning" @click="resetForm">重置</el-button>  
          </el-form>  
        </template>  
    </el-dialog> 

    <el-dialog  
      title="修改新闻"  
      :visible.sync="dialogVisibleByUpdate"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  
            <el-form-item label="主标题">
              <el-input v-model="updateResponse.mainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="首页展示图片">  
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
            <el-form-item label="内容">  
              <el-input type="textarea" v-model="updateResponse.content"></el-input>  
            </el-form-item> 
            <el-button type="warning" @click="updateMessage">修改</el-button>  
          </el-form>  
        </template>  
    </el-dialog> 
   

  </div>

  

</template>

<script>
  import axios from 'axios';
  export default {

    data() {
      return {
        form: {
          addMainTitle:'',
          addContent:'',
          profilePicture:'',
        },
        rules: {
          addMainTitle: [
            {required: true, message: '主标题不能为空', trigger: 'blur' }
          ],
          addContent: [
            {required: true, message: '内容不能为空', trigger: 'blur' }
        ]
        },
        formInline: {
          VagueMainTitle: '',
        },

        labelPosition: 'left',

        // 控制弹窗显示与隐藏的变量  
        dialogVisible: false,
        dialogVisibleByAdd:false,
        dialogVisibleByUpdate:false,
        
        // 假设这是你将从后台获取并存储的产品数据 
        responseList: [],
        id:1, 
        updateResponse:[],
        checkBoxData:[],
        currentPage: 1, // 当前页码  
        pageSize: 10, // 每页显示的数量  
        total: 0, // 总记录数  
      };
    },
    created() {
    this.selectListByNewsCenter();
    },
    
    methods: {

      checkDetails(id) {
        this.selectListById(id)  
        this.dialogVisible = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  
      DeleteMultiple() {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("this.checkBoxData",this.checkBoxData); 
          this.checkBoxData.forEach(e=>{
            this.deleteNewsCenter(e.id)
          }) 
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });          
        });
      },
    

      handleSelectionChange(val) {   
          console.log(val);  
          this.checkBoxData=val;
        }, 

      selectVagueByMainTitle() {  
        axios.get(this.$API_BASE_URL+'/newsCenter/selectVagueByMainTitle',{
          params: {
          mainTitle:this.formInline.VagueMainTitle,
          currentPage: this.currentPage,  
          pageSize: this.pageSize,
          }
        }).then(response => { 
          console.log('response.data', response.data); 
          this.responseList = response.data.data;
          this.total=Number(response.data.msg.split("_")[1]);
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },

      updateMessage() {
        this.$confirm('此修改操作将不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateSubmitForm();
          this.$message({
            type: 'success',
            message: '修改成功！！！'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改！！！'
          });          
        });
      },

      updateNewsCenter() {  
        axios.post(this.$API_BASE_URL+'/newsCenter/updateNewsCenter',{
          id:this.id,
          mainTitle:this.updateResponse.mainTitle,
          content:this.updateResponse.content,
          picture:this.form.profilePicture
        }).then(response => { 
          console.log('response.data', response.data); 
          console.log('id', this.id); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },
    selectListById(id) { 
        axios.get(this.$API_BASE_URL+`/newsCenter/selectListById?id=${id}`,{
        }).then(response => { 
          console.log('response.data', response.data); 
          this.id=id;
          this.updateResponse=response.data.data[0];
          this.form.profilePicture=response.data.data[0].picture;
        }).catch(error => {  
          console.error(error);  
      });
    },

    deleteNewsCenter(id) { 
        axios.post(this.$API_BASE_URL+'/newsCenter/deleteNewsCenter',{
          id:id
        }).then(response => { 
          console.log('response.data', response.data); 
          this.$router.go(0);
        }).catch(error => {  
          console.error(error);  
      });
    },

    deleteMessage(id) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNewsCenter(id);
          this.$message({
            type: 'success',
            message: '删除成功！！！'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除！！！'
          });          
        });
      },

      handleAvatarSuccess(res, file) {
        if (this.form.profilePicture) { 
          this.deleteFile(this.form.profilePicture); 
        }
        this.form.profilePicture = URL.createObjectURL(file.raw);
        let formData = new FormData();     
        let blob = new Blob([file.raw], { type:'image/jpeg' });
        formData.append('file', blob, file.name); 
        this.uploadFile(formData);
      },

      beforeAvatarUpload(file) {
        const fileType = file.type;
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return fileType && isLt5M;
      },

    uploadFile(formData){
        axios.post(this.$API_BASE_URL+'/upLoadAndDeleteFile/uploadFile', formData)  
        .then(response => {  
          console.log('文件上传成功', response.data);
          this.form.profilePicture=response.data;
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

    submitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {  
        this.addNewsCenter();
        this.dialogVisibleByAdd = false;
        this.submitResetForm();
        this.submitMessageSuccess();
        this.$router.go(0);
        return true;
        } else {  
          this.submitMessageError();
          return false;  
        }  
      });  
    },
    
    updateSubmitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {  
        this.updateNewsCenter();
        this.$router.go(0);
        return true;
        } else {  
          return false;  
        }  
      });  
    }, 

    submitMessageSuccess() {
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('span', null, ''),
            h('i', { style: 'color: teal' }, '提交成功!')
          ])
        });
      },

    submitMessageError() {
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('span', null, ''),
            h('i', { style: 'color: teal' }, '提交失败请稍后再试!')
          ])
        });
      },  

    submitMessageResetting() {
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('span', null, ''),
            h('i', { style: 'color: teal' }, '重置成功!')
          ])
        });
      },
      
    submitResetForm(){
      this.$refs.formRef.resetFields();  
      this.form.profilePicture = null;
      },

    resetForm() {
      console.log('this.form.profilePicture', this.form.profilePicture); 
      this.$refs.formRef.resetFields();  
      this.deleteFile(this.form.profilePicture);
      this.form.profilePicture = null;
      this.submitMessageResetting(); 
      },

      handleViewByadd() {
        this.form.profilePicture = null;  
        this.dialogVisibleByAdd = true; 
        },   
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        }, 

      handleViewByUpdate(id) {
        this.selectListById(id)  
        this.dialogVisibleByUpdate = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  

      addNewsCenter() {  
        axios.post(this.$API_BASE_URL+'/newsCenter/addNewsCenter',{
          mainTitle:this.form.addMainTitle,
          content:this.form.addContent,
          picture:this.form.profilePicture
        }).then(response => { 
          console.log('response.data', response.data); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },

    selectListByNewsCenter() {  
      axios.get(this.$API_BASE_URL+'/newsCenter/selectListByNewsCenter',{
        params: {  
          currentPage: this.currentPage,  
          pageSize: this.pageSize, 
        }, 
      })
    .then(response => {  
          // 处理成功响应，例如显示成功消息 
        this.responseList = response.data.data;
        this.total=Number(response.data.msg.split("_")[1]);
        console.log("this.responseList",this.responseList)
        console.log("this.total",this.total)
        })
     .catch(error => {  
      // 处理错误  
      console.error(error);  
    });  

    },

    // 分页大小改变时的处理  
    handleSizeChange(val) {  
      this.pageSize = val; 
      this.selectListByNewsCenter();
    },  
    // 当前页码改变时的处理  
    handleCurrentChange(val) {  
      this.currentPage = val; 
      this.selectListByNewsCenter();
    },

    vaTableFilterCancel() {
        this.$message.warning('取消查询');
        return Promise.resolve();
      },

    vaTableFilterConfirm(data) {
        this.$message.info(JSON.stringify(data));
        return Promise.resolve();
      }
    }
  };
</script>
<style scoped lang="scss">
  .container-header {
    padding: 20px 30px;
    border-bottom: 1px solid #eaeaea;
    background: #fff;
    z-index: 9;
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .container-footer {
    padding: 20px 30px;
    background: #fff;
    box-shadow: -3px -2px 6px 0 rgba(58, 58, 58, 0.1);
    z-index: 9;
    position: relative;
  }

  .filter {
    display: flex;

    .filter-item {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }

    .filter-title {
      display: flex;
      justify-content: center;
    }
  }

.image-container {  
  width: 100%; 
  overflow: hidden; 
  position: relative;
}  
  
.hover-image {  
  width: 100%;  
  height: auto; 
  transition: transform 0.3s ease; 
}   
.image-container:hover .hover-image {  
  transform: scale(1.5);   
} 

.custom-title {  
  font-weight: bold;  
  color: green; 
  font-size: 16px; 
}   
  
.center-wrapper {  
  width: 100%;  
  display: flex; 
  justify-content: center;  
}

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
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border: 2px dashed #08ac9e;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

</style>
