// pages/becomRider/becomeRider.js
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const myRequest = require("../../utils/myRequest");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    id:0,
    riderid:0,
    pendingOrders:[],
    tokenOrders:[],
    completeOrders:[]

  },
  completeOrder(e){
    let orderid = e.currentTarget.dataset.orderid
    let that = this
    
    wx.request ({
      url: that.data.httpUrl + 'completeOrder' , // 拼接接口地址(前面为公共部分)
      method: 'post',
      data:{
        id:orderid,
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) {  

          if(res.data.data=='ok'){
            Toast.success('订单已完成');
            that.getTokenOrders()
            that.getPendingOrders()
            that.getCompleteOrders()
          }
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    }) 
  },
  takeOrder(e){
    let orderid = e.currentTarget.dataset.orderid
    console.log(orderid)
    let that = this
    
    wx.request ({
      url: that.data.httpUrl + 'takeOrder' , // 拼接接口地址(前面为公共部分)
      method: 'post',
      data:{
        id:orderid,
        riderid:that.data.riderid
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) {  

          if(res.data.data=='ok'){
            Toast.success('接单成功');
            that.getTokenOrders()
            that.getPendingOrders()
            that.getCompleteOrders()
          }
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    }) 

  },
  getPendingOrders(){//待接单
    let that = this
    myRequest.request({
      url:that.data.httpUrl + 'getPendingOrders',
      data:{},
      method: 'get',
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success:function(res){
        if (res) {  
          that.setData({
            pendingOrders:res.data.pendingOrders.reverse()
          })
          console.log(res.data.pendingOrders)
        }	else {
          Toast.fail('失败',msg);
        } 
      }
    })    
  },
  getTokenOrders(){//已接单
    let that = this
     this.getRiderid().then(res=>{
      console.log('数据：',res)
      wx.request ({
        url: that.data.httpUrl + 'getTokenOrders' , // 拼接接口地址(前面为公共部分)
        method: 'get',
        data:{
          riderid:that.data.riderid
        },
        header: {
          'content-type' : 'application/json',
          'usertoken':wx.getStorageSync('userToken')
        },
        success (res) {
          if (res) {  
            that.setData({
              tokenOrders:res.data.tokenOrders.reverse()
            })
            console.log(res.data.tokenOrders)
          }	else {
            Toast.fail('失败',msg);
          } 
        },
        fail(msg){
          Toast.fail('添加失败',msg);
        }
      })   
    })  
  },
  getCompleteOrders(){//已接单
    let that = this
    this.getRiderid().then(res=>{
      wx.request ({
        url: that.data.httpUrl + 'getCompleteOrders' , // 拼接接口地址(前面为公共部分)
        method: 'get',
        data:{
          riderid:that.data.riderid
        },
        header: {
          'content-type' : 'application/json',
          'usertoken':wx.getStorageSync('userToken')
        },
        success (res) {
          if (res) {  
            that.setData({
              completeOrders:res.data.completeOrders.reverse()
            })
            console.log(res.data.completeOrders)
          }	else {
            Toast.fail('失败',msg);
          } 
        },
        fail(msg){
          Toast.fail('添加失败',msg);
        }
      })   
    })  
  },
  onClick(event) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getRiderid(){
    let that = this
    
    return new Promise((resolve,reject)=>{
      wx.request ({
        url: that.data.httpUrl + 'getRiderid' , // 拼接接口地址(前面为公共部分)
        method: 'get',
        data:{
          id:that.data.id
        },
        header: {
          'content-type' : 'application/json',
          'usertoken':wx.getStorageSync('userToken')
        },
        success (res) {
          if (res) {  
            that.setData({
              riderid:res.data.riderid
            })
            resolve(res)
            console.log(res.data.riderid)
          }	else {
            Toast.fail('失败',msg);
          } 
        },
        fail(msg){
          reject(msg)
          Toast.fail('添加失败',msg);
        }
      })
    })     
  },
  onLoad(options) {
    console.log(options.id)
    let id = options.id
    this.setData({
      id:id
    })
   
    this.getPendingOrders()
    this.getTokenOrders()
    this.getCompleteOrders()
    
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