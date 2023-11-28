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
let imageUrl = ref('')
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
      getUserData()
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

const getUserData = () =>{

  http.get(`/getUserList`)
  .then(res=>{
    

    allData.value = res.data.userlist
    
    total.value = res.data.userlist.length
    console.log(allData.value,total.value)

  })
  .catch(err=>{
    console.log(err)
  })
}

const handleDelete = (index, row) => {
  centerDialogVisible.value = true
  id.value = row.id
  imageUrl.value = row.avatar
  console.log(index, row)

}


onMounted(()=>{
  getUserData()
  

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
