// pages/index/index.js
var app = getApp()
import Toast from '@vant/weapp/toast/toast';
const myRequest = require("../../utils/myRequest");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData:[],
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    dateHour:Number
  },
  toDetail(e){
    var shopMsg = JSON.stringify(e.currentTarget.dataset.shopmsg)
    // console.log(shopMsg)
    if(JSON.parse(shopMsg).isOpen == 0){
      Toast('当前店铺未开');
    }else{
      wx.navigateTo({
        url: `/pages/shopDetail/shopDetail?shopMsg=${shopMsg}`   
      })
    }


  },
  getDataHour(){
    let date = new Date()
    let hour = Number(date.getHours())
    this.setData({
      dateHour:hour
    })
    // console.log(this.data.dateHour)
  },
  getShopData(){
    var that = this
    myRequest.request({
      url:that.data.httpUrl + 'shop',
      data:{},
      method: 'get',
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success:function(res){
        if (res) { 
          that.setData({
            shopData:res.data.shops
          })
        }	else {
          console.log('没有数据')
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getShopData()
    this.getDataHour()
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