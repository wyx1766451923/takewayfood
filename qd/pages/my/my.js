// pages/my/my.js
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
    code:'',
    avatar:'',
    nickname:'',
    contactShow:false,
    aboutShow:false,
    myAddressshow:false,
    allAddress:[
      // {
      //   id:1,
      //   consignee:'陈桂金',
      //   proAddress:'重庆理工大学花溪校区',
      //   detilAddress:'B316',
      //   phone:'15523081234'
      // }
    ]
  },
  editUserInfo(){
    wx.navigateTo({
      url: '/pages/changeInfo/changeInfo',
    })
    console.log("编辑信息")
  },
  watchAddress(){
    console.log("打开地址页面")
    this.setData({
      myAddressshow:true
    })
  },
  onMyAddressClose(){
    this.setData({
      myAddressshow:false
    })
  },
  contactus(){
    console.log("联系我们")
    this.setData({
      contactShow:true
    })
  },
  onContactClose(){
    this.setData({
      contactShow:false
    })    
  },
  aboutus(){
    console.log("关于我们")
    this.setData({
      aboutShow:true
    })
  },
  onAboutClose(){
    this.setData({
      aboutShow:false
    })
  },
  delete(e){
    let addressId = e.currentTarget.dataset.id
    var that = this
    Dialog.confirm({
      title: '删除此地址',
      message: '确认删除此地址吗？',
    })
      .then(() => {
        wx.request ({
          url: that.data.httpUrl + 'deleteAddress' , // 拼接接口地址(前面为公共部分)
          method: 'get',
          data:{
            addressId:addressId
          },
          header: {
            'content-type' : 'application/json',
            'usertoken':wx.getStorageSync('userToken')
          },
          success (res) {
            if (res) { 
                // 打印查看是否请求到接口数据
              if(res.data.data == 'ok'){
                console.log(res.data)
                app.getUserAddress().then(val=>{
                  that.setData({
                    allAddress:val
                  })
                })
                Toast.success('删除成功');
              }else{
                Toast.fail('删除失败');
              }
    
            }	else {
              console.log('没有数据')
            } 
          },
          fail(msg){
            console.log(msg)
          }
        })
      })
      .catch(() => {
        // on cancel
      });


  },
  editAddress(e){
    console.log('编辑地址')
    let address = JSON.stringify(e.currentTarget.dataset.address)
    console.log("编辑地址",address)
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?address=${address}`
    })
  },
  onAddAddress(){
    console.log('新增地址')
    wx.navigateTo({
      url: '/pages/addAddress/addAddress'
    })
  },
  getuserinfo(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let loginuser = wx.getStorageSync('loginuser')
    app.getUserAddress().then(val=>{
      // console.log(val)
      this.setData({
        allAddress:val
      })
      // console.log(this.data.allAddress)
    })
    
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