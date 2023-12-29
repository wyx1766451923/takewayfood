// pages/orderInfo/orderInfo.js
var app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    foodlist:[],
    foodnum:0,
    totalprice:0,
    shopname:'',
    shopmsg:[],
    tablewarenum:'需要餐具，商家依据餐量提供',
    selectArriveTime:'', 
    orderid:0,
    remark:'',
    orderTime:'',
    slectedAddress:[],
    deliveryState:0,
    orderNum:'',
    riderInfo:[]
  },
  toShop(){
    let shopMsg = JSON.stringify(this.data.shopmsg)
    wx.navigateTo({
      url: `/pages/shopDetail/shopDetail?shopMsg=${shopMsg}`   
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getShopMsg(shopid){
    let that = this
    wx.request ({
      url: that.data.httpUrl + 'getShopMsg' , // 拼接接口地址(前面为公共部分)
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
          that.setData({
            shopmsg:res.data
          })
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    })    
  },
  getOrderAddress(addressid){
    let that = this
    wx.request ({
      url: that.data.httpUrl + 'getOrderAddress' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        addressid:addressid
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) {
          that.setData({
            slectedAddress:res.data
          })
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    })
  },
  getRiderInfo(id){
    let that = this
    let riderid = id
    wx.request ({
      url: that.data.httpUrl + 'getRiderInfo' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        riderid:riderid
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
          that.setData({
            riderInfo:res.data.riderInfo
          })
          console.log(that.data.riderInfo)
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    })  
  },    
  
  getOrder(orderid){
    let that = this

    wx.request ({
      url: that.data.httpUrl + 'getOrder' , // 拼接接口地址(前面为公共部分)
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
          let addressid = res.data.addressid
          let shopid = res.data.shopid
          that.setData({
            foodlist:JSON.parse(res.data.foodlist),
            foodnum:res.data.foodnum,
            remark:res.data.remark,
            selectArriveTime:res.data.selectArriveTime,
            tablewarenum:res.data.tablewarenum,
            totalprice:res.data.totalprice,
            orderTime:res.data.orderTime,
            deliveryState:res.data.deliveryState,
            orderNum:res.data.orderNum
          })
          if(res.data.riderid!=0){
            that.getRiderInfo(res.data.riderid)
          }
          that.getOrderAddress(addressid)
          that.getShopMsg(shopid)
          console.log(res.data)
        }	else {
          Toast.fail('失败',msg);
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    })  
  },
  onLoad(options) {

    let orderid = Number(options.orderid)
    this.getOrder(orderid)
    console.log(orderid)
    // let foodlist = JSON.parse(options.foodlist)
    // let slectedAddress = JSON.parse(options.slectedAddress)
    // let shopmsg = JSON.parse(options.shopmsg)
    // let remark = options.remark
    // let totalprice = options.totalprice
    // let tablewarenum = options.tablewarenum//餐具数量
    // let selectArriveTime = options.selectArriveTime//送达时间
    // let foodnum = options.foodnum
    // this.setData({
    //   foodlist,
    //   slectedAddress,
    //   shopmsg,
    //   remark,
    //   totalprice,
    //   tablewarenum,
    //   selectArriveTime,
    //   foodnum
    // })

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