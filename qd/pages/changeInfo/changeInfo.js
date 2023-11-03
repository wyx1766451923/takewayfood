// pages/changeInfo/changeInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    avatar:'',
    nickname:''

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
    var that = this
    let avatarurl = that.data.avatar.split('/')
    let avataru = avatarurl[avatarurl.length-2]+'/'+avatarurl[avatarurl.length-1]
    wx.request ({
      url:  that.data.httpUrl + 'updateUserInfo' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        avatar:avataru,
        nickname:that.data.nickname
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
          
          console.log(res)
          if(res.data.data == 'ok'){
            let avatar = avataru
            let nickname = that.data.nickname
            let loginuser = {
              avatar,
              nickname
            }
            wx.setStorageSync('loginuser', loginuser)
            wx.switchTab({
              url: '/pages/my/my',
              success: function () {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad(); //重新刷新device-info页面
              }
              
            })
          }

        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){

      }
    })

    // let pages = getCurrentPages();//获取page
    // let prevPage = pages[pages.length-2];//上一个页面
    // prevPage.setData({
    //   avatar,
    //   nickname
    // })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  updateNickname(){
    let that = this
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
          "content-type": "multipart/form-data",
          // 'Authorization': wx.getStorageSync('token') || ''
          'usertoken':wx.getStorageSync('userToken')
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
          console.log(JSON.parse(res.data).newname);
          let avatar = that.data.httpImageUrl+'avatar/'+JSON.parse(res.data).newname
          that.setData({
            avatar
          })
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
    let loginuser = wx.getStorageSync('loginuser')
    this.setData({
      avatar:this.data.httpImageUrl+loginuser.avatar,
      nickname:loginuser.nickname
    })
    // console.log(this.data.avatar)
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