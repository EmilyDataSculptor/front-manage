<template>
  <div class="page">
    <va-container>
      <template v-slot:header>
        <div class="container-header">
          <div class="action">
            <el-button size="small" type="primary" icon="el-icon-plus" circle @click="handleViewByAddProduct"></el-button>
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
              <div style="width: 80px" class="filter-title">
                <span>颜色</span>
              </div>
              <el-input size="small" v-model="formInline.VagueColour" placeholder="颜色"></el-input>
            </div>
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>类型</span>
              </div>
              <el-input size="small" v-model="formInline.VagueType" placeholder="类型"></el-input>
            </div>
            <div class="filter-item">
              <div style="width: 80px" class="filter-title">
                <span>系列</span>
              </div>
              <el-input size="small" v-model="formInline.VagueSeries" placeholder="系列"></el-input>
            </div>
            <div class="filter-item">
              <el-button size="small" type="primary" @click="selectVagueByProduct()">查询</el-button>
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
              :data="products"
              style="width: 100%">
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                fixed
                prop="mainTitle"
                label="主标题"
                width="230">
                <template v-slot="scope">  
                <span class="custom-title">{{ scope.row.mainTitle }}</span>  
              </template> 
              </el-table-column>
              <el-table-column
                prop="subTitle"
                label="副标题"
                width="230">
              </el-table-column>
              <el-table-column
              prop="indexPicture"  
              label="首页展示图片"  
              width="240"> <!-- 可选，设置列宽 -->  
              <template slot-scope="scope">  
              <div class="image-container">  
                <img :src="scope.row.indexPicture" alt="首页展示图片" class="hover-image">  
              </div>  
            </template>  
              </el-table-column>
              <el-table-column
                prop="colour"
                label="颜色">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="series"
                label="系列">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="500">
                <template slot-scope="scope"> 
                 <el-button type="success" round  @click="selectListById(scope.row.id)">查看</el-button>
                <el-button type="warning" round @click="selectListByIdOnUpdate(scope.row.id)">修改</el-button>
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

     <!-- 弹窗 -->  
    <el-dialog  
      title="产品详情"  
      :visible.sync="dialogVisible"  
      width="60%"  
      :before-close="handleClose">  
      <div v-for="product in productById" :key="product.id">

      <div style="margin: 20px;"></div>
      <el-form :label-position="labelPosition" label-width="80px">
        <el-form-item label="主标题">   
          <div class="center-wrapper">  
            <h1 style="margin: 0;">{{ product.mainTitle }}</h1>  
          </div>  
        </el-form-item>

        <el-form-item label="副标题">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.subTitle }}</h3>  
          </div>  
        </el-form-item>

        <el-form-item label="产品介绍">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.content }}</h3>  
          </div>  
        </el-form-item>

        <el-form-item label="首页图片">  
          <div class="center-wrapper">  
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">  
              <img :src="product.indexPicture" style="max-width: 50%; height: auto; display: block;" />  
            </div> 
          </div>  
        </el-form-item>

        <el-form-item label="产品详情">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.productDetails }}</h3>  
          </div>  
        </el-form-item>

        <el-form-item label="图片">    
      <div style="display: flex; flex-wrap: wrap; justify-content: center;">    
        <div v-for="(imgUrl, index) in resultImageUrls" :key="index" style="margin: 5px; flex: 0 0 auto; max-width: 24%;">    
          <img :src="imgUrl" style="width: 100%; height: 150px; display: block;" @error="handleError(index)" />    
        </div>    
      </div>    
    </el-form-item> 
        <el-form-item label="颜色">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.colour }}</h3>  
          </div>  
        </el-form-item>

        <el-form-item label="类型">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.type }}</h3>  
          </div>  
        </el-form-item>

        <el-form-item label="系列">  
          <div class="center-wrapper">  
            <h3 style="margin: 0;">{{ product.series }}</h3>  
          </div>  
        </el-form-item>
      </el-form>
      </div> 
    </el-dialog>  

    <el-dialog  
      title="添加产品"  
      :visible.sync="dialogVisibleByAddProduct"  
      width="60%"  
      :before-close="handleClose">   
          <template>  
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="主标题" prop="addMainTitle">  
              <el-input v-model="form.addMainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="副标题" prop="addSubTitle">  
              <el-input v-model="form.addSubTitle"></el-input>  
            </el-form-item>  
            <el-form-item label="产品介绍" prop="addContent">  
              <el-input v-model="form.addContent"></el-input>  
            </el-form-item> 
            
            <el-form-item label="首页展示图片">  
              <el-upload
                class="avatar-uploader"
                action="http://192.168.200.130:9000/minio/test/"
                :show-file-list="false"
                :on-success="indexHandleAvatarSuccess"
                :before-upload="indexBeforeAvatarUpload">
                <img v-if="indexUpLoadPicture" :src="indexUpLoadPicture" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <el-button v-if="indexUpLoadPicture" size="mini" type="danger" @click.stop="deleteImage">删除</el-button> 
              </el-upload>
            </el-form-item>  
          
            <el-form-item label="产品详情" prop="addProductDetails">  
              <el-input v-model="form.addProductDetails"></el-input>  
            </el-form-item>
            <el-form-item label="图片">  
              <el-upload  
                class="upload-demo"  
                action="http://192.168.200.130:9000/minio/test/"  
                :on-preview="handlePreview"  
                :on-remove="handleRemove"  
                :file-list="fileList"  
                list-type="picture-card"
                :on-success="handleSuccess">  
                <i class="el-icon-plus"></i>  
              </el-upload>  
              <el-dialog  
                title="预览"  
                :visible.sync="dialogVisible">  
                <img width="100%" :src="dialogImageUrl" alt="图片预览">  
              </el-dialog>  
            </el-form-item>
            <el-form-item label="颜色" prop="addColour">  
              <el-input v-model="form.addColour"></el-input>  
            </el-form-item>
            <el-form-item label="类型" prop="addType">  
              <el-input v-model="form.addType"></el-input>  
            </el-form-item>
            <el-form-item label="系列" prop="addSeries">  
              <el-input v-model="form.addSeries"></el-input>  
            </el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>  
            <el-button type="warning" @click="resetForm">重置</el-button>  
          </el-form>  
        </template>  
    </el-dialog> 

    <el-dialog  
      title="修改产品内容"  
      :visible.sync="dialogVisibleByUpdateProduct"  
      width="60%"  
      :before-close="handleClose">  
      
        <template> 
          <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" :label-position="labelPosition">  

            <el-form-item label="主标题">  
              <el-input v-model="updateResponse.mainTitle"></el-input>  
            </el-form-item> 
            <el-form-item label="副标题">  
              <el-input v-model="updateResponse.subTitle"></el-input>  
            </el-form-item>  
            <el-form-item label="产品介绍">  
              <el-input v-model="updateResponse.content"></el-input>  
            </el-form-item> 
            
            <el-form-item label="首页展示图片">  
              <el-upload
                class="avatar-uploader"
                action="http://192.168.200.130:9000/minio/test/"
                :show-file-list="false"
                :on-success="indexHandleAvatarSuccess"
                :before-upload="indexBeforeAvatarUpload">
                <img v-if="indexUpLoadPicture" :src="indexUpLoadPicture" class="avatar">
                <img v-else :src="updateIndexImageUrl" class="avatar"> 
                <el-button v-if="indexUpLoadPicture" size="mini" type="danger" @click.stop="deleteImage">删除</el-button> 
              </el-upload>
            </el-form-item>  
          
            <el-form-item label="产品详情">  
              <el-input v-model="updateResponse.productDetails"></el-input>  
            </el-form-item>
            <el-form-item label="图片">  
              <el-upload  
                class="upload-demo"  
                action="http://192.168.200.130:9000/minio/test/"  
                :on-preview="handlePreview"  
                :on-remove="updateHandleRemove"  
                :file-list="fileList"  
                list-type="picture-card"
                :on-success="handleSuccess"> 
                
                <i class="el-icon-plus"></i> 
              </el-upload>  
              <el-dialog  
                title="预览"  
                :visible.sync="dialogVisible">  
                <img width="100%" :src="dialogImageUrl" alt="图片预览">  
                <div v-if="imageUrlListByConversion.length > 0">  
        <img v-for="(url, index) in imageUrlListByConversion" :key="index" :src="url" alt="Loaded Image">  
      </div>  
              </el-dialog>  
            </el-form-item>
            <el-form-item label="颜色">  
              <el-input v-model="updateResponse.colour"></el-input>  
            </el-form-item>
            <el-form-item label="类型">  
              <el-input v-model="updateResponse.type"></el-input>  
            </el-form-item>
            <el-form-item label="系列">  
              <el-input v-model="updateResponse.series"></el-input>  
            </el-form-item>
            <el-button type="warning" @click=updateSubmitForm>修改</el-button>
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
        updateResponse:[],
        updateIndexImageUrl:'',
        updateImageUrlList:[],
        updateImageUrlListByTransition:[],
        theUpdateImageUrlList:[],
        imageUrlListByConversion:[],
        updateId:0,
        updateResultFileList: [] ,
        updateFilePictureMap:[],
        conntect:[],
        

        resultPictureUrl:'',  
        indexFileList:[],
        indexUpLoadPicture: null,
        dialogImageUrl:'',
        fileList: [] ,
        resultFileList: [] ,
        fileName:'',
        indexFileName:'',
        resultIndexFileName:'',
        filePictureMap: new Map(),

        form: {
          addMainTitle:'',
          addSubTitle:'',
          addContent:'',
          addIndexPicture:'',
          addProductDetails:'',
          addPicture:'',
          addColour:'',
          addType:'',
          addSeries:'',
        },

        

        rules: {
          
          addMainTitle: [
            {required: true, message: '主标题不能为空', trigger: 'blur' }
          ],
          addSubTitle: [
            {required: true, message: '副标题不能为空', trigger: 'blur' }
          ],
          addContent: [
            {required: true, message: '产品介绍不能为空', trigger: 'blur' }
          ],
          addProductDetails: [
            {required: true, message: '产品详情不能为空', trigger: 'blur' }
          ],
          addColour: [
            {required: true, message: '颜色不能为空', trigger: 'blur' }
          ],
          addType: [
            {required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          addSeries: [
            {required: true, message: '系列不能为空', trigger: 'blur' }
          ],
        
         
        },
      


        formInline: {
          VagueMainTitle: '',
          VagueColour: '',
          VagueType: '',
          VagueSeries: '',
        },

        labelPosition: 'left',
       

        // 控制弹窗显示与隐藏的变量  
        dialogVisible: false,  
        dialogVisibleByAddProduct:false,
        dialogVisibleByUpdateProduct:false,
        
        // 假设这是你将从后台获取并存储的产品数据 
        products: [],
        // 产品id
        id:1, 
        productById:[],
        imageUrls: [], 
        resultImageUrls: [], 

        currentPage: 1, // 当前页码  
        pageSize: 10, // 每页显示的数量  
        total: 0, // 总记录数  
        paginatedData: [], // 分页后的数据 

        checkBoxData:[],
      };
    },
    created() {
    this.selectListByProduct();
    },
    methods: {

      handleSelectionChange(val) {   
          console.log(val);  
          this.checkBoxData=val;
        }, 

      DeleteMultiple() {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("this.checkBoxData",this.checkBoxData); 
          this.checkBoxData.forEach(e=>{
            this.deleteProductByIdOnLogic(e.id)
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


      selectVagueByProduct() { 
        console.log('this.formInline.VagueMainTitle', this.formInline.VagueMainTitle);
        axios.get(this.$API_BASE_URL+'/product/selectVagueByProduct',{
          params: {
          mainTitle:this.formInline.VagueMainTitle,
          colour:this.formInline.VagueColour,
          type:this.formInline.VagueType,
          series:this.formInline.VagueSeries,
          currentPage: this.currentPage,  
          pageSize: this.pageSize,
          }  
        }).then(response => { 
          console.log('response.data', response.data); 
          this.products=response.data.data;
          this.total=Number(response.data.msg.split("_")[1]);
        console.log("this.products",this.products)
        console.log("this.total",this.total)
        }).catch(error => {  
          console.error(error);  
      });
    },


      deleteProductByIdOnLogic(id) { 
        axios.post(this.$API_BASE_URL+`/product/deleteProductByIdOnLogic?id=${id}`,{
        }).then(response => { 
          console.log('response.data', response.data); 
          this.$router.go(0);
        }).catch(error => {  
          console.error(error);  
      });
    },

    deleteMessage(id) {
        this.$confirm('此操作将下架该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteProductByIdOnLogic(id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },

      updateSubmitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {  
        this.updateByProduct();
        this.dialogVisibleByUpdateProduct = false;
        this.submitMessageSuccess();
        this.$router.go(0);
        return true;
        } else {  
          this.submitMessageError();
          return false;  
        }  
      });  
    },  

      isBlobUrl(url) {  
        // 使用正则表达式检查URL是否以'blob:'开头  
        return /^blob:/.test(url);  
      },  

    updateHandleRemove(file, fileList) {  
      if(this.isBlobUrl(file.url)){
        
        this.fileName=this.filePictureMap.get(file.url);
        this.deleteFile(this.fileName);
        this.resultFileList = this.resultFileList.filter(item => item !== this.fileName);
        this.updateResultFileList= this.resultFileList;
        this.resultFileList=[];
        console.log("this.resultFileList",this.resultFileList);
      }else{
        this.deleteFile(file.url);
        this.updateImageUrlList = this.updateImageUrlList.filter(item => item !== file.url);
        console.log("this.updateImageUrlList",this.updateImageUrlList);
      }

      
        },

      updateByProduct() { 
        this.updateFilePictureMap=[];
        this.conntect=this.updateImageUrlList.concat(this.updateResultFileList);
        this.updateFilePictureMap=Array.from(this.filePictureMap.values())
        this.updateFilePictureMap=this.updateFilePictureMap.concat(this.conntect)
        let uniqueArr=[...new Set(this.updateFilePictureMap)];
        this.updateImageUrlListByTransition=uniqueArr;
        console.log("this.updateImageUrlListByTransition",this.updateImageUrlListByTransition);
        if(this.resultIndexFileName===null){
          this.resultIndexFileName=this.updateResponse.indexPicture
        }
        let imagePathsString = this.updateImageUrlListByTransition.join(','); 
        axios.post(this.$API_BASE_URL+'/product/updateByProduct',{
          id:this.updateId,
          mainTitle: this.updateResponse.mainTitle,
          subTitle: this.updateResponse.subTitle,
          content: this.updateResponse.content,
          indexPicture: this.resultIndexFileName,
          productDetails: this.updateResponse.productDetails,
          picture: imagePathsString,
          colour: this.updateResponse.colour,
          type: this.updateResponse.type,
          series: this.updateResponse.series,

        }).then(response => { 
          console.log('response.data', response.data); 
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },


      selectListByIdOnUpdate(id) {  
        axios.post(this.$API_BASE_URL+'/product/selectListById',{
            id: id,  
        }).then(response => { 
          
          this.updateResponse=response.data.data[0]
          console.log('this.updateResponse', this.updateResponse); 
          this.updateIndexImageUrl=response.data.data[0].indexPicture;
          this.updateId=this.updateResponse.id
          console.log('this.updateId', this.updateId); 
          this.updateImageUrlList=[],
          this.fileList=[],
          this.updateResponse.picture.split(",").forEach(updateImagePath =>{
            this.updateImageUrlList.push(updateImagePath);
          })
          this.updateImageUrlList.forEach(e=>{
            this.fileList.push({
              name:e,
              url:e
            })
          })
          console.log('this.updateImageUrlList', this.updateImageUrlList);
          this.handleViewByUpdateProduct();
        }).catch(error => {   
          console.error(error);  
      });
    },

      indexHandleAvatarSuccess(res, file) {
        if (this.indexUpLoadPicture) { 
          this.deleteFile(this.indexFileName); 
        }

        this.indexUpLoadPicture = URL.createObjectURL(file.raw);
        let formData = new FormData();     
        let blob = new Blob([file.raw], { type:'image/jpeg' });
        formData.append('file', blob, file.name); 
        this.indexUploadFile(formData);
      },

      indexBeforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
          return isJPG && isLt5M;
      },

      deleteImage() {  
        this.indexUpLoadPicture = null;
        this.deleteFile(this.indexFileName);  
    },

    indexUploadFile(formData){
        axios.post(this.$API_BASE_URL+'/product/uploadFile', formData)  
        .then(response => {  
          console.log('文件上传成功', response.data);
          this.indexFileName=response.data;
          this.resultIndexFileName=response.data;
        })  
        .catch(error => {  
          console.error('文件上传失败', error);  
        });
      }, 

    fetchBlobs(urls) {  
    return Promise.all(urls.map(url => fetch(url).then(response => response.blob())));  
    }, 
    
    handlePreview(file) {  
      this.dialogImageUrl = file.url; 
      this.dialogVisible = true; 
    },  

      submitForm() {  
      this.$refs.formRef.validate((valid) => {  
        if (valid) {  
        this.addProduct();
        this.dialogVisibleByAddProduct = false;
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
      this.indexUpLoadPicture = null;
      this.fileList = [];
    },

    resetForm() {
      this.$refs.formRef.resetFields();  
      this.indexUpLoadPicture = null;
      this.fileList = [];
      this.deleteFile(this.indexFileName);
      this.resultFileList.forEach((fileName, index) => {
      this.deleteFile(fileName);  
      });  
      this.submitMessageResetting(); 
      },


      pictureUrl(){
        this.resultImageUrls = this.imageUrls.split(','); 
        console.log('图片路径',this.resultImageUrls);
     },


      handleView() {  
      this.dialogVisible = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  

      handleViewByAddProduct() {
        this.fileList = [];  
      this.dialogVisibleByAddProduct = true; 
        },   
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        }, 

      handleViewByUpdateProduct() {  
      this.dialogVisibleByUpdateProduct = true;  
        },    
        handleClose(done) {  
          this.$confirm('确认关闭？')  
            .then(_ => {  
              done();  
            })  
            .catch(_ => {});  
        },  

      handleRemove(file, fileList) {  
          this.fileName=this.filePictureMap.get(file.url);
          this.deleteFile(this.fileName);
        },

      handleSuccess(response, file, fileList){
          let formData = new FormData();     
          let blob = new Blob([file.raw], { type:'image/jpeg' });
          formData.append('file', blob, file.name); 
          this.uploadFile(formData).then(() => { 
          this.filePictureMap.set(file.url, this.fileName);
          console.log('this.filePictureMap', this.filePictureMap)
        })
        
        console.log('fileList', fileList)
        this.updateFilePictureMap=[];
        },

        uploadFile(formData){
          return new Promise((resolve, reject) => {
        axios.post(this.$API_BASE_URL+'/product/uploadFile', formData)  
        .then(response => {  
          console.log('文件上传成功', response.data);
          this.fileName=response.data;
          this.resultFileList.push(response.data);
          console.log('this.resultFileList', this.resultFileList);
          resolve();
        })  
        .catch(error => {  
          console.error('文件上传失败', error);  
        });
      });
      },    

      deleteFile(fileName){
        axios.post(this.$API_BASE_URL+'/product/deleteFile',null,{
          params: {  
          fileName: fileName  
        }  
        })  
        .then(response => { 
          
          this.filePictureMap.forEach((value, key) => {
            if(value===fileName){
              console.log('key', key); 
              this.filePictureMap.delete(key);
            }  
          });
          
          console.log('this.filePictureMap', this.filePictureMap); 
          const index = this.resultFileList.indexOf(fileName); 
          if (index !== -1) {  
            this.resultFileList.splice(index, 1); 
          }
          console.log('fileName', fileName); 
          console.log('this.resultFileList', this.resultFileList); 
          
          console.log('this.updateImageUrlList', this.updateImageUrlList);
        })  
        .catch(error => {  
          console.error('文件删除失败', error);  
        });
      }, 

      addProduct() {  
        let imagePathsString = this.resultFileList.join(','); 
        console.log(imagePathsString);
        axios.post(this.$API_BASE_URL+'/product/addProduct',{
          mainTitle: this.form.addMainTitle,
          subTitle: this.form.addSubTitle,
          content: this.form.addContent,
          indexPicture: this.resultIndexFileName,
          productDetails: this.form.addProductDetails,
          picture: imagePathsString,
          colour: this.form.addColour,
          type: this.form.addType,
          series: this.form.addSeries,

        }).then(response => { 
          console.log('response.data', response.data); 
          
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },
      selectListById(id) {  
        axios.post(this.$API_BASE_URL+'/product/selectListById',{ 
            id: id,  
        }).then(response => { 
          this.productById = response.data.data;
          console.log('selectListById:this.productById', this.productById); 
          this.imageUrls=response.data.data[0].picture;
          this.handleView();
          this.pictureUrl();
          
        }).catch(error => {  
          // 处理错误  
          console.error(error);  
      });
    },

      selectListByProduct() {  
      axios.get(this.$API_BASE_URL+'/product/selectListByProduct',{
        params: {  
          currentPage: this.currentPage,  
          pageSize: this.pageSize, 
        }, 
      })
    .then(response => {  
          // 处理成功响应，例如显示成功消息 
        this.products = response.data.data;
        this.total=Number(response.data.msg.split("_")[1]);
        console.log("this.products",this.products)
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
      this.selectListByProduct();
    },  
    // 当前页码改变时的处理  
    handleCurrentChange(val) {  
      this.currentPage = val; 
      this.selectListByProduct();
    },

      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      openFilter() {
        this.$refs.table.vaTableFilter({
          excludeField: [
            '操作'
          ]
        });
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
    /*box-shadow: 5px 4px 6px 0 rgba(58,58,58,0.1);*/
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
