/* 引入express框架 */
const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
let https = require("https");
const jwt = require('jwt-simple');
const formidable = require("formidable");
const multiparty = require("multiparty");
const moment = require('moment');
const fs = require("fs");
const jwtSecret = 'wangyingxin'//
app.use('/static', express.static(path.join(__dirname, 'public')))

/* 引入cors */
const cors = require('cors');
app.use(cors());
 
/* 引入body-parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
小程序授权
 */
const appid = 'wx54932d7e715c6c43'
const appsecret = '93ea39e726bc235f94add9b555bface1'
let code = ''

const connection = require('./db/db');
const { json } = require('body-parser');
app.listen(8080, () => {
    console.log('——————————服务已启动——————————');
})
 
app.get('/', (req, res) => {
    res.send('<p style="color:red">服务已启动</p>');
    
})
let session_key = ''
let openid = ''
let defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
let defaultNickname = '微信用户'
app.get('/getLoginInfo',(req,res)=>{
  code = req.query
  // console.log(req.query)
  axios.get(`https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=${appid}&secret=${appsecret}&js_code=${req.query.code}`)
  .then(resp=>{
    session_key = resp.data.session_key
    openid = resp.data.openid
    let usertoken = {
      session_key,
      openid
    }
    connection.query(`select * from wxuser where openid = "${openid}"`, (err, list) => {
      if (err) {

        console.log("出现错误",err)
      } else {
        //新用户自动注册
        if(list.length==0){
          connection.query(`INSERT INTO wxuser (openid, avatar,nickname) VALUES ("${openid}", "avatar/cat.jpeg","微信用户")`, (err, list1) => {
            if (err) {
      
              console.log("出现错误",err)
            } else {
              // 将 MySQL 查询结果作为路由返回值
              console.log("添加成功")
            }
          })
        }
      }
    })
    // console.log(openid)
    let token = jwt.encode(usertoken, jwtSecret)
    res.send(token)
  })
  .catch(err=>{
    console.log(err) 
  })

}) 
app.get('/getUserInfo',(req,res)=>{//查询用户信息
    // console.log(req.headers.usertoken)
    let usertoken = req.headers.usertoken
    let userOpenid = jwt.decode(usertoken,jwtSecret).openid
    // console.log(userOpenid)
    connection.query(`select * from wxuser where openid = "${userOpenid}"`, (err, user) => {
        if (err) {
          res.send('query error')
        } else {
          // 将 MySQL 查询结果作为路由返回值
          // console.log(user[0].nickname)
          let loginuser = {
            avatar:user[0].avatar,
            nickname:user[0].nickname
          }
          
          res.send({loginuser})
        }
      })
})
app.get('/updateUserInfo',(req,res)=>{//修改用户信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let avatar = req.query.avatar
  let nickname = req.query.nickname
  // console.log(userOpenid)
  connection.query(`UPDATE wxuser SET avatar = "${avatar}",nickname = "${nickname}" WHERE openid = "${userOpenid}"`, (err, user) => {
      if (err) {
        res.send({data:'error'})
      } else {
        // 将 MySQL 查询结果作为路由返回值     
        res.send({data:'ok'})
      }
    })
})
app.get('/product',(req,res)=>{//查询所有餐品
    connection.query('select * from t_product', (err, products) => {
        if (err) {
          res.send('query error')
        } else {
          // 将 MySQL 查询结果作为路由返回值
          res.send(products)
        }
      })
})
app.get('/shop',(req,res)=>{//查询所有商家
  connection.query('select * from t_shop', (err, shops) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send(shops)
      }
    })
})
app.get('/type',(req,res)=>{//查询当前商家餐品分类
  connection.query(`select * from t_type t join typeshop ts on t.id = ts.typeid WHERE ts.shopid = ${req.query.id}`, (err, typeList) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send(typeList)
      }
    })  
})
app.get('/food',(req,res)=>{//查询当前商家所有餐品
  connection.query(`select p.*,tp.typeid,t.typeName from t_product p join typeproduct tp on p.id = tp.productId join t_type t on t.id = tp.typeid where p.shopId = ${req.query.id}`, (err, foodList) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send(foodList)
      }
    })
})

app.post("/avatar", function (req, res) {//上传头像
  let form = new multiparty.Form();
  form.encoding = "utf-8";
  form.uploadDir = "./public/image/avatar";
  form.parse(req, function (err, fields, files) {
    try {
      let inputFile = files.file[0];
      let newPath = form.uploadDir + "/" + inputFile.originalFilename;
      fs.renameSync(inputFile.path, newPath);
      let newname = files.file[0].originalFilename
      res.send({ newname });
      
    } catch (err) {
      // console.log(err);
      res.send({ err: "上传失败！" });
    }
  });
});
app.get('/addAddress',(req,res)=>{//添加地址信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let address = JSON.parse(req.query.address)
  let proAddress = address.proAddress
  let detilAddress = address.detilAddress
  let consignee = address.consignee
  let phone = address.phone
  // console.log(address)
  connection.query(`SELECT id FROM wxuser where openid = "${userOpenid}"`, (err, user) => {
      if (err) {
        res.send({data:'openid出现问题'})
      } else {
        let userid = user[0].id
        // console.log(userid)
        connection.query(`INSERT INTO u_address (userid, proAddress,detilAddress,consignee,phone) VALUES (${userid},"${proAddress}","${detilAddress}","${consignee}","${phone}")`, (err, addres) => {
          if (err) {
    
            res.send({data:'error'})
          } else {
            // 将 MySQL 查询结果作为路由返回值
            res.send({data:'ok'})
          }
        })
      }
    })
})
app.get('/getUserAddress',(req,res)=>{//获取地址信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  connection.query(`SELECT id FROM wxuser where openid = "${userOpenid}"`, (err, user) => {
      if (err) {
        res.send({data:'openid出现问题'})
      } else {
        let userid = user[0].id
        // console.log(userid)
        connection.query(`SELECT * FROM u_address WHERE userid = ${userid}`, (err, addressres) => {
          if (err) {
    
            res.send({data:'error'})
          } else {
            // 将 MySQL 查询结果作为路由返回值
            // console.log(addressres)
            res.send({addressres})
          }
        })
      }
    })
})
app.get('/deleteAddress',(req,res)=>{//删除地址信息
  let addressId = req.query.addressId
  connection.query(`DELETE from u_address where id =${addressId}`, (err, delres) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send({data:'ok'})
      }
    })  
})
app.get('/setAddress',(req,res)=>{//添加地址信息
  // console.log(req.headers.usertoken)
  // let usertoken = req.headers.usertoken
  // let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let address = JSON.parse(req.query.address)
  let id = address.id
  let proAddress = address.proAddress
  let detilAddress = address.detilAddress
  let consignee = address.consignee
  let phone = address.phone
  // console.log(address)
  connection.query(`UPDATE u_address set proAddress = "${proAddress}",detilAddress = "${detilAddress}",consignee = "${consignee}",phone = "${phone}" WHERE id = ${id}`, (err, addressinfo) => {
      if (err) {
        res.send({data:'err'})
      } else {
        res.send({addressinfo})
      }
    })
})
function toLiteral(str) {
  var dict = { '\b': 'b', '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r' };
  return str.replace(/([\\'"\b\t\n\v\f\r])/g, function($0, $1) {
      return '\\' + (dict[$1] || $1);
  });
}

  // connection.query(`SELECT phone FROM u_address where id = ${addressid}`, (err, phone) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(phone[0].phone)
  //     phone = phone[0].phone
      
  //     // return phone[0].phone
  //   }
  // })
  

app.get('/setOrder',(req,res)=>{//添加订单信息
  // console.log(req.headers.usertoken)
  let deliveryState = 0
  let orderTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let foodlist = req.query.foodlist
  let addressid = req.query.addressid
  let shopid = req.query.shopid
  let remark = req.query.remark
  let totalprice = req.query.totalprice
  let tablewarenum = req.query.tablewarenum
  let selectArriveTime = req.query.selectArriveTime
  let foodnum = req.query.foodnum


  connection.query(`SELECT phone FROM u_address where id = ${addressid}`, (err, phone) => {
    if (err) {
      console.log(err)
    } else {
      console.log(phone[0].phone)
      let orderNum = moment(new Date()).format('YYYYMMDDHHmmss')+phone[0].phone
      console.log(orderNum)
      connection.query(`SELECT id FROM wxuser where openid = "${userOpenid}"`, (err, user) => {
        if (err) {
          res.send({data:'openid出现问题'})
        } else {
          let userid = user[0].id
          // console.log(userid)
          connection.query(`INSERT INTO t_order (userid,foodlist,addressid,shopid,remark,totalprice,tablewarenum,selectArriveTime,foodnum,deliveryState,orderTime,orderNum) VALUES (${userid},"${toLiteral(foodlist)}",${addressid},${shopid},"${remark}",${totalprice},"${tablewarenum}","${selectArriveTime}",${foodnum},${deliveryState},"${orderTime}","${orderNum}")`, (err, orderinfo) => {
            if (err) {
              console.log(err)
              res.send({data:'error'})
            } else {
              // 将 MySQL 查询结果作为路由返回值
              let orderid = orderinfo.insertId
              res.send({orderid})
            }
          })
        }
      })
      // return phone[0].phone
    }
  })
  // console.log(typeof foodlist,JSON.parse(foodlist))
  // console.log(address)

})
app.get('/getOrder',(req,res)=>{//获取订单信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let orderid = req.query.orderid
  console.log(orderid)
  connection.query(`SELECT * FROM t_order where id = ${orderid}`, (err, orderinfo) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // console.log(userid)
        res.send(orderinfo[0])
        console.log(orderinfo[0])
      }
    })
})
app.get('/getOrderAddress',(req,res)=>{//获取订单地址信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let addressid = req.query.addressid
  connection.query(`SELECT * FROM u_address where id = "${addressid}"`, (err, address) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // console.log(userid)
        res.send(address[0])
      }
    })
})
app.get('/getShopMsg',(req,res)=>{//获取订单商家信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let shopid = req.query.shopid
  connection.query(`SELECT * FROM t_shop where id = "${shopid}"`, (err, shopmsg) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // console.log(userid)
        res.send(shopmsg[0])
      }
    })
})