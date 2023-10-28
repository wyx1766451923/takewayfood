// pages/payInfo/payInfo.js
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
    show:false,//备注底部弹出框控制
    tablewareshow:false,//餐具数量底部弹出框控制
    addressshow:false,//地址选择底部弹出框控制
    tablewarenum:'',
    selectTime:[],
    selectvalue:'', 
    remark:'',
    radio: '',
    slectedAddress:[],
    columns: ['无需餐具', 
    '需要餐具，商家依据餐量提供', 
    '1份', 
    '2份', 
    '3份',
    '4份',
    '5份',
    '5份以上',
    ],
    allAddress:[
      {
        id:1,
        consignee:'陈桂金',
        proAddress:'重庆理工大学花溪校区',
        detilAddress:'B316',
        phone:'15523081234'
      }
    ]
  },
  onTablewareChange(e){
    console.log(e)
  },
  onAddAddress(){
    console.log("新增地址")
    wx.navigateTo({
      url: '/pages/addAddress/addAddress'
    })
  },
  edit(e){
    let address = JSON.stringify(e.currentTarget.dataset.address)
    console.log("编辑地址",address)
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?address=${address}`
    })
  },
  onRadioChange(event) {
    console.log(event)
    this.setData({
      radio: event.detail,
    });
  },
  selectAddress(e){
    let slectedAddress = e.currentTarget.dataset.address
    this.setData({
      slectedAddress,
      addressshow:false
    })
  },
  onCancel(e){
    this.setData({
      tablewareshow:false
    })
  },
  onConfirm(e){
    let tablewarenum = e.detail.value
    this.setData({
      tablewareshow:false,
      tablewarenum
    })

  },
  modifyAddress(){//修改地址
    this.setData({
      addressshow:true
    })
  },
  onAddressClose(){//关闭修改地址
    this.setData({
      addressshow:false
    })
    console.log("关闭修改地址")
  },
  modifyDeliveryTime(){//修改送达时间
    console.log("修改送达时间")
    this.setData({
      show:true
    })
  },
  modifyRemarks(){//修改备注
    console.log("修改备注")
    wx.navigateTo({
      url: '/pages/remark/remark'
    })
  },
  selectTableware(){//选择餐具数量
    console.log("选择餐具数量")
    this.setData({
      tablewareshow:true
    })
  },
  pay(){
    console.log("payment")
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  onTablewareClose(){
    this.setData({
      tablewareshow:false
    })
  },
  determineTime(e){
    let selectvalue = e.currentTarget.dataset.select
    console.log(selectvalue)
    this.setData({
      selectvalue,
      show:false
    })
  },
  getSelectvalue(){
    let selectvalue = ''
    if(this.data.selectTime.length!=0){
      console.log("buwei 0") 
      selectvalue = this.data.selectTime[0]
      console.log(selectvalue)
    } 
    this.setData({
      selectvalue
    })
  },
  getNowTime(){
    let now = new Date()
    let hours = now.getHours()
    let selectTime = this.data.selectTime
    if(hours<=10 || (hours>10 && hours<=14)){
      if(hours<=10){
        let newDate = new Date(now.setHours(10))
        newDate = new Date(newDate.setMinutes(newDate.getMinutes()+Number(this.data.shopmsg.deliveryTime)))
        let newHours = newDate.getHours()
        for(;newHours<=14;){
          newDate = new Date(newDate.setMinutes(newDate.getMinutes()+10))
          newHours = newDate.getHours()
          let newMin = (newDate.getMinutes()/10) < 1?`0${newDate.getMinutes()}`:`${newDate.getMinutes()}`
          let newTime = newHours+':'+ newMin
          selectTime.push(newTime)
        }
        
      }else{
        let newHours = now.getHours()
        let newDate =  new Date()
        newDate =  new Date(newDate.setMinutes(newDate.getMinutes()+Number(this.data.shopmsg.deliveryTime)))
        for(;newHours<=14;){
          newDate = new Date(newDate.setMinutes(newDate.getMinutes()+10))
          newHours = newDate.getHours()
          let newMin = (newDate.getMinutes()/10) < 1?`0${newDate.getMinutes()}`:`${newDate.getMinutes()}`
          let newTime = newHours+':'+ newMin
          selectTime.push(newTime)
        }
      }
    }else if((hours<16&&hours>14) || (hours>=16&&hours<=20)){
      if(hours<16&&hours>14){
        let newDate = new Date(now.setHours(16))
        newDate = new Date(newDate.setMinutes(newDate.getMinutes()+Number(this.data.shopmsg.deliveryTime))) 
        let newHours = newDate.getHours()
        for(;newHours<=20;){
          newDate = new Date(newDate.setMinutes(newDate.getMinutes()+10))
          newHours = newDate.getHours()
          let newMin = (newDate.getMinutes()/10) < 1?`0${newDate.getMinutes()}`:`${newDate.getMinutes()}`
          let newTime = newHours+':'+ newMin
          selectTime.push(newTime)
        }
        
      }else{
        let newHours = now.getHours()
        let newDate =  new Date()
        newDate =  new Date(newDate.setMinutes(newDate.getMinutes()+Number(this.data.shopmsg.deliveryTime)))
        for(;newHours<=20;){
          newDate = new Date(newDate.setMinutes(newDate.getMinutes()+10))
          newHours = newDate.getHours()
          let newMin = (newDate.getMinutes()/10) < 1?`0${newDate.getMinutes()}`:`${newDate.getMinutes()}`
          let newTime = newHours+':'+ newMin
          selectTime.push(newTime) 
        }
      }      
    }else{
      console.log("不在范围内")
    }
    this.setData({
      selectTime
    })
    console.log(this.data.selectTime)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let foodlist = JSON.parse(options.foodlist)
    let foodnum = options.foodnum
    let totalprice = options.totalprice
    let shopmsg = JSON.parse(options.shopmsg)
    this.setData({
      foodlist,
      foodnum,
      totalprice,
      shopmsg,
    })

    this.getNowTime()
    this.getSelectvalue()
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