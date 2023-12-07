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
    // console.log(resp)
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
          res.send({products})
        }
      })
})
app.get('/shop',(req,res)=>{//查询所有商家
  connection.query('select * from t_shop', (err, shops) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send({shops})
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
app.post("/businessAvatar", function (req, res) {//上传商家头像
  let form = new multiparty.Form();
  form.encoding = "utf-8";
  form.uploadDir = "./public/image/shop";
  form.parse(req, function (err, fields, files) {
    try {
      let inputFile = files.file[0];
      let date = Date.now()
      let newPath = form.uploadDir + "/" + date +'.png';
      fs.renameSync(inputFile.path, newPath);
      // console.log(inputFile.path,newPath)
      let newname = date +'.png'
      res.send({ newname });
      
    } catch (err) {
      // console.log(err);
      res.send({ err: "上传失败！" });
    }
  });
});
app.post("/deletePhoto", function (req, res) {//取消上传/删除图片
  let photoname = req.body.photoname
  // console.log(photoname)
  fs.unlink(`./public/image/${photoname}`, (err) => {
    if(err) {
      // console.log(err)
      res.send({data:'err'}) 
    }
    res.send({data:'ok'})
  })

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
      // console.log(phone[0].phone)
      let orderNum = moment(new Date()).format('YYYYMMDDHHmmss')+phone[0].phone
      // console.log(orderNum)
      connection.query(`SELECT id FROM wxuser where openid = "${userOpenid}"`, (err, user) => {
        if (err) {
          res.send({data:'openid出现问题'})
        } else {
          let userid = user[0].id
          // console.log(userid)
          connection.query(`INSERT INTO t_order (userid,foodlist,addressid,shopid,remark,totalprice,tablewarenum,selectArriveTime,foodnum,deliveryState,orderTime,orderNum) VALUES (${userid},"${toLiteral(foodlist)}",${addressid},${shopid},"${remark}",${totalprice},"${tablewarenum}","${selectArriveTime}",${foodnum},${deliveryState},"${orderTime}","${orderNum}")`, (err, orderinfo) => {
            if (err) {
              // console.log(err)
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
app.get('/getOrder',(req,res)=>{//获取订单信息（通过订单编号）
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let orderid = req.query.orderid
  // console.log(orderid)
  connection.query(`SELECT * FROM t_order where id = ${orderid}`, (err, orderinfo) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // console.log(userid)
        res.send(orderinfo[0])
        // console.log(orderinfo[0])
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
app.get('/cancelOrder',(req,res)=>{//获取订单商家信息
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let orderid = req.query.orderid
  connection.query(`update t_order set deliveryState = 4 where id = "${orderid}"`, (err, result) => {
      if (err) {
        res.send({data:'err'})
      } else {
        // console.log(userid)
        res.send({data:'ok'})
      }
    })
})
app.get('/getAllOrder',(req,res)=>{//获取订单信息（通过订单编号）
  // console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  connection.query(`SELECT id FROM wxuser where openid = "${userOpenid}"`, (err, user) => {
      if (err) {

        res.send({data:'openid err'})
      } else {
        // console.log(userid)
        let userid = user[0].id
        connection.query(`SELECT o.*,s.shopName,s.deliveryFees FROM t_order o JOIN t_shop s on o.shopid = s.id where userid = ${userid}`, (err, orders) => {
          if (err) {
            res.send({data:'openid err'})
          } else {
              // console.log(userid)
            res.send({orders})
              
          }
        })

      }
    })
})
app.get('/getShopMsg',(req,res)=>{//查询所有商家
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let shopid = req.query.shopid
  connection.query(`select * from t_shop where id = ${shopid}`, (err, shop) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        let shop = shop[0]
        res.send({shop})
      }
    })
})
app.post('/login',(req,res)=>{
  // console.log(req.body)
  let username = req.body.username
  let password = req.body.password
  connection.query(`SELECT * FROM admin where username = "${username}"`, (err, admin) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      if(admin.length>0){
        if(admin[0].password == password){
          res.send({
            login:'ok',
            token:{username:username,password:'*'}
          })
        }else{
          res.send({login:'pwdErro'})
        }
      }else{
        res.send({login:'noAdmin'})
      }
    }
  })
})
app.get('/getUserList',(req,res)=>{
  let startIndex = req.query.startIndex
  let size = req.query.size
  //  limit ${startIndex},${size}
  connection.query(`SELECT id,nickname,avatar FROM wxuser`, (err, userlist) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(userlist)
      res.send({userlist})
    }
  }) 
})
app.get('/getUserListCount',(req,res)=>{
  connection.query(`SELECT COUNT(*) as count FROM wxuser`, (err, userListCount) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      let count = userListCount[0].count
      // console.log(count)
      res.send({count})
    }
  }) 
})
app.post('/deleteUser',(req,res)=>{//删除用户信息
  // console.log(req.body)
  let id = req.body.id
  connection.query(`delete FROM wxuser where id = "${id}"`, (err, result) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.post('/deleteBusiness',(req,res)=>{//删除商家
  // console.log(req.body)
  let id = req.body.id
  connection.query(`delete FROM t_shop where id = "${id}"`, (err, result) => {
    if (err) {
      console.log(err)
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.post('/addBusiness',(req,res)=>{
  let businessInfo = req.body.businessInfo
  console.log(businessInfo)
  let shopName = businessInfo.shopName
  let shopPhoto = businessInfo.shopPhoto
  let connectPerson = businessInfo.connectPerson
  let telephone = businessInfo.telephone
  let address = businessInfo.address
  let startPrice = businessInfo.startPrice
  let deliveryFees = businessInfo.deliveryFees
  let deliveryTime = businessInfo.deliveryTime
  let isOpen = businessInfo.isOpen
  let description = businessInfo.description
  let announcement = businessInfo.announcement

  connection.query(`INSERT into t_shop(shopName,shopPhoto,connectPerson,telephone,address,startPrice,deliveryFees,deliveryTime,isOpen,description,announcement) values("${shopName}","${shopPhoto}","${connectPerson}","${telephone}","${address}",${startPrice},${deliveryFees},${deliveryTime},${isOpen},"${description}","${announcement}")`, (err, result) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.post('/setBusiness',(req,res)=>{//修改商家
  let businessInfo = req.body.businessInfo
  console.log(businessInfo)
  let id = businessInfo.id
  let shopName = businessInfo.shopName
  let shopPhoto = businessInfo.shopPhoto
  let connectPerson = businessInfo.connectPerson
  let telephone = businessInfo.telephone
  let address = businessInfo.address
  let startPrice = businessInfo.startPrice
  let deliveryFees = businessInfo.deliveryFees
  let deliveryTime = businessInfo.deliveryTime
  let isOpen = businessInfo.isOpen
  let description = businessInfo.description
  let announcement = businessInfo.announcement

  connection.query(`UPDATE t_shop SET shopName="${shopName}",shopPhoto="${shopPhoto}",connectPerson="${connectPerson}",telephone="${telephone}",address="${address}",startPrice=${startPrice},deliveryFees=${deliveryFees},deliveryTime=${deliveryTime},isOpen=${isOpen},description="${description}",announcement="${announcement}" where id = ${id}`, (err, result) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.get('/getAllFood',(req,res)=>{//查询当所有餐品
  connection.query(`select p.*,tp.typeid,t.typeName,s.shopName from t_product p join typeproduct tp on p.id = tp.productId join t_type t on t.id = tp.typeid join t_shop s on s.id = p.shopId`, (err, foodList) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send({foodList})
      }
    })
})
app.post('/deleteFood',(req,res)=>{//删除餐品
  // console.log(req.body)
  let id = req.body.id
  connection.query(`delete FROM t_product where id = ${id};delete FROM typeproduct where productid = "${id}"`, (err, result) => {
    if (err) {
      console.log(err)
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.post('/searchFood',(req,res)=>{//按条件搜索餐品
  // console.log(req.body)
  let shopName = req.body.shopName
  let typeName = req.body.typeName
  connection.query(`select p.*,tp.typeid,t.typeName,s.shopName from t_product p join typeproduct tp on p.id = tp.productId join t_type t on t.id = tp.typeid join t_shop s on s.id = p.shopId where s.shopName like "%${shopName}%" and t.typeName like "%${typeName}%"`, (err, searchFoodlist) => {
    if (err) {
      console.log(err)
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({searchFoodlist})
    }
  })
})
app.get('/getAlltype',(req,res)=>{//查询餐品分类
  connection.query(`select * from t_type `, (err, typeList) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send({typeList})
      }
    })  
})
app.post("/foodPhoto", function (req, res) {//上传菜品图片
  let form = new multiparty.Form();
  form.encoding = "utf-8";
  form.uploadDir = "./public/image/product";
  form.parse(req, function (err, fields, files) {
    try {
      let inputFile = files.file[0];
      let date = Date.now()
      let newPath = form.uploadDir + "/" + date +'.png';
      fs.renameSync(inputFile.path, newPath);
      // console.log(inputFile.path,newPath)
      let newname = date +'.png'
      res.send({ newname });
      
    } catch (err) {
      // console.log(err);
      res.send({ err: "上传失败！" });
    }
  });
});
app.post('/addFood',(req,res)=>{
  let foodInfo = req.body.foodInfo
  // console.log(foodInfo)
  let productName = foodInfo.productName
  let mainPhoto = foodInfo.mainPhoto
  let shopId = foodInfo.shopId
  let sales = 0
  let typeid = foodInfo.typeid
  let price = foodInfo.price
  let discount = foodInfo.discount
  connection.query(`SELECT * FROM typeshop where shopid = ${shopId} and typeid = ${typeid}`, (err, hastype) => {
    if (err) {
      console.log(err)
      res.send('query error') 
    } else {
      // 将 MySQL 查询结果作为路由返回值
      console.log(hastype.length)
      // res.send({data:'ok'})
      if(hastype.length==0){
        connection.query(`INSERT into typeshop(typeid,shopid) values(${typeid},${shopId})`, (err, insertType) => {
          if (err) {
            console.log(err)
            res.send('query error') 
          } else {
            // 将 MySQL 查询结果作为路由返回值
            // res.send({data:'ok'})
            connection.query(`INSERT into t_product(productName,mainPhoto,price,shopId,sales,discount) values("${productName}","${mainPhoto}","${price}","${shopId}","${sales}","${discount}")`, (err, result) => {
              if (err) {
                console.log(err)
                res.send('query error') 
              } else {
                // 将 MySQL 查询结果作为路由返回值
                let proid = result.insertId
                connection.query(`INSERT into typeproduct(typeid,productid) values(${typeid},${proid})`, (err, tpInsertRes) => {
                  if (err) {
                    console.log(err)
                    res.send('query error') 
                  } else {
                    // 将 MySQL 查询结果作为路由返回值                   
                    res.send({data:'ok'})
                  }
                })
              }
            })
          }
        })
      }else{
        connection.query(`INSERT into t_product(productName,mainPhoto,price,shopId,sales,discount) values("${productName}","${mainPhoto}","${price}","${shopId}","${sales}","${discount}")`, (err, result) => {
          if (err) {
            console.log(err)
            res.send('query error') 
          } else {
            // 将 MySQL 查询结果作为路由返回值
            let proid = result.insertId
            connection.query(`INSERT into typeproduct(typeid,productid) values(${typeid},${proid})`, (err, tpInsertRes) => {
              if (err) {
                console.log(err)
                res.send('query error') 
              } else {
                // 将 MySQL 查询结果作为路由返回值                   
                res.send({data:'ok'})
              }
            })
          }
        })
      }
    }
  })

})
app.post('/setFood',(req,res)=>{//修改餐品
  let foodInfo = req.body.foodInfo
  // console.log(foodInfo)
  let id = foodInfo.id
  let productName = foodInfo.productName
  let mainPhoto = foodInfo.mainPhoto
  let shopId = foodInfo.shopId
  // let sales = 0
  let typeid = foodInfo.typeid
  let price = foodInfo.price
  let discount = foodInfo.discount
  connection.query(`SELECT * FROM typeshop where shopid = ${shopId} and typeid = ${typeid}`, (err, hastype) => {
    if (err) {
      console.log(err)
      res.send('query error') 
    } else {
      // 将 MySQL 查询结果作为路由返回值
      console.log(hastype.length)
      // res.send({data:'ok'})
      if(hastype.length==0){
        connection.query(`INSERT into typeshop(typeid,shopid) values(${typeid},${shopId})`, (err, insertType) => {
          if (err) {
            console.log(err)
            res.send('query error') 
          } else {
            // 将 MySQL 查询结果作为路由返回值
            // res.send({data:'ok'})
            connection.query(`UPDATE t_product SET productName="${productName}",mainPhoto="${mainPhoto}",price=${price},shopId=${shopId},discount=${discount} where id = ${id}`, (err, result) => {
              if (err) {
                console.log(err)
                res.send('query error') 
              } else {
                // 将 MySQL 查询结果作为路由返回值
                
                connection.query(`UPDATE typeproduct SET typeid = ${typeid} where productid=${id}`, (err, tpInsertRes) => {
                  if (err) {
                    console.log(err)
                    res.send('query error') 
                  } else {
                    // 将 MySQL 查询结果作为路由返回值                   
                    res.send({data:'ok'})
                  }
                })
              }
            })
          }
        })
      }else{
        connection.query(`UPDATE t_product SET productName="${productName}",mainPhoto="${mainPhoto}",price=${price},shopId=${shopId},discount=${discount} where id = ${id}`, (err, result) => {
          if (err) {
            console.log(err)
            res.send('query error') 
          } else {
            // 将 MySQL 查询结果作为路由返回值
            
            connection.query(`UPDATE typeproduct SET typeid = ${typeid} where productid=${id}`, (err, tpInsertRes) => {
              if (err) {
                console.log(err)
                res.send('query error') 
              } else {
                // 将 MySQL 查询结果作为路由返回值                   
                res.send({data:'ok'})
              }
            })
          }
        })
      }
    }
  })

})
app.get('/getOrderData',(req,res)=>{//查询所有订单信息
  connection.query('SELECT o.*,a.proAddress,a.detilAddress,a.consignee,a.phone,s.shopName FROM t_order o join  u_address a on o.addressid = a.id join t_shop s on o.shopid = s.id', (err, orderList) => {
      if (err) {
        res.send('query error')
      } else {
        // 将 MySQL 查询结果作为路由返回值
        res.send({orderList})
      }
    })
})
app.post('/deleteOrderfood',(req,res)=>{//从订单中移除餐品
  // console.log(req.body)
  let id = req.body.id
  let foodlist = req.body.foodlist
  let totalprice = req.body.totalprice
  let foodnum = req.body.foodnum
  connection.query(`UPDATE t_order SET foodlist = '${foodlist}',totalprice = "${totalprice}",foodnum = "${foodnum}" WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err)
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.post('/deleteOrder',(req,res)=>{//根据id删除订单
  // console.log(req.body)
  let id = req.body.id
  connection.query(`DELETE from t_order where id =${id}`, (err, result) => {
    if (err) {
      console.log(err)
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(result)
      res.send({data:'ok'})
    }
  })
})
app.get('/getFoodTop5Sales',(req,res)=>{
  //  limit ${startIndex},${size}
  connection.query(`SELECT * FROM t_product order by sales desc limit 0,5`, (err, toplist) => {
    if (err) {
      res.send('query error')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(userlist)
      res.send({toplist})
    }
  }) 
})
app.get('/setSales',(req,res)=>{//控制销量变化
  //  limit ${startIndex},${size}
  let id = req.query.id
  let sales = req.query.sales
  console.log(id,sales)
  connection.query(`UPDATE t_product SET sales = ${sales} WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err)
      res.send('err')
    } else {
      // 将 MySQL 查询结果作为路由返回值
      // console.log(userlist)
      res.send({data:'ok'})
    }
  }) 
})