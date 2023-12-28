// app.js
App({
  globalData: {
    userInfo: null,
    // httpImageUrl:"http://127.0.0.1:8080/static/img/",//开发
    // httpUrl:"http://127.0.0.1:8080/"//开发
    httpImageUrl:"http://127.0.0.1:8080/static/image/",//上线
    httpUrl:"http://127.0.0.1:8080/",//上线
    address:[]
  },
  login(){//checksession
    let that = this
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          console.log(res)
          let code = res.code
          wx.setStorageSync('code', code)
          wx.request ({
            url:  that.globalData.httpUrl + 'getLoginInfo' , // 拼接接口地址(前面为公共部分)
            method: 'get',
            data:{
              code:wx.getStorageSync('code')
            },
            header: {
              'content-type' : 'application/json'
            },
            success (resp) {
              if (resp) { 
                  // 打印查看是否请求到接口数据

                console.log(resp.data)
                wx.setStorageSync('userToken', resp.data)
                that.getUserInfo()
              }	else {
                console.log('没有数据')
              } 
            },
            fail(msg){
              console.log(msg)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // getAddress(){
    
  // },
  getat(){
    console.log(1111)
  },
  getUserAddress(){
    var that = this
    return new Promise(function(resolve, reject){
      wx.request ({
        url:  that.globalData.httpUrl + 'getUserAddress' , // 拼接接口地址(前面为公共部分)
        method: 'get',
        header: {
          'content-type' : 'application/json',
          'usertoken':wx.getStorageSync('userToken')
        },
        success (res) {
          if (res) { 
              // 打印查看是否请求到接口数据
  
            // console.log(res.data.loginuser)
            resolve(res.data.addressres);
            console.log(res.data.addressres)
            // wx.setStorageSync('loginuser', res.data.loginuser)
          }	else {
            console.log('没有数据')
          } 
        },
        fail(msg){
          console.log(msg)
        }
      })
    })
  },
    
  getUserInfo(){
    var that = this
    wx.request ({
      url:  that.globalData.httpUrl + 'getUserInfo' , // 拼接接口地址(前面为公共部分)
      method: 'get',
      header: {
        'content-type' : 'application/json',
        'usertoken':wx.getStorageSync('userToken')
      },
      success (res) {
        if (res) { 
            // 打印查看是否请求到接口数据

          console.log(res.data.loginuser)
          wx.setStorageSync('loginuser', res.data.loginuser)
        }	else {
          console.log('没有数据')
        } 
      },
      fail(msg){
        console.log(msg)
      }
    })
  },
  onLaunch() {
    let that = this
    wx.checkSession({
      success () {
        console.log('sessionkey未过期')
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        console.log("sessionkey过期") //重新登录
        that.login()
        
      }
    }) 
    let loginuser = wx.getStorageSync('loginuser');
    var usertoken = wx.getStorageSync('userToken');
    if(!loginuser && !usertoken){
      wx.setStorageSync('isLogined', true)
    }else{
      wx.setStorageSync('isLogined', false)
    }
    if(wx.getStorageSync('isLogined')==false){
      that.login()
    }
    // that.getUserInfo()
  }
})
