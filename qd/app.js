// app.js
App({
  globalData: {
    userInfo: null,
    // httpImageUrl:"http://127.0.0.1:8080/static/img/",//开发
    // httpUrl:"http://127.0.0.1:8080/"//开发
    httpImageUrl:"http://127.0.0.1:8080/static/image/",//上线
    httpUrl:"http://127.0.0.1:8080/"//上线
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
  onLaunch() {
    this.login()
  }
})
