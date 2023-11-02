// pages/changeInfo/changeInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    avatar:'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname:'微信用户'

  },
  onChooseAvatar(e){
    console.log(e)
    let avatar = e.detail.avatarUrl
    this.setData({
      avatar
    })
  },
  onInput(e){
    console.log(e)
    let nickname = e.detail.value
    this.setData({
      nickname
    })
  },
 async submit(){
  await this.uploadFile()
  },
  uploadFile() {
    let that = this
    return new Promise((resolve, reject) => {
      let url = `${that.data.httpUrl}avatar`
      // res.tempFiles[0].tempFilePath
      wx.uploadFile({
        filePath: that.data.avatar,
        name: 'file',
        url: url,
        header: {
          "content-type": "multipart/form-data"
          // 'Authorization': wx.getStorageSync('token') || ''
        },
        success(res) {
          // let result = JSON.parse(res.data)
          console.log('上传成功');
          // if (result.success) {
          //   console.log('成功');
          //   that.setData({
          //     avatar: result.data.outsideUrl
          //   })
          // }
          resolve()
        },
        fail(rej) {
          console.log('rej', rej);
          resolve(rej)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let avatar = wx.getStorageSync('userinfo').avatar
    let nickname = wx.getStorageSync('userinfo').nickname
    if(!avatar && !nickname){
      this.setData({
        avatar,
        nickname
      })
    }
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