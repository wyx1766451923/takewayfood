/* 引入mysql */
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'orderfood',
    multipleStatements: true
})
module.exports = conn
 
/* 监听端口 */
