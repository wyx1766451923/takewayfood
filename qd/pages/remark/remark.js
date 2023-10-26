// pages/remark/remark.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    value:'',
    cueWord:[
      '放门口',
      '不要香菜',
      '不要葱',
      '对骑手：',
      '对商家：'
    ]
  },
  onChange(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    let value = this.data.value
    value = event.detail
    this.setData({
      value
    })
    // console.log(this.data.value)
  },
  selectword(e){
    let word = e.currentTarget.dataset.word
    let value = this.data.value
    value =  value + word
    this.setData({
      value
    })
  },
  confirmChange(){
    let value = this.data.value
    let pages = getCurrentPages();//获取page
    let prevPage = pages[pages.length-2];//上一个页面
    prevPage.setData({
      remark:value
    })
    wx.navigateBack({
      delta: 1
    })
  },
  clear(){
    this.setData({
      value:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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