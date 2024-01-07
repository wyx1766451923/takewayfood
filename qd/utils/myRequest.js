var requestHandler = {
  url: '',
  data: {},
  method: '',
  header: {},
  success: function (res) {
  },
  fail: function () {
  },
  complete: function () {
  }
}
 
function request(requestHandler) {
  var data = requestHandler.data;
  var url = requestHandler.url;
  var method = requestHandler.method;
  var header = requestHandler.header;
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: data,
    method: method,
    header:header,
    success: function (res) {
      wx.hideLoading();
      requestHandler.success(res)
    },
    fail: function () {
      wx.hideLoading();
      requestHandler.fail();
    },
    complete: function () {
       
    }
  })
}
 
module.exports = {
  request: request
}