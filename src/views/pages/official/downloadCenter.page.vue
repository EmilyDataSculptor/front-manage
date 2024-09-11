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
              <el-input size="small" v-model="formInline.VagueMainTitle" placeholder="请输入主标题"></el-input>
            </div>
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>类型</span>
              </div>
              <el-input size="small" v-model="formInline.VagueType" placeholder="请输入类型"></el-input>
            </div>
            <div class="filter-item">
              <el-button size="small" type="primary" @click="selectVagueByMainTitleAndType">查询</el-button>
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
                width="600">
                <template v-slot="scope">  
                <span class="custom-title">{{ scope.row.mainTitle }}</span>  
              </template> 
              </el-table-column>
              <el-table-column  
              prop="downloadFile"  
              label="下载路径"  
              width="700">  
              <template slot-scope="scope">  
                <span>{{ scope.row.downloadFile }}</span>  
              </template>  
            </el-table-column>

            <el-table-column  
              prop="type"  
              label="类型"  
              width="130">  
              <template slot-scope="scope">  
                <span>{{ scope.row.type }}</span>  
              </template>  
            </el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                width="300">
                <template slot-scope="scope"> 
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
      title="添加下载内容"  
      :visible.sync="dialogVisibleByAdd"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="主标题" prop="addMainTitle">  
              <el-input v-model="form.addMainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="下载路径">  
                <el-upload
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  class="upload-demo"
                  drag
                  action="http://192.168.200.130:9000/minio/test/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item> 
            <el-form-item label="类型" prop="addType">  
              <el-input v-model="form.addType"></el-input>  
            </el-form-item> 
            

            <el-button type="primary" @click="submitForm">提交</el-button>  
            <el-button type="warning" @click="resetForm">重置</el-button>  
          </el-form>  
        </template>  
    </el-dialog> 

    <el-dialog  
      title="修改下载内容"  
      :visible.sync="dialogVisibleByUpdate"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="主标题">
              <el-input v-model="updateResponse.mainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="下载路径">  
                <el-upload
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  class="upload-demo"
                  drag
                  action="http://192.168.200.130:9000/minio/test/"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item> 
            <el-form-item label="下载路径">
              <el-input disabled v-model="updateResponse.downloadFile"></el-input>  
            </el-form-item> 
            <el-form-item label="类型">
              <el-input v-model="updateResponse.type"></el-input>  
            </el-form-item> 
            <el-button type="primary" @click="updateMessage">修改</el-button>    
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
          addDownloadFile:'',
          addType:''
        },
        rules: {
          addMainTitle: [
            {required: true, message: '主标题不能为空', trigger: 'blur' }
          ],
          addType: [
            {required: true, message: '类型不能为空', trigger: 'blur' }
          ]
        },

        formInline: {
          VagueMainTitle: '',
          VagueType: '',
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
        resultCode:'',
        resultCreationDate:'',
        fileList:[],
      };
    },
    created() {
    this.selectListByDownloadCenter();
    },
    
    methods: {

      handleRemove(){
        console.log('this.form.addDownloadFile', this.form.addDownloadFile);
        this.deleteFile(this.form.addDownloadFile);
      },

      handleAvatarSuccess(res, file,fileList) {
        this.fileList = [file];
        if (this.form.addDownloadFile) { 
          this.deleteFile(this.form.addDownloadFile); 
        }
        this.form.addDownloadFile = URL.createObjectURL(file.raw);
        let formData = new FormData();     
        let blob = new Blob([file.raw], { type:file.type });
        formData.append('file', blob, file.name); 
        this.uploadFile(formData);
      },

      uploadFile(formData){
        axios.post(this.$API_BASE_URL+'/upLoadAndDeleteFile/uploadFile', formData)  
        .then(response => {  
          console.log('文件上传成功', response.data);
          this.form.addDownloadFile=response.data;
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
            this.deleteDownloadCenter(e.id)
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

      selectVagueByMainTitleAndType() {  
        axios.get(this.$API_BASE_URL+'/downloadCenter/selectVagueByMainTitleAndType',{
          params: {
          mainTitle:this.formInline.VagueMainTitle,
          type:this.formInline.VagueType,
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

      updateDownloadCenter() {  
        axios.post(this.$API_BASE_URL+'/downloadCenter/updateDownloadCenter',{
          id:this.id,
          mainTitle:this.updateResponse.mainTitle,
          downloadFile:this.form.addDownloadFile,
          type:this.updateResponse.type
        }).then(response => { 
          console.log('response.data', response.data); 
          console.log('id', this.id); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },
    selectDownloadFileById(id) { 
        axios.get(this.$API_BASE_URL+`/downloadCenter/selectDownloadFileById?id=${id}`,{
        }).then(response => { 
          console.log('response.data', response.data);
          this.id=id;
          this.updateResponse=response.data.data[0];
        }).catch(error => {  
          console.error(error);  
      });
    },

    deleteDownloadCenter(id) { 
        axios.post(this.$API_BASE_URL+'/downloadCenter/deleteDownloadCenter',{
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
          this.deleteDownloadCenter(id);
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
    submitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {
          this.addDownloadCenter();  
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
        this.updateDownloadCenter();
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
            h('i', { style: 'color: green' }, '提交成功！！！')
          ])
        });
      },

    submitMessageError() {
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('i', { style: 'color: teal' }, '提交失败请稍后再试！！！')
          ])
        });
      },  

    submitMessageResetting() {
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('i', { style: 'color: teal' }, '重置成功!')
          ])
        });
      },
      
    submitResetForm(){
      this.$refs.formRef.resetFields();  
      },

    resetForm() {
      this.$refs.formRef.resetFields();
      this.deleteFile(this.form.addDownloadFile);
      this.fileList=[];  
      this.submitMessageResetting(); 
      },

      handleViewByadd() {
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
        this.selectDownloadFileById(id)  
        this.dialogVisibleByUpdate = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  

      addDownloadCenter() {  
        axios.post(this.$API_BASE_URL+'/downloadCenter/addDownloadCenter',{
          mainTitle:this.form.addMainTitle,
          downloadFile:this.form.addDownloadFile,
          type:this.form.addType
        }).then(response => { 
          console.log('response.data', response.data);
          this.resultCode=response.data.code;
          this.dialogVisibleByAdd = false;
          this.submitMessageSuccess();
          this.submitResetForm();
          this.$router.go(0); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },

    selectListByDownloadCenter() {  
      axios.get(this.$API_BASE_URL+'/downloadCenter/selectListByDownloadCenter',{
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
      this.selectListByDownloadCenter();
    },  
    // 当前页码改变时的处理  
    handleCurrentChange(val) {  
      this.currentPage = val; 
      this.selectListByDownloadCenter();
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
