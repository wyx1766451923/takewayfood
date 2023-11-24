<template>
  <div class="business">
    <div class="addBusiness">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>
    <el-table :data="filterTableData" style="width: 100%">
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
</template>

<script setup>
import { ref,reactive, onMounted ,computed} from 'vue';
import http from '../../api/http';
import { ElMessage } from 'element-plus'
const httpImgUrl = "http://127.0.0.1:8080/static/image/"
let search = ref('')
let tableData = ref([])
let currentPage = ref(1)
let pageSize = ref(3)
let total = ref(3)
let centerDialogVisible = ref(false)
let id = ref(0)
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
  console.log('增加')
}
const handleEdit = (index, row)=>{
  console.log(row)
}
const handleDelete = (index, row) => {
  centerDialogVisible.value = true
  id.value = row.id
  console.log(index, row)

}


onMounted(()=>{
  getShopData()

})
</script>

<style lang="scss" scoped>
.business{
  width: 100%;
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
