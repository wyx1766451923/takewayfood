<template>
  <div class="order">
    <el-table :data="filterTableData" style="width: 100%" height="500">
      <el-table-column type="expand">
        <template #default="props">
          <div class="foodlist">
            <h3>餐品</h3>
            <el-table :data="JSON.parse(props.row.foodlist)">
              <el-table-column label="图片" width="150">
                <template #default="scope">
                  <div class="avatar">
                    <el-image style="width: 50px; height: 50px" :src="httpImgUrl + scope.row.mainPhoto" fit="cover" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="餐名" prop="productName" width="150"/>
              <el-table-column label="价格/元" width="150">
                <template #default="scope">
                  {{ Number(scope.row.price*scope.row.discount*0.1*scope.row.count) }}
                </template>
              </el-table-column>
              <el-table-column label="数量/份" prop="count" width="150"/>
              <el-table-column width="75">
                <template #default="scope">
                  <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  > -->
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleFoodDelete(scope.$index, props.row,JSON.parse(props.row.foodlist))"
                    v-if="props.row.deliveryState<=1"
                    >删除</el-button
                  >
                </template>
            </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNum" width="135"/>
      <el-table-column label="订单状态" >
        <template #default="scope">
          <div :class="deliverystatecolor(scope.row.deliveryState)">
            {{checkOrderState(scope.row.deliveryState)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="consignee" />
      <el-table-column label="地址">
        <template #default="scope">
          <div class="address">
            {{ scope.row.proAddress+' '+scope.row.detilAddress }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="商家" prop="shopName" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="总价" prop="totalprice" />
      <el-table-column label="餐具份数" prop="tablewarenum" width="80"/>
      <el-table-column label="预计送达" prop="selectArriveTime" />
      <el-table-column label="下单时间" prop="orderTime" />
      <el-table-column align="right" fixed="right" width="75">
          <template #header>
            <el-input v-model="search" size="small" placeholder="按订单号查找" />
          </template>
          <template #default="scope">
            <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            > -->
            <el-button
              size="small"
              type="danger"
              @click="handleOrderDelete(scope.$index, scope.row)"
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
        :page-sizes="[3, 5,10]"
        small
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-dialog
    v-model="foodDialogVisible"
    title="警告"
    width="30%"
    align-center
  >
    <span>您确认要移除这个餐品吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="foodDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDeletefood">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>  
  <el-dialog
    v-model="orderDialogVisible"
    title="警告"
    width="30%"
    align-center
  >
    <span>您确认要删除这个订单吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDeleteOrder">
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
let pageSize = ref(5)
let total = ref(3)
let foodDialogVisible = ref(false)
let orderDialogVisible = ref(false)
let foodindex = ref(0)
let foodlist = ref([])
let orderid = ref(0)
let totalprice = ref(0)
let foodnum = ref(0)
const onDeletefood = ()=>{
  let outFoodlist = foodlist.value[foodindex.value]
  let newTotalPrice = totalprice.value-(Number((outFoodlist.price*outFoodlist.discount*0.1).toFixed(2)*outFoodlist.count+outFoodlist.count))
  let newFoodnum = foodnum.value-outFoodlist.count
  foodlist.value.splice(foodindex.value,1)
  let newFoodlist = JSON.stringify(foodlist.value)
  
  http.post('/deleteOrderfood',{
    id:orderid.value,
    foodlist:newFoodlist,
    totalprice:newTotalPrice,
    foodnum:newFoodnum
  })
  .then(res=>{
    if(res.data.data=='ok'){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })

      foodDialogVisible.value = false
      getOrderData()
    }
  })
  .catch(err=>{
    console.log(err)
  })

}
const onDeleteOrder = ()=>{

  
  http.post('/deleteOrder',{
    id:orderid.value,
  })
  .then(res=>{
    if(res.data.data=='ok'){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })

      orderDialogVisible.value = false
      getOrderData()
    }
  })
  .catch(err=>{
    console.log(err)
  })

}
const checkOrderState=(state)=>{
  switch(state){
    case 0:return '已下单';    case 1:return '商家已接单';    case 2:return '配送中';    case 3:return '订单已完成';    case 4:return '订单取消';  }
}
const deliverystatecolor=(state)=>{
  switch(state){
    case 0:return 'state0';    
    case 1:return 'state1';    
    case 2:return 'state2';    
    case 3:return 'state3';   
    case 4:return 'state4';  
  }  
}
const handleSizeChange = (val) => {
  pageSize.value = val
}
const handleCurrentChange = (val) => {
  currentPage.value = val

}
// const handleEdit=(index,row)=>{
//   console.log(row)
// }
const handleOrderDelete=(index,row)=>{
  orderDialogVisible.value = true
  orderid.value = row.id
  console.log(row)
}

const handleFoodDelete=(index,row,list)=>{
  foodDialogVisible.value = true
  foodindex.value = index
  foodlist.value = list
  orderid.value = row.id
  totalprice.value = row.totalprice
  foodnum.value = row.foodnum
  
  console.log(index,row,list)
}
const filterTableData = computed(() =>
  tableData.value.filter(
    (data,index) =>{
      if(search.value == ''){
        return index>=(currentPage.value-1)*pageSize.value && index<currentPage.value*pageSize.value
      }else{
        return data.orderNum.includes(search.value)
      }
    }
      
  )
)
const getOrderData=()=>{
  http.get(`/getOrderData`)
  .then(res=>{
    

    tableData.value = res.data.orderList.reverse()
    
    total.value = res.data.orderList.length
    console.log(tableData.value,total.value)

  })
  .catch(err=>{
    console.log(err)
  })
}
onMounted(()=>{
  getOrderData()
})
</script>

<style lang="scss" scoped>
.state0{
  color: rgb(237, 143, 221);
}
.state1{
  color: rgb(33, 155, 226);
}
.state2{
  color: rgb(214, 214, 14);
}
.state3{
  color: rgb(12, 210, 12);
}
.state4{
  color:red;
}
.order{
  width: 100%;
  .foodlist{
    margin-left:50px ;
  }
  .pagination{
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
