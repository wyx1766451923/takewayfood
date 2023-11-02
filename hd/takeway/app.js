/* 引入express框架 */
const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
let https = require("https");
const jwt = require('jwt-simple');
const formidable = require("formidable");
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
app.get('/getLoginInfo',(req,res)=>{
  code = req.query
  console.log(req.query)
  axios.get(`https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid=${appid}&secret=${appsecret}&js_code=${req.query.code}`)
  .then(resp=>{
    session_key = resp.data.session_key
    openid = resp.data.openid
    let usertoken = {
      session_key,
      openid
    }
    let token = jwt.encode(usertoken, jwtSecret)
    res.send(token)
  })
  .catch(err=>{
    console.log(err) 
  })

}) 
app.get('/user',(req,res)=>{
    connection.query('select * from admin', (err, users) => {
        if (err) {
          res.send('query error')
        } else {
          // 将 MySQL 查询结果作为路由返回值
          res.send(users)
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

app.post("/avatar", (req, res) => {
//   var form = new formidable.IncomingForm();//既处理表单，又处理文件上传
//  //设置文件上传文件夹/路径，__dirname是一个常量，为当前路径
//   let uploadDir = path.join(__dirname, "/public/image/avatar");
//   form.uploadDir = uploadDir;//本地文件夹目录路径

//   form.parse(req, (err, fields, files) => {
//     let oldPath = files.cover.path;//这里的路径是图片的本地路径
//     console.log(files.cover.name)//图片传过来的名字
//     let newPath = path.join(path.dirname(oldPath), files.cover.name);
//      //这里我传回一个下载此图片的Url
//     var downUrl = "http://localhost:" + listenNumber + "/upload/" + files.cover.name;//这里是想传回图片的链接
//      fs.rename(oldPath, newPath, () => {//fs.rename重命名图片名称
//          res.json({ downUrl: downUrl })
//     })
//   })
  console.log(1111111,req.file)
})