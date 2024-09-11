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
              <el-button size="small" type="primary" @click="selectVagueByMainTitleAndCompany">查询</el-button>
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
                <el-button type="warning" round @click="handleViewByUpdate(scope.row.id)">答复</el-button>
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
              <span>{{ resultCreationDate }}</span> 
            </el-form-item> 
            <el-form-item label="答复内容">  
              <span>{{ updateResponse.reply }}</span> 
            </el-form-item> 
            <el-form-item label="答复日期">  
              <span>{{ resultReplyDate }}</span> 
            </el-form-item> 
            <el-form-item label="驳回理由">  
              <span>{{ updateResponse.rejectReason }}</span> 
            </el-form-item> 
          </el-form>  
        </template>  
    </el-dialog> 
   

    <el-dialog  
      title="添加客户联系"  
      :visible.sync="dialogVisibleByAdd"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="名字" prop="addName">  
              <el-input v-model="form.addName"></el-input>  
            </el-form-item> 
            <el-form-item label="公司" prop="addCompany">  
              <el-input v-model="form.addCompany"></el-input>  
            </el-form-item> 
            <el-form-item label="邮箱" prop="addEmail">  
              <el-input v-model="form.addEmail"></el-input>  
            </el-form-item> 
            <el-form-item label="电话" prop="addPhone">  
              <el-input v-model="form.addPhone"></el-input>  
            </el-form-item> 
            <el-form-item label="留言内容" prop="addContent">  
              <el-input type="textarea" v-model="form.addContent"></el-input>  
            </el-form-item> 

            <el-button type="primary" @click="submitForm">提交</el-button>  
            <el-button type="warning" @click="resetForm">重置</el-button>  
          </el-form>  
        </template>  
    </el-dialog> 

    <el-dialog  
      title="答复客户疑问"  
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
              <el-input disabled v-model="resultCreationDate"></el-input>  
            </el-form-item>
            <el-form-item label="答复内容">  
              <el-input type="textarea" v-model="updateResponse.reply"></el-input>  
            </el-form-item> 
            <el-form-item label="答复日期">  
              <el-input disabled v-model="resultReplyDate"></el-input>  
            </el-form-item>
            <el-form-item label="驳回内容">  
              <el-input disabled v-model="updateResponse.rejectReason"></el-input>  
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
          addName:'',
          addCompany:'',
          addEmail:'',
          addPhone:'',
          addContent:'',
        },
        rules: {
          addName: [
            {required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          addCompany: [
            {required: true, message: '公司不能为空', trigger: 'blur' }
          ],
          addEmail: [
            {required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          addPhone: [
            {required: true, message: '电话不能为空', trigger: 'blur' }
          ],
          addContent: [
            {required: true, message: '留言内容不能为空', trigger: 'blur' }
        ]
        },

        formInline: {
          VagueName: '',
          VagueCompany: '',
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
        resultReplyDate:'',
      };
    },
    created() {
    this.selectListByContactUs();
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
            this.deleteContactUs(e.id)
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

      selectVagueByMainTitleAndCompany() {  
        axios.get(this.$API_BASE_URL+'/contactUs/selectVagueByMainTitleAndCompany',{
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
            message: '修改成功！！！'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改！！！'
          });          
        });
      },

      replyContent() {  
        axios.post(this.$API_BASE_URL+'/contactUs/replyContent',{
          id:this.id,
          reply:this.updateResponse.reply
        }).then(response => { 
          console.log('response.data', response.data); 
          console.log('id', this.id); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },
    selectListById(id) { 
        axios.get(this.$API_BASE_URL+`/contactUs/selectListById?id=${id}`,{
        }).then(response => { 
          console.log('response.data', response.data); 
          this.id=id;
          this.updateResponse=response.data.data[0];
          if (this.updateResponse.creationDate) { 
            this.resultCreationDate=this.updateResponse.creationDate.slice(0, 10);
          }
          if (this.updateResponse.replyDate) { 
            this.resultReplyDate=this.updateResponse.replyDate.slice(0, 10);
          }
        }).catch(error => {  
          console.error(error);  
      });
    },

    deleteContactUs(id) { 
        axios.post(this.$API_BASE_URL+'/contactUs/deleteContactUs',{
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
          this.deleteContactUs(id);
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
        this.replyContent();
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

      addContactUs() {  
        axios.post(this.$API_BASE_URL+'/contactUs/addContactUs',{
          name:this.form.addName,
          company:this.form.addCompany,
          email:this.form.addEmail,
          phone:this.form.addPhone,
          content:this.form.addContent
        }).then(response => { 
          console.log('response.data', response.data);
          this.resultCode=response.data.code;
          if(this.resultCode==474){
          this.$message({
          message: response.data.msg,
          type: 'warning'
        }); 
        }
        else if(this.resultCode==475){
          this.$message({
          message: response.data.msg,
          type: 'warning'
        }); 
        }
        else if(this.resultCode==476){
          this.$message({
          message: response.data.msg,
          type: 'error'
        }); 
        }
        else if(this.resultCode==472){
          this.$message({
          message: response.data.msg,
          type: 'warning'
        }); 
        }else if(this.resultCode==200){
          this.$message({
          message: response.data.msg,
          type: 'success'
        }); 
          this.dialogVisibleByAdd = false;
          this.submitResetForm();
          this.$router.go(0); 
      }

        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },

    selectListByContactUs() {  
      axios.get(this.$API_BASE_URL+'/contactUs/selectListByContactUs',{
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
      this.selectListByContactUs();
    },  
    // 当前页码改变时的处理  
    handleCurrentChange(val) {  
      this.currentPage = val; 
      this.selectListByContactUs();
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
