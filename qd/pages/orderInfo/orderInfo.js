// pages/orderInfo/orderInfo.js
var app = getApp()
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
    selectvalue:'', 
    remark:'',
    slectedAddress:[],
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
  onLoad(options) {
    let foodlist = JSON.parse(options.foodlist)
    let slectedAddress = JSON.parse(options.slectedAddress)
    let shopmsg = JSON.parse(options.shopmsg)
    let remark = options.remark
    let totalprice = options.totalprice
    let tablewarenum = options.tablewarenum//餐具数量
    let selectvalue = options.selectvalue//送达时间
    let foodnum = options.foodnum
    this.setData({
      foodlist,
      slectedAddress,
      shopmsg,
      remark,
      totalprice,
      tablewarenum,
      selectvalue,
      foodnum
    })
    console.log(totalprice)
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