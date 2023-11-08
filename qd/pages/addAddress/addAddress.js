// pages/addAddress/addAddress.js
var app = getApp()
// var amapFile = require('../../utils/amap-wx.130.js')
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    addOrEdit:'add',//
    address:{},
    orderid:0,
    proAddress:'',//地址
    detilAddress:'',//详细地址
    consignee:'',//收货人
    phone:'',//手机号

  },
  setAddress(address){
    var that = this
    let id = that.data.orderid
    let newAddress = {id,...address}
    wx.request ({
      url: that.data.httpUrl + 'setAddress' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        address:newAddress
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
          console.log(res.data)
          Toast.success('修改成功');
        }	else {
          Toast.fail('修改失败');
        } 
      },
      fail(msg){
        Toast.fail('修改失败',msg);
      }
    })
    // console.log(newAddress)


  },
  addAddress(address){
    var that = this
    wx.request ({
      url: that.data.httpUrl + 'addAddress' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      data:{
        address:address
      },
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
          if(res.data.data == 'ok'){
            Toast.success('添加成功');
          }else{
            Toast.fail('添加失败');
          }

        }	else {
          Toast.fail('添加失败');
        } 
      },
      fail(msg){
        Toast.fail('添加失败',msg);
      }
    })


  },
  confirm(){
    let address = {
      proAddress:this.data.proAddress,
      detilAddress:this.data.detilAddress,
      consignee:this.data.consignee,
      phone:this.data.phone
    }
    let that = this
    if(that.data.addOrEdit == 'add'){
      console.log('新增add')
      Dialog.confirm({
        title: '新增地址',
        message: '确定要新增地址吗？',
      })
        .then(() => {
          console.log("提示新增")
          that.addAddress(address)
          let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[ pages.length - 2 ]
          app.getUserAddress().then(val=>{
            prevPage.setData({
              allAddress:val
            })
            wx.navigateBack({
              delta:1,
            })
          })

        })
        .catch(() => {
          // on cancel
        });
      
    }else{
      // console.log('修改')
      Dialog.confirm({
        title: '修改地址',
        message: '确认修改地址吗？',
      })
        .then(() => {
          that.setAddress(address)
          let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[ pages.length - 2 ]
          app.getUserAddress().then(val=>{
            prevPage.setData({
              allAddress:val
            })
            wx.navigateBack({
              delta:1,
            })
          })

        })
        .catch(() => {
          
        });

    }
    // console.log(address)

  },
  delete(){
    let addressId = this.data.orderid
    var that = this
    Dialog.confirm({
      title: '删除地址',
      message: '确认删除此地址吗？',
    })
      .then(() => {
        // on confirm
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
                let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
                let prevPage = pages[ pages.length - 2 ]
                app.getUserAddress().then(val=>{
                  prevPage.setData({
                    allAddress:val
                  })
                  wx.navigateBack({
                    delta:1,
                  })
                })
              }else{
                Toast.fail('删除失败');
              }
    
            }	else {
              Toast.fail('删除失败');
            } 
          },
          fail(msg){
            Toast.fail('删除失败',msg);
          }
        })
      })
      .catch(() => {
        // on cancel
      });

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
      console.log(this.data.orderid)
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