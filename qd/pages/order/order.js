// pages/order/order.js
var app = getApp()
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const myRequest = require('../../utils/myRequest')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    allOrder:[]
  },
  toOderInfo(e){
    let orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `/pages/orderInfo/orderInfo?orderid=${orderid}`,
    })
  },
  cancelOrder(e){
    console.log(e.currentTarget.dataset.id)
    let orderid = e.currentTarget.dataset.id
    var that = this
    Dialog.confirm({
      title: '取消订单',
      message: '确定要取消订单吗？',
    })
      .then(() => {
        console.log("提示取消")
        wx.request ({
          url:  that.data.httpUrl + 'cancelOrder' , // 拼接接口地址(前面为公共部分)
          method: 'get',
          data:{
            orderid:orderid
          },
          header: {
            'content-type' : 'application/json',
            'usertoken':wx.getStorageSync('userToken')
          },
          success (res) {
            if (res) { 
                // 打印查看是否请求到接口数据
              that.getAllOrder()
              console.log(res.data)
              Toast.success('取消成功');
            }	else {
              console.log('没有数据')
            } 
          },
          fail(msg){
            console.log(msg)
          }
        })
      })
      .catch(() => {
        // on cancel
      });
    

  },
  repay(e){
    let shopid = e.currentTarget.dataset.shopid
    let foodlist = JSON.stringify(e.currentTarget.dataset.foodlist)
    console.log(foodlist)
    var that = this
    wx.request ({
      url:  that.data.httpUrl + 'getShopMsg' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        shopid:shopid
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
            
          let shopMsg = JSON.stringify(res.data)
          console.log(res.data)
          wx.navigateTo({
            url: `/pages/shopDetail/shopDetail?shopMsg=${shopMsg}&foodlist=${foodlist}`,
          })

        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){
        console.log(msg)
      }
    })
  },
  toShop(e){
    console.log(e.currentTarget.dataset.shopid)
    let shopid = e.currentTarget.dataset.shopid
    var that = this
    wx.request ({
      url:  that.data.httpUrl + 'getShopMsg' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        shopid:shopid
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
            
          let shopMsg = JSON.stringify(res.data)
          console.log(res.data)
          wx.navigateTo({
            url: `/pages/shopDetail/shopDetail?shopMsg=${shopMsg}`,
          })

        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){

      }
    })
  },
  getAllOrder(){
    let that = this
    myRequest.request({
      url:that.data.httpUrl + 'getAllOrder',
      data:{},
      method: 'get',
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success:function(res){
        if (res) { 
          that.setData({
            allOrder:res.data.orders.reverse()
          })
        }	else {
          Toast.fail('失败',msg);
        }
      }
    })
    // wx.request ({
    //   url: that.data.httpUrl + 'getAllOrder' , // 拼接接口地址(前面为公共部分)
    //   method: 'get',
    //   header: {
    //     'content-type' : 'application/json',
    //     'usertoken':wx.getStorageSync('userToken')
    //   },
    //   success (res) {
    //     if (res) {  
    //       that.setData({
    //         allOrder:res.data.orders.reverse()
    //       })
    //       console.log(res.data.orders)
    //     }	else {
    //       Toast.fail('失败',msg);
    //     } 
    //   },
    //   fail(msg){
    //     Toast.fail('添加失败',msg);
    //   }
    // })    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllOrder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})