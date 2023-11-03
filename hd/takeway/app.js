/* 引入express框架 */
const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
let https = require("https");
const jwt = require('jwt-simple');
const formidable = require("formidable");
const multiparty = require("multiparty");

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
    console.log(req.headers.usertoken)
    let usertoken = req.headers.usertoken
    let userOpenid = jwt.decode(usertoken,jwtSecret).openid
    console.log(userOpenid)
    connection.query(`select * from wxuser where openid = "${userOpenid}"`, (err, user) => {
        if (err) {
          res.send('query error')
        } else {
          // 将 MySQL 查询结果作为路由返回值
          console.log(user[0].nickname)
          let loginuser = {
            avatar:user[0].avatar,
            nickname:user[0].nickname
          }
          
          res.send({loginuser})
        }
      })
})
app.get('/updateUserInfo',(req,res)=>{//修改用户信息
  console.log(req.headers.usertoken)
  let usertoken = req.headers.usertoken
  let userOpenid = jwt.decode(usertoken,jwtSecret).openid
  let avatar = req.query.avatar
  let nickname = req.query.nickname
  console.log(userOpenid)
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
      console.log(err);
      res.send({ err: "上传失败！" });
    }
  });
});