// 数据库连接配置
const mysql = require("mysql");
const db = mysql.createPool({
    host: '127.0.0.1', // 新建数据库连接时的 主机名或ID地址 内容
    user: 'root',
    database: 'railway', // 数据库名
    password: '123456', // root 密码
})

module.exports = db;