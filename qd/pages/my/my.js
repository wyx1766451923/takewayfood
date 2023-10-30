// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    code:''
  },
  edit(){
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
  login(){//checksession
    let that = this
    console.log("登录")
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          console.log(res)
          let code = res.code
          // that.setData({
          //   code
          // })
          wx.request ({
            url:  that.data.httpUrl + 'getLoginInfo' , // 拼接接口地址(前面为公共部分)
            method: 'get',
            data:{
              code:code
            },
            header: {
              'content-type' : 'application/json'
            },
            success (resp) {
              if (resp) { 
                  // 打印查看是否请求到接口数据

                console.log(resp)
              }	else {
                console.log('没有数据')
              } 
            },
            fail(msg){
      
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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