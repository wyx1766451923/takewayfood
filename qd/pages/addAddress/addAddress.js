// pages/addAddress/addAddress.js
var amapFile = require('../../utils/amap-wx.130.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addOrEdit:'add',//
    address:{},
    orderid:0,
    proAddress:'',//地址
    detilAddress:'',//详细地址
    consignee:'',//收货人
    phone:'',//手机号

  },
  confirm(){
    let address = {
      proAddress:this.data.proAddress,
      detilAddress:this.data.detilAddress,
      consignee:this.data.consignee,
      phone:this.data.phone
    }
    console.log(address)
  },
  delete(){
    console.log("删除")
  },
  onProAddressChange(e){
    console.log(e.detail)
    let proAddress = e.detail.value
    this.setData({
      proAddress
    })
  },
  onDetilAddressChange(e){
    console.log(e.detail)
    let detilAddress = e.detail.value
    this.setData({
      detilAddress
    })
  },
  onConsigneeChange(e){
    console.log(e.detail)
    let consignee = e.detail.value
    this.setData({
      consignee
    })
  },
  onPhoneChange(e){
    console.log(e.detail)
    let phone = e.detail.value
    this.setData({
      phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let address = options.address
    if(!address){
      console.log("新增")
      wx.setNavigationBarTitle({
        title: '新增地址'
     })
     this.setData({
      addOrEdit:'add'
     })
    }else{
      console.log("修改")
      wx.setNavigationBarTitle({
        title: '修改地址'
     })
      address = JSON.parse(address)
     let {id:orderid,proAddress,detilAddress,consignee,phone} = address
      this.setData({
        address:address,
        addOrEdit:'edit',
        orderid,
        proAddress,
        detilAddress,
        consignee,
        phone
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