/* 引入express框架 */
const express = require('express');
const app = express();
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))

/* 引入cors */
const cors = require('cors');
app.use(cors());
 
/* 引入body-parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const connection = require('./db/db')
app.listen(8080, () => {
    console.log('——————————服务已启动——————————');
})
 
app.get('/', (req, res) => {
    res.send('<p style="color:red">服务已启动</p>');
    
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