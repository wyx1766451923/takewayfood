/* 引入mysql */
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'orderfood',
    multipleStatements: true,
    charset:'utf8mb4'
})
module.exports = conn
 
/* 监听端口 */
