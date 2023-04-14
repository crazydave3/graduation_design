const express = require("express");
const app = express();
const mysql = require("mysql");


const db = mysql.createPool({
        host: '127.0.0.1', // 新建数据库连接时的 主机名或ID地址 内容
        user: 'root',
        password: '123456', // root 密码
        database: 'railway'

    })
    // 监听端口
app.listen(80, () => {
    console.log("开启功");
});

//网页测试
// app.get('/login', (req, res, next) => {
//     res.send("hello,word");
//     console.log("hi");
// });


//数据库连接测试
// db.query('select 1', (err, result) => {
//     if (err) return console.log(err.message);
//     console.log("123456");
// })

//数据库语句测试
// let sql = 'select * from admin';
// db.query(sql, (err, result) => {
//     if (err) return console.log(err.message);
//     console.log(result);
// })