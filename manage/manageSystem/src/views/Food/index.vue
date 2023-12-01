<template>
  <div class="food">
    <div class="searchAndAddfood">
      <div class="searchBy">
        <div class="byshop">
          <el-input v-model="shopName" placeholder="按商家查找" clearable/>
        </div>

        <div class="bytype">
          <el-input v-model="typeName" placeholder="按分类查找" clearable/>
        </div>
      </div>
      <div class="operate">
        <el-button type="primary" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <el-table :data="filterTableData" style="width: 100%" height="450">
      <el-table-column label="id" prop="id" width="70px"/>
      <el-table-column label="图片" >
        <template #default="scope">
          <div class="avatar">
            <el-image style="width: 100px; height: 100px" :src="httpImgUrl + scope.row.mainPhoto" fit="cover" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="餐名" prop="productName" />
      <el-table-column label="所属商家" prop="shopName" />
      <el-table-column label="分类" prop="typeName" />
      <el-table-column label="价格/元" prop="price" />
      <el-table-column label="销量/份" prop="sales" />

      <el-table-column label="折扣" prop="discount" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="按餐名查找" />
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
    <span>您确认删除这条餐品信息吗？</span>
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
    title="添加食品" 
    width="40%" 
    align-center
    :before-close="dialogClose"
  >
    <div class="formdata">
      <el-form
        label-position="left"
        label-width="80px"
        :model="foodInfo"
        style="width: 100%;"
        :rules="rules"
        ref="addRuleForm"
      >
        <el-form-item label="菜名" required prop="productName">
          <el-input v-model="foodInfo.productName" clearable/>
        </el-form-item>
        <el-form-item label="图片" required prop="mainPhoto">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            action="http://localhost:8080/foodPhoto"
            :show-file-list="false"

            :on-success="handleAvatarSuccess"
          >
            <img v-if="foodInfo.mainPhoto" :src="httpImgUrl+foodInfo.mainPhoto" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="所属商家" required prop="shopId">
          <el-select v-model="foodInfo.shopId" class="m-2" placeholder="Select" size="large">
            <el-option
              v-for="item in shopInfo"
              :key="item.id"
              :label="item.shopName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" required prop="typeid">
          <el-select v-model="foodInfo.typeid" class="m-2" placeholder="Select" size="large">
            <el-option
            v-for="item in typeInfo"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="foodInfo.price" :min="0" />
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input-number v-model="foodInfo.discount" :min="1" :max="10" />
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
import axios from 'axios';
const httpImgUrl = "http://127.0.0.1:8080/static/image/"
let search = ref('')
let tableData = ref([])
let currentPage = ref(1)
let pageSize = ref(3)
let total = ref(3)
let centerDialogVisible = ref(false)
let addDialogVisible = ref(false)
let shopInfo = ref([])
let typeInfo = ref([])
const getShopInfo=()=>{
  http.get('/shop')
  .then(res=>{
    if(res){
      // foodInfo.shopId = res.data.shops[0].id
      shopInfo.value = res.data.shops
    }
  })
  .catch(err=>{
    console.log(err)
  })
}
const getTypeInfo=()=>{
  http.get('/getAlltype')
  .then(res=>{
    if(res){
      // foodInfo.typeid = res.data.typeList[0].id
      typeInfo.value = res.data.typeList
    }
  })
  .catch(err=>{
    console.log(err)
  })
}
const initdata = ()=>{
  return {
    id:0,
    productName: '',
    mainPhoto: '',
    shopId: '',
    typeid:'',
    price:0,
    discount:10,
  }
}
let foodInfo = reactive(initdata())

const addRuleForm = ref(null)
const uploadRef = ref(null)
const rules = {
    productName: [{ required: true, message: "菜名不能为空", trigger: "blur" }],
    shopId: [{ required: true, message: "所属商家不能为空",  trigger: "blur",type: 'number'}],
    typeid: [{ required: true, message: "分类不能为空", trigger: "blur",type: 'number' }],
    mainPhoto: [{ required: true, message: "图片不能为空", trigger: "blur" }],
      // formshopPhoto: [{ required: true, message: "头像不能为空", trigger: "blur" }],
	};
let id = ref(0)
let imageUrl = ref('')
let shopName = ref('')
let typeName = ref('')
const handleSearch = () =>{
  http.post('/searchFood',{
    shopName:shopName.value,
    typeName:typeName.value
  })
  .then(res=>{
    if(res){
      tableData.value = res.data.searchFoodlist
      total.value = res.data.searchFoodlist.length
      ElMessage({
        message: '搜索成功',
        type: 'success',
      })
    }

  })
  .catch(res=>{
    ElMessage({
        message: 'res',
        type: 'err',
      })
  })
  console.log(shopName.value,typeName.value)
}
const handleReset = () =>{
  getFoodData()
}

const handleAvatarSuccess = (res)=>{
  
  foodInfo.mainPhoto = 'product/'+res.newname
}
const deletePhoto=() =>{
  http.post('/deletePhoto',{
    photoname:foodInfo.mainPhoto
  })
  .then(res=>{
    
    if(res.data.data == 'ok'){
      foodInfo.mainPhoto=''
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
  if(foodInfo.mainPhoto!='' && foodInfo.id==0){
    console.log('图片会被删除')
    
    deletePhoto()
  }
  Object.assign(foodInfo, initdata());
  // addRuleForm.value.resetFields()
  // console.log(foodInfo,initdata(),tableData)
  addDialogVisible.value = false
}
const addFood = () =>{
  http.post('/addFood',{
    foodInfo:foodInfo
  })
  .then(res=>{
    if(res.data.data == 'ok'){
      addRuleForm.value.resetFields()
      foodInfo.mainPhoto+=''
      // uploadRef.value
      getFoodData()

    }
    
  })
  .catch(err=>{
    console.log(err)
  })
}
const setFood = () =>{
  http.post('/setFood',{
    foodInfo:foodInfo
  })
  .then(res=>{
    if(res.data.data == 'ok'){
      addRuleForm.value.resetFields()
      foodInfo.mainPhoto=''
      // uploadRef.value
      getFoodData()

    }
    
  })
  .catch(err=>{
    console.log(err)
  })
}
const submit = async () =>{
  await addRuleForm.value.validate();
  if(foodInfo.id == 0){
    try {
	    await addRuleForm.value.validate(); 
	    console.log("验证成功");
      console.log(foodInfo)
      addFood()
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
      console.log(foodInfo)
      setFood()
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
  http.post('/deleteFood',{
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
      getFoodData()
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
        return data.productName.includes(search.value)
      }
    }
      
  )
) 

const getFoodData = () =>{

  http.get(`/getAllFood`)
  .then(res=>{
    

    tableData.value = res.data.foodList
    
    total.value = res.data.foodList.length
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
  Object.assign(foodInfo, row);
  console.log(foodInfo)
  // console.log(row)
}
const handleDelete = (index, row) => {
  centerDialogVisible.value = true
  id.value = row.id
  imageUrl.value = row.mainPhoto
  console.log(row)

}


onMounted(()=>{
  getFoodData()
  getShopInfo()
  getTypeInfo()

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

.food{
  width: 100%;
  .searchAndAddfood{
    display: flex;
    justify-content: space-between;
  }
  .searchBy{
    display: flex;
    .byshop{
      width: 150px;
    }
    .bytype{
      width: 150px;
      margin-left: 20px;
    }
  }
  .formdata{

  }
  .pagination{
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }

}
</style>
