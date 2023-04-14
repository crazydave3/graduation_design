const express = require('express');
const router = express.Router();
//const api = require('./api');
const db = require('./db');

//获取账号密码
router.get('/getadmin', (request, response) => {
    let sql = 'select * from admin';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        response.send(result);
    })
})

//修改账号密码
router.post('/setadmin', (request, response) => {
    let sql = 'update admin set ? where account=?';
    console.log(request.query);
    db.query(sql, [request.body, request.query.admin], (error, result) => {
        if (error) return console.log(error.message);
        response.send(result);
    })
})

module.exports = router;