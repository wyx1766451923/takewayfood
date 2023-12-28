<template>
    <div class="business">
      <el-table :data="filterTableData" style="width: 100%" height="450">
        <el-table-column label="id" prop="id" width="70px"/>
        <el-table-column label="头像" >
          <template #default="scope">
            <div class="avatar">
              <el-image style="width: 100px; height: 100px" :src="httpImgUrl + scope.row.avatar" fit="cover" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" />
        <el-table-column label="姓名" prop="riderName" />
        <el-table-column label="电话" prop="riderPhone" />
        <el-table-column label="状态">
          <template #default="scope">
            <div :class="scope.row.isRider == 2?'ystate':'nstate'">
                {{scope.row.isRider==2?'审核通过':'审核中'}}
            </div>
            
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="按姓名查找" />
          </template>
          <template #default="scope">
            <el-button 
            size="small"
            type="success"
            :disabled="scope.row.isRider==2?true:false"
            @click="handlePass(scope.$index, scope.row)"
              >通过</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>  
      <div class="pagination">
        <el-pagination 
          background
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[2, 3,5]"
          small
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>  
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      title="警告"
      width="30%"
      align-center
    >
      <span>您确认删除这条骑手信息吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onDeleteRider">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
   
  </template>
  
  <script setup>
  import { ref,reactive,unref, onMounted ,computed} from 'vue';
  import http from '../../api/http';
  import { ElMessage,ElMessageBox } from 'element-plus'
  const httpImgUrl = "http://127.0.0.1:8080/static/image/"
  let search = ref('')
  let tableData = ref([])
  let currentPage = ref(1)
  let pageSize = ref(3)
  let total = ref(3)
  let centerDialogVisible = ref(false)

  const statusChange=(userid,status)=>{
    console.log(userid,status)
  }
  const addRuleForm = ref(null)
  const uploadRef = ref(null)
  const rules = {
      shopName: [{ required: true, message: "店名不能为空", trigger: "blur" }],
      connectPerson: [{ required: true, message: "店主不能为空", trigger: "blur" }],
      telephone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
      address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
      description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
        // formshopPhoto: [{ required: true, message: "头像不能为空", trigger: "blur" }],
      };
  let id = ref(0)
  let userid = ref(0)
  const handleAvatarSuccess = (res)=>{
    
    businessInfo.shopPhoto = 'shop/'+res.newname
  }
  const deletePhoto=() =>{
    http.post('/deletePhoto',{
      photoname:businessInfo.shopPhoto
    })
    .then(res=>{
      
      if(res.data.data == 'ok'){
        businessInfo.shopPhoto=''
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const dialogClose = () =>{
    cancel()
  }
  const cancel = () =>{
    if(businessInfo.shopPhoto!='' && businessInfo.id==0){
      console.log('图片会被删除')
      
      deletePhoto()
    }
    Object.assign(businessInfo, initdata());
    // addRuleForm.value.resetFields()
    // console.log(businessInfo,initdata(),tableData)
    addDialogVisible.value = false
  }
  const addBusiness = () =>{
    http.post('/addBusiness',{
      businessInfo:businessInfo
    })
    .then(res=>{
      if(res.data.data == 'ok'){
        addRuleForm.value.resetFields()
        businessInfo.shopPhoto=''
        // uploadRef.value
        getShopData()
  
      }
      
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const setBusiness = () =>{
    http.post('/setBusiness',{
      businessInfo:businessInfo
    })
    .then(res=>{
      if(res.data.data == 'ok'){
        addRuleForm.value.resetFields()
        businessInfo.shopPhoto=''
        // uploadRef.value
        getShopData()
  
      }
      
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const submit = async () =>{
    if(businessInfo.id == 0){
      try {
          await addRuleForm.value.validate(); 
          console.log("验证成功");
        console.log(businessInfo)
        addBusiness()
        addDialogVisible.value = false
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        } catch (err) {
          console.log("失败" + err);
        ElMessage({
          message: '添加失败',
          type: 'error',
        })
        }
    }else{
      try {
          await addRuleForm.value.validate(); 
          console.log("验证成功");
        console.log(businessInfo)
        setBusiness()
        addDialogVisible.value = false
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
        } catch (err) {
          console.log("失败",err);
        ElMessage({
          message: '修改失败',
          type: 'error',
        })
        }   
    }
  
  
    
  }
  const onDeleteRider = () =>{
    console.log(id.value,userid.value)
    http.post('/deleteRider',{
      id:id.value,
      userid:userid.value
    })
    .then(res=>{
      if(res.data.data=='ok'){
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        centerDialogVisible.value = false
        getRiderData()
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const handleSizeChange = (val) => {
    pageSize.value = val
  }
  const handleCurrentChange = (val) => {
    currentPage.value = val
  
  }
  const filterTableData = computed(() =>
    tableData.value.filter(
      (data,index) =>{
        if(search.value == ''){
          return index>=(currentPage.value-1)*pageSize.value && index<currentPage.value*pageSize.value
        }else{
          return data.riderName.includes(search.value)
        }
      }
        
    )
  ) 
  
  const getRiderData = () =>{
  
    http.get(`/rider`)
    .then(res=>{
      
  
      tableData.value = res.data.riders
      total.value = res.data.riders.length
      console.log(tableData.value,total.value)
  
    })
    .catch(err=>{
      console.log(err)
    })
  }
  // let echoData = reactive(null)
  const handlePass = (index, row)=>{
    console.log('通过')
    // console.log(1111+row.userid)
    let userid = row.userid
    http.post('/passRiderApply',{
        id:userid,
    })
    .then(res=>{
        if(res.data.data=='ok'){
            ElMessage({
                message: '通过',
                type: 'success',
            })


            getRiderData()
        }
    })
    .catch(err=>{
        console.log(err)
    })
    // console.log(row)
  }
  const handleDelete = (index, row) => {
    centerDialogVisible.value = true
    id.value = row.id
    userid.value = row.userid
  
  }
  
  
  onMounted(()=>{
    getRiderData()
  
  })
  </script>
  
  <style lang="scss" scoped>
  .el-icon{
    border: 1px solid black;
  }
  .avatar-uploader .avatar{
    width: 100px;
    height: 100px;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: gray;
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item{
    width: 40%;
    padding-left: 20px;
  }
  .business{
    width: 100%;
    .formdata{
  
    }
    .ystate{
      color: rgb(9, 209, 9);
    }
    .nstate{
      color: blue;
    }
    .pagination{
      width: 100%;
      margin: 20px 0;
      display: flex;
      justify-content: center;
    }
  
  }
  </style>
  