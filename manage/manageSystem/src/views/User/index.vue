<template>
  <div class="user">
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="id" prop="id" />
      <el-table-column label="头像" >
        <template #default="scope">
          <div class="avatar">
            <el-image style="width: 100px; height: 100px" :src="httpImgUrl + scope.row.avatar" fit="cover" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" />

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="按昵称查找" />
        </template>
        <template #default="scope">
          <el-button
            size="default"
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
    <span>您确认删除这条用户信息吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDeleteUser">
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
let allData = ref([])
let tableData = ref([])
let currentPage = ref(1)
let pageSize = ref(3)
let total = ref(3)
let centerDialogVisible = ref(false)
let id = ref(0)
// const pagination = () =>{
//   tableData.value = allData.value.slice((currentPage.value-1)*pageSize.value,currentPage.value*pageSize.value)
//   console.log(allData.value)
// }
const onDeleteUser = () =>{
  http.post('/deleteUser',{
    id:id.value
  })
  .then(res=>{
    if(res.data.data=='ok'){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      centerDialogVisible.value = false
      getUserData(currentPage,pageSize)
      getUserDataCount()
    }
  })
  .catch(err=>{
    console.log(err)
  })
}
const handleSizeChange = (val) => {
  pageSize.value = val
  // getUserData(currentPage,pageSize)
  // pagination()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  // getUserData(currentPage,pageSize)
  // pagination()
}
const filterTableData = computed(() =>
  allData.value.filter(
    (data,index) =>{
      if(search.value == ''){
        return index>=(currentPage.value-1)*pageSize.value && index<currentPage.value*pageSize.value
      }else{
        return data.nickname.includes(search.value)
      }
    }
      
  )
) 
const getUserDataCount = () =>{
  http.get(`/getUserListCount`)
  .then(res=>{
    // console.log(res)
    total.value = res.data.count
    console.log(res.data)
  })
  .catch(err=>{
    console.log(err)
  })
}
const getUserData = (/*currentPage,pageSize*/) =>{
  // ?startIndex=${(currentPage.value-1)*pageSize.value}&size=${pageSize.value}
  http.get(`/getUserList`)
  .then(res=>{
    
    // tableData.value = res.data.userlist
    allData.value = res.data.userlist
    
    total.value = res.data.userlist.length
    console.log(allData.value,total.value)
    // pagination()
  })
  .catch(err=>{
    console.log(err)
  })
}
const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  centerDialogVisible.value = true
  id.value = row.id
  console.log(index, row)

}


onMounted(()=>{
  getUserData(/*currentPage,pageSize*/)
  
  // getUserDataCount()
})
</script>

<style lang="scss" scoped>
.user{
  width: 100%;
  .pagination{
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }
}

</style>
