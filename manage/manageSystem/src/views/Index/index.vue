<template>
  <div class="index">
    <div class="statistics">
      <div class="userCount ">
        <div class="icon">
          <el-icon size="60px" class="usericon"><UserFilled /></el-icon>
        </div>
        <div class="information">
          <div class="name">
            用户
          </div>
          <div class="count">
            {{userCount}}
          </div>
        </div>
      </div>
      <div class="businessCount">
        <div class="icon">
          <el-icon size="60px" class="businessicon"><Shop /></el-icon>
        </div>
        <div class="information">
          <div class="name">
            商家
          </div>
          <div class="count">
            {{businessCount}}
          </div>
        </div>
      </div>
      <div class="orderCount">
        <div class="icon">
          <el-icon size="60px" class="ordericon"><List /></el-icon>
        </div>
        <div class="information">
          <div class="name">
            订单
          </div>
          <div class="count">
            {{orderCount}}
          </div>
        </div>
      </div>
      <div class="foodCount">
        <div class="icon">
          <el-icon size="60px" class="foodicon"><Food /></el-icon>
        </div>
        <div class="information">
          <div class="name">
            餐品
          </div>
          <div class="count">
            {{foodCount}}
          </div>
        </div>
      </div>
    </div>
    <div ref="main" class="main"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref,onMounted } from 'vue';
import http from '../../api/http';
const main = ref(null)
let userCount = ref(0)
let businessCount = ref(0)
let orderCount = ref(0)
let foodCount = ref(0)
const getUserCount = ()=>{
  http.get(`/getUserList`)
  .then(res=>{
    userCount.value = res.data.userlist.length
    console.log( res.data.userlist)
  })
  .catch(err=>{
    console.log(err)
  })
}
const getBusinessCount = ()=>{
  http.get(`/shop`)
  .then(res=>{
    businessCount.value = res.data.shops.length
  })
  .catch(err=>{
    console.log(err)
  })
}
const getOrderCount=()=>{
  http.get(`/getOrderData`)
  .then(res=>{
    orderCount.value = res.data.orderList.length
  })
  .catch(err=>{
    console.log(err)
  })
}
const getFoodCount=()=>{
  http.get(`/getAllFood`)
  .then(res=>{
    foodCount.value = res.data.foodList.length
  })
  .catch(err=>{
    console.log(err)
  })
}
const init=()=>{
  var myChart = echarts.init(main.value);
  let optionline = {
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  }
  myChart.setOption(optionline)
}
// 绘制图表

onMounted(() => {
  getUserCount()
  getBusinessCount()
  getOrderCount()
  getFoodCount()
  init()
  
})
</script>

<style lang="scss" scoped>
.color{
  color: rgb(167, 222, 234);
}
.index{
  width: 100%;
  height: 100%;
  .statistics{
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 100px;
    margin: 20px 0;
    .name{
      color: gray;
      padding-bottom: 5px;
      font-size: 20px;
    }
    .count{
      font-weight: bold;
      font-size: 20px;
    }
    .userCount {
      cursor: pointer;
      background: white;
      width: calc(100%/4 - 80px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      box-shadow: 7px 7px 27px rgb(232, 230, 230);
      
      .usericon{
        color:rgb(167, 222, 234);
        border-radius: 10px;
        transition:all 1s;
      }
      
    }
    .userCount:hover{
      .usericon{
        color:white;
        background: rgb(167, 222, 234);
        border-radius: 10px;
      }
    }
    .businessCount{
      cursor: pointer;
      background: white;
      width: calc(100%/4 - 80px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      box-shadow: 7px 7px 27px rgb(232, 230, 230); 
      .businessicon{
        color: orange;
        border-radius: 10px;
        transition:all 1s;
      }
    }
    .businessCount:hover{
      .businessicon{
        color:white;
        background: orange;
        border-radius: 10px;
      }
    }
    .orderCount{
      cursor: pointer;
      background: white;
      width: calc(100%/4 - 80px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      box-shadow: 7px 7px 27px rgb(232, 230, 230);  
      .ordericon{
        color:pink;
        border-radius: 10px;
        transition:all 1s;
      }
    }
    .orderCount:hover{
      .ordericon{
        color:white;
        background: pink;
        border-radius: 10px;
      }
    }
    .foodCount{
      cursor: pointer;
      background: white;
      width: calc(100%/4 - 80px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      box-shadow: 7px 7px 27px rgb(232, 230, 230);  
      .foodicon{
        color: rgb(8, 216, 8);
        border-radius: 10px;
        transition:all 1s;
      }    
    }
  }
  .foodCount:hover{
      .foodicon{
        color:white;
        background: rgb(8, 216, 8);
        border-radius: 10px;
      }
    }
  .main{
    height: 100%;
    width: 100%;
  }
}

</style>
