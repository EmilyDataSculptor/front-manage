<template>
  <div class="page">
    <va-container>
      <template v-slot:header>
        <div class="container-header">
          <div class="action">
          </div>

          <div class="filter">
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>名字</span>
              </div>
              <el-input size="small" v-model="formInline.VagueName" placeholder="请输入名字"></el-input>
            </div>
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>公司</span>
              </div>
              <el-input size="small" v-model="formInline.VagueCompany" placeholder="请输入公司名称"></el-input>
            </div>
            <div class="filter-item">
              <el-button size="small" type="primary" @click="selectVagueByMainTitleAndCompanyOnSubmitted">查询</el-button>
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
                prop="name"
                label="名字"
                width="100">
                <template v-slot="scope">  
                <span class="custom-title">{{ scope.row.name }}</span>  
              </template> 
              </el-table-column>
              <el-table-column  
              prop="company"  
              label="公司"  
              width="200">  
              <template slot-scope="scope">  
                <span>{{ scope.row.company }}</span>  
              </template>  
            </el-table-column>

            <el-table-column  
              prop="email"  
              label="邮箱"  
              width="250">  
              <template slot-scope="scope">  
                <span>{{ scope.row.email }}</span>  
              </template>  
            </el-table-column>

            <el-table-column  
              prop="phone"  
              label="电话"  
              width="150">  
              <template slot-scope="scope">  
                <span>{{ scope.row.phone }}</span>  
              </template>  
            </el-table-column>
              
              <el-table-column  
              prop="content"  
              label="留言内容"  
              width="500">  
              <template slot-scope="scope">  
                <span>  
                  {{ scope.row.content.slice(0, 500) + (scope.row.content.length > 500 ? '...' : '') }}  
                </span>  
              </template>  
            </el-table-column>
              <el-table-column  
              prop="creationDate"  
              label="留言日期"  
              width="120">  
              <template slot-scope="scope">  
                <span>  
                  {{ scope.row.creationDate.slice(0, 10) }}  
                </span>  
              </template>  
            </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="360">
                <template slot-scope="scope"> 
                <el-button type="success" round  @click="checkDetails(scope.row.id)">查看</el-button>
                <el-button type="danger" round @click="handleViewByUpdate(scope.row.id)">驳回</el-button>
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
            <el-form-item label="名字">
              <span style="font-weight: bold;color:green;font-size: 25px; ">{{ updateResponse.name }}</span>
            </el-form-item> 
            <el-form-item label="公司">  
              <span>{{ updateResponse.company}}</span> 
            </el-form-item>   
            <el-form-item label="邮箱">  
              <span>{{ updateResponse.email}}</span> 
            </el-form-item> 
            <el-form-item label="电话">  
              <span>{{ updateResponse.phone}}</span> 
            </el-form-item> 
            <el-form-item label="留言内容">  
              <span>{{ updateResponse.content }}</span> 
            </el-form-item>  
            <el-form-item label="留言日期">  
              <span>{{ checkResultCreationDate }}</span> 
            </el-form-item>
            <el-form-item label="答复内容">  
              <span>{{ updateResponse.reply }}</span> 
            </el-form-item>
            <el-form-item label="答复日期">  
              <span>{{ checkResultReplyDate }}</span> 
            </el-form-item>
          </el-form>  
        </template>  
    </el-dialog> 

    <el-dialog  
      title="驳回答复"  
      :visible.sync="dialogVisibleByUpdate"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  
            <el-form-item label="名字">
              <el-input disabled v-model="updateResponse.name"></el-input>  
            </el-form-item> 
            <el-form-item label="公司">  
              <el-input disabled v-model="updateResponse.company"></el-input>  
            </el-form-item>
            <el-form-item label="邮箱">  
              <el-input disabled v-model="updateResponse.email"></el-input>  
            </el-form-item>
            <el-form-item label="电话">  
              <el-input disabled v-model="updateResponse.phone"></el-input>  
            </el-form-item>
            <el-form-item label="留言内容">  
              <el-input disabled type="textarea" v-model="updateResponse.content"></el-input>  
            </el-form-item>
            <el-form-item label="留言日期">  
              <el-input disabled v-model="checkResultCreationDate"></el-input>  
            </el-form-item>
            <el-form-item label="答复内容">  
              <el-input disabled type="textarea" v-model="updateResponse.reply"></el-input>  
            </el-form-item> 
            <el-form-item label="驳回理由" prop="resRejectReason">  
              <el-input type="textarea" v-model="form.resRejectReason"></el-input>  
            </el-form-item> 
            <el-button type="primary" @click="updateMessage">提交</el-button>  
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
          resRejectReason:'',
         
        },
        rules: {
          resRejectReason: [
            {required: true, message: '驳回理由不能为空', trigger: 'blur' }
          ],
        },

        formInline: {
          VagueName: '',
          VagueCompany: '',
        },

        labelPosition: 'left',

        // 控制弹窗显示与隐藏的变量  
        dialogVisible: false,
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
        checkResultCreationDate:'',
        checkResultReplyDate:''
      };
    },
    created() {
    this.selectListOnSubmittedByContactUs();
    },
    
    methods: {

      checkDetails(id) {
        this.selectListByIdOnSubmitted(id)  
        this.dialogVisible = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  
    
    

      handleSelectionChange(val) {   
          console.log(val);  
          this.checkBoxData=val;
        }, 

      selectVagueByMainTitleAndCompanyOnSubmitted() {  
        axios.get(this.$API_BASE_URL+'/contactUs/selectVagueByMainTitleAndCompanyOnSubmitted',{
          params: {
          name:this.formInline.VagueName,
          company:this.formInline.VagueCompany,
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
            message: '驳回成功！！！'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回！！！'
          });          
        });
      },

      rejectContactUsOnSubmitted() {  
        axios.post(this.$API_BASE_URL+'/contactUs/rejectContactUsOnSubmitted',{
          id:this.id,
          rejectReason:this.form.resRejectReason
        }).then(response => { 
          console.log('response.data', response.data); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },
    selectListByIdOnSubmitted(id) { 
        axios.get(this.$API_BASE_URL+`/contactUs/selectListByIdOnSubmitted?id=${id}`,{
        }).then(response => {
          console.log('response.data', response.data); 
          this.id=id;
          this.updateResponse=response.data.data[0];
          this.form.resRejectReason=this.updateResponse.rejectReason;
          if (this.updateResponse.creationDate) { 
            this.checkResultCreationDate=this.updateResponse.creationDate.slice(0, 10);
          }
          if (this.updateResponse.replyDate) { 
            this.checkResultReplyDate=this.updateResponse.replyDate.slice(0, 10);
          }
        }).catch(error => {  
          console.error(error);  
      });
    },
    submitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {
          this.addContactUs();  
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
        this.rejectContactUsOnSubmitted();
        this.dialogVisibleByUpdate=true;
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
      this.submitMessageResetting(); 
      },

      handleViewByUpdate(id) {
        this.selectListByIdOnSubmitted(id)  
        this.dialogVisibleByUpdate = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        }, 

    selectListOnSubmittedByContactUs() {  
      axios.get(this.$API_BASE_URL+'/contactUs/selectListOnSubmittedByContactUs',{
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
      this.selectListOnSubmittedByContactUs();
    },  
    // 当前页码改变时的处理  
    handleCurrentChange(val) {  
      this.currentPage = val; 
      this.selectListOnSubmittedByContactUs();
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
