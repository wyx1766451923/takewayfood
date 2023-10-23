// pages/shopDetail/shopDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl:app.globalData.httpUrl,
    httpImageUrl:app.globalData.httpImageUrl,
    shopid:0,
    shopMsg:[],
    foods:[],
    vtabs: [],
    tabScrollTop:0,//标签距离顶部位置
    contentScrollTop:0,//现在的位置
    typeid:0,
    curIndex:0,
    activeTab: 0,
    isShow:false,
    foodlist:[],//选购的商品
    totalPrice:0,//合计价格
    foodNum:0,//点餐数量
  },
  getTopDistance(typeid){
    var that = this;
    var query = wx.createSelectorQuery()
    console.log(typeid)
    query.select(`#menu-${typeid}`).boundingClientRect(function (res) {
      console.log(res)
      that.setData({
        tabScrollTop: res.top  //根据实际需求加减值
      })
    }).exec()
  },
  onChange(e){
    console.log("change")
    console.log(e)
  },
  onPlus(e){//添加菜品
    console.log("plus")
    // console.log(e)
    let foodlist = this.data.foodlist
    let foodmsg = JSON.parse(JSON.stringify(e.currentTarget.dataset.food))
    // console.log(foodlist.length,foodmsg.id)
    if(foodlist.length==0){
      foodmsg.count = 1
      foodlist.push(foodmsg)
    }else{
      for(let i = 0;i<foodlist.length;i++){
        if(foodlist[i].id == foodmsg.id){
          foodlist[i].count++
          break;
        }
        if(i==foodlist.length-1){
          foodmsg.count = 1
          foodlist.push(foodmsg)
          break
        }
      }
    }

    this.setData({
      foodNum:this.data.foodNum+1,
      foodlist:foodlist
    })
    console.log(this.data.foodlist)
  },
  onMinus(e){//删除菜品
    console.log("minus")
    console.log(e)
    let foodlist = this.data.foodlist
    let foodmsg = JSON.parse(JSON.stringify(e.currentTarget.dataset.food))
    for(let i = 0;i<foodlist.length;i++){
      if(foodlist[i].id == foodmsg.id){
        if(foodlist[i].count>1){
          foodlist[i].count--
          break
        }else{
          foodlist.splice(i,1)
          break
        }
      }
    }
    this.setData({
      foodNum:this.data.foodNum-1,
      foodlist:foodlist
    })
    console.log(this.data.foodlist)
  },
  clickMenu(e){
    const typeid = e.currentTarget.dataset.typeid
    const curIndex = e.currentTarget.dataset.index
    // console.log(typeid)
    this.setData({
      typeid:typeid,
      curIndex:curIndex
    })
    
  },
  scroll(e){
    let vtabs = this.data.vtabs
    let height = 0
    for (let i = 0; i < vtabs.length; i++) {
      let els = wx.createSelectorQuery().select("#menu-" + vtabs[i].id);
      els.fields({
        size: true
      }, function (res) {
        // console.log(res);
        vtabs[i].top = height;
        height += res.height;
        vtabs[i].bottom = height
      }).exec()
    }
    this.setData({
      vtabs
    })
    let scrollTop = e.detail.scrollTop+50;

    for (let i = 0; i < vtabs.length; i++) {
      if (scrollTop > vtabs[i].top && scrollTop < vtabs[i].bottom) {
        this.setData({
          curIndex: i,
        })
        return false
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let Msg = JSON.parse(options.shopMsg)
    this.setData({
      shopMsg:Msg,
      shopid:Msg.id
    })
    console.log(this.data.shopMsg.shopPhoto)
    this.getTypeliat()
    this.getFoods()
  },

  getFoods(){
    var that = this
    wx.request ({
      url:  that.data.httpUrl + 'food' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      header: {
        'content-type' : 'application/json'
      },
      data:{
        id:that.data.shopid
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
          console.log(res.data)
          that.setData({
            foods:res.data

          })
        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){
        console.log(msg)
      }
    })
  },
  close(){
    this.setData({
      isShow:false
    })   
  },
  showDetail(){
    this.setData({
      isShow:true
    })
  },
  backHome(){
    wx.navigateBack({
      delta: 1
    });  
  },
  getTypeliat(){
    var that = this
    wx.request ({
      url:  that.data.httpUrl + 'type' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      header: {
        'content-type' : 'application/json'
      },
      data:{
        id:that.data.shopid
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据
            // console.log(res.data)
            const vtabs = res.data.map(item=>(
              {
                id:item.typeid,
                title:item.typeName
              }
              ))
            // console.log(vtabs)
          that.setData({
            vtabs:vtabs,
            typeid:vtabs[0].id
          })
        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){
        console.log(msg)
      }
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