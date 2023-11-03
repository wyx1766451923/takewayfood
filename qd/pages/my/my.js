// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    code:'',
    avatar:'',
    nickname:''
  },
  edit(){
    wx.navigateTo({
      url: '/pages/changeInfo/changeInfo',
    })
    console.log("编辑信息")
  },
  watchAddress(){
    console.log("打开地址页面")
  },
  contactus(){
    console.log("联系我们")
  },
  aboutus(){
    console.log("关于我们")
  },
  getuserinfo(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let loginuser = wx.getStorageSync('loginuser')
    
    this.setData({
      avatar:this.data.httpImageUrl+loginuser.avatar,
      nickname:loginuser.nickname
    })
    console.log(this.data.avatar)
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