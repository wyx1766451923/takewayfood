<template>
  <div class="business">
    <div class="addBusiness">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>
    <el-table :data="filterTableData" style="width: 100%" height="450">
      <el-table-column label="id" prop="id" width="70px"/>
      <el-table-column label="头像" >
        <template #default="scope">
          <div class="avatar">
            <el-image style="width: 100px; height: 100px" :src="httpImgUrl + scope.row.shopPhoto" fit="cover" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店名" prop="shopName" />
      <el-table-column label="负责人" prop="connectPerson" />
      <el-table-column label="电话" prop="telephone" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="状态">
        <template #default="scope">
          <div :class="scope.row.isOpen == 1?'ystate':'nstate'">
            {{ scope.row.isOpen == 1?'营业中':'未营业'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" />
      <el-table-column label="公告">
        <template #default="scope">
          <div class="announcement">
            {{ scope.row.announcement?scope.row.announcement:'暂无公告'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="按店名查找" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
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
    <span>您确认删除这条商家信息吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDeleteBusiness">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog 
    v-model="addDialogVisible" 
    title="添加/编辑商家" 
    width="40%" 
    align-center
    :before-close="dialogClose"
  >
    <div class="formdata">
      <el-form
        label-position="left"
        label-width="80px"
        :model="businessInfo"
        style="width: 100%;"
        :rules="rules"
        ref="addRuleForm"
      >
        <el-form-item label="店名" required prop="shopName">
          <el-input v-model="businessInfo.shopName" clearable/>
        </el-form-item>
        <el-form-item label="头像" required prop="shopPhoto">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            action="http://localhost:8080/businessAvatar"
            :show-file-list="false"

            :on-success="handleAvatarSuccess"
          >
            <img v-if="businessInfo.shopPhoto" :src="httpImgUrl+businessInfo.shopPhoto" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="店主" required prop="connectPerson">
          <el-input v-model="businessInfo.connectPerson" clearable/>
        </el-form-item>
        <el-form-item label="电话" required prop="telephone">
          <el-input v-model="businessInfo.telephone" clearable maxlength="11"/>
        </el-form-item>
        <el-form-item label="地址" required prop="address">
          <el-input v-model="businessInfo.address" clearable/>
        </el-form-item>
        <el-form-item label="起送价格" prop="startPrice">
          <el-input-number v-model="businessInfo.startPrice" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="配送费" prop="deliveryFees">
          <el-input-number v-model="businessInfo.deliveryFees" :min="0" :max="3" />
        </el-form-item>
        <el-form-item label="配送时间" prop="deliveryTime">
          <el-input-number v-model="businessInfo.deliveryTime" :min="30"/>
        </el-form-item>
        <el-form-item label="是否营业" required prop="isOpen">
          <el-select v-model="businessInfo.isOpen" class="m-2" placeholder="Select" size="large">
            <el-option
              :key="1"
              label="营业中"
              :value="1"
            />
            <el-option
              :key="0"
              label="未营业"
              :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" required prop="description">
          <el-input
            v-model="businessInfo.description"
            maxlength="30"
            type="textarea"
            placeholder="输入本店描述"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="公告" prop="announcement">
          <el-input
            v-model="businessInfo.announcement"
            maxlength="30"
            type="textarea"
            placeholder="输入本店公告"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">
          提交
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
let addDialogVisible = ref(false)

const initdata = ()=>{
  return {
    id:0,
    shopName: '',
    shopPhoto: '',
    connectPerson: '',
    telephone:'',
    address:'',
    startPrice:1,
    deliveryFees:0,
    deliveryTime:0,
    isOpen:1,
    description:'',
    announcement:''
  }
}
let businessInfo = reactive(initdata())

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
let imageUrl = ref('')
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
const onDeleteBusiness = () =>{
  http.post('/deleteBusiness',{
    id:id.value
  })
  .then(res=>{
    if(res.data.data=='ok'){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      http.post('/deletePhoto',{
        photoname:imageUrl.value
      })
      .then(res=>{
        
        if(res.data.data == 'ok'){
          console.log('图片被删除')
        }
      })
      .catch(err=>{
        console.log(err)
      })
      centerDialogVisible.value = false
      getShopData()
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
        return data.shopName.includes(search.value)
      }
    }
      
  )
) 

const getShopData = () =>{

  http.get(`/shop`)
  .then(res=>{
    

    tableData.value = res.data.shops
    
    total.value = res.data.shops.length
    console.log(tableData.value,total.value)

  })
  .catch(err=>{
    console.log(err)
  })
}
const handleAdd = () =>{
  addDialogVisible.value = true
  console.log('增加')
}
// let echoData = reactive(null)
const handleEdit = (index, row)=>{
  addDialogVisible.value = true
  Object.assign(businessInfo, row);
  console.log(businessInfo)
  // console.log(row)
}
const handleDelete = (index, row) => {
  centerDialogVisible.value = true
  id.value = row.id
  imageUrl.value = row.shopPhoto
  console.log(index, row)

}


onMounted(()=>{
  getShopData()

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
  .addBusiness{
    display: flex;
    justify-content: right;
  }
  .ystate{
    color: rgb(9, 209, 9);
  }
  .nstate{
    color: red;
  }
  .pagination{
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }

}
</style>
