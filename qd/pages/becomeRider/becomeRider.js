// pages/becomRider/becomeRider.js
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    id:0,
    riderName:'',
    riderPhone:''
  },
  onRiderNameChange(e){
    console.log(e.detail)
    let riderName = e.detail.value
    this.setData({
      riderName
    })
  },
  onPhoneChange(e){
    console.log(e.detail)
    let riderPhone = e.detail.value
    this.setData({
      riderPhone
    })
  },
  applyRider(riderInfo){
    console.log(riderInfo)
    var that = this
    wx.request ({
      url: that.data.httpUrl + 'applyRider' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        riderInfo:riderInfo
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
          if(res.data.data=='ok'){
            Toast.success('提交成功');
            app.getUserInfo()
            wx.switchTab({
              url: '/pages/my/my',
              success: function () {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad(); //重新刷新device-info页面
              }
              
            })
          }else{
            Toast.fail('提交失败');
          }
        }	else {
          Toast.fail('提交失败');
        } 
      },
      fail(msg){
        Toast.fail('提交失败',msg);
      }
    })
  },
  confirm(){
    if(this.data.riderName=='' || this.data.phone==''){
      Toast.fail('请填写完整信息');
    }else{
      let riderInfo = {
        userid:this.data.id,
        riderName:this.data.riderName,
        riderPhone:this.data.riderPhone
      }
      let that = this
        // console.log('修改')
        Dialog.confirm({
          title: '提交申请',
          message: '确认提交吗？',
        })
          .then(() => {
            console.log('提交审核')
            that.applyRider(riderInfo)
  
          })
          .catch(() => {
            
          });
    }
   
    // console.log(address)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    let id = options.id
    this.setData({
      id:id
    })
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