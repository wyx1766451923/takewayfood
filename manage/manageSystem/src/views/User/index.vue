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
    <el-pagination background layout="prev, pager, next" :total="1000" />
  </div>
</template>

<script setup>
import { ref,reactive, onMounted ,computed} from 'vue';
import http from '../../api/http';
const httpImgUrl = "http://127.0.0.1:8080/static/image/"
let search = ref('')
let tableData = ref([])
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.nickname.includes(search.value)
  )
)
const getUserData = () =>{
  http.get('/getUserList')
  .then(res=>{
    // console.log(res)
    tableData.value = res.data.userlist
    searchTable()
  })
  .catch(err=>{
    console.log(err)
  })
}
const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}


onMounted(()=>{
  getUserData()
})
</script>

<style lang="scss" scoped></style>
