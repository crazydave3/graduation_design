const express = require('express');
const router = express.Router();
//const api = require('./api');
const db = require('./db');
const fs = require('fs');
const path = require('path');

router.post('/identify', (req, res) => {
    console.log(path.join(req.body.dir, req.body.fileName));
    const dataBuffer = Buffer.from(req.body.pic, 'base64');
    fs.writeFile(path.join(req.body.dir, req.body.fileName), dataBuffer, function(err) {
        if (err) {
            console.log(err);
        } else {}
    })
});
router.post('/count', (req, res) => {
    console.log(path.join(req.body.dir, req.body.fileName));
    const dataBuffer = Buffer.from(req.body.pic, 'base64');
    fs.writeFile(path.join(req.body.dir, req.body.fileName), dataBuffer, function(err) {
        if (err) {
            console.log(err);
        } else {}
    })
});
router.post('/monitor', (req, res) => {
    console.log(path.join(req.body.dir, req.body.fileName));
    const dataBuffer = Buffer.from(req.body.pic, 'base64');
    fs.writeFile(path.join(req.body.dir, req.body.fileName), dataBuffer, function(err) {
        if (err) {
            console.log(err);
        } else {}
    })
});
router.post('/register', (req, res) => {
    console.log(path.join(req.body.dir, req.body.fileName));
    const dataBuffer = Buffer.from(req.body.pic, 'base64');
    fs.writeFile(path.join(req.body.dir, req.body.fileName), dataBuffer, function(err) {
        if (err) {
            console.log(err);
        } else {}
    })
});
router.post('/criminal', (req, res) => {
    console.log(path.join(req.body.dir, req.body.fileName));
    const dataBuffer = Buffer.from(req.body.pic, 'base64');
    fs.writeFile(path.join(req.body.dir, req.body.fileName), dataBuffer, function(err) {
        if (err) {
            console.log(err);
        } else {}
    })
});
//获取注册信息
router.get('/getregister', (request, response) => {
    let sql = 'select * from people';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        for (let i = 0; i < result.length; i++) {
            let data = fs.readFileSync(result[i].photo);
            result[i].photo = Buffer.from(data).toString('base64');
        }
        response.send(result);
    })
});
//注册添加进数据库
router.post('/addregister', (request, response) => {
    let sql = 'insert into people set ?'
    db.query(sql, request.body, (error, result) => {
        if (error) return console.log(error.message);
        if (result.affectedRows === 1) {
            response.send('success');
        }
    })
});
//获取罪犯信息
router.get('/getcriminal', (request, response) => {
    let sql = 'select * from criminal';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        for (let i = 0; i < result.length; i++) {
            let data = fs.readFileSync(result[i].photo);
            result[i].photo = Buffer.from(data).toString('base64');
        }
        response.send(result);
    })
});
//添加罪犯信息进数据库
router.post('/addcriminal', (request, response) => {
    console.log(1);
    let sql = 'insert into criminal set ?'
        // console.log(request.body)
    db.query(sql, request.body, (error, result) => {
        if (error) return console.log(error.message);
        if (result.affectedRows === 1) {
            response.send('success');
        }
    })
});
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

//扫脸进闸添加进数据库
router.post('/addidentify', (request, response) => {
    let sql = 'insert into identify set ?'
    console.log(request.body)
    db.query(sql, request.body, (error, result) => {
        if (error) return console.log(error.message);
        if (result.affectedRows === 1) {
            response.send('success');
        }
    })
})

//获取扫脸进闸人脸
router.get('/getidentify', (request, response) => {
    let sql = 'select * from identify';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        response.send(result);
    })
})

//删除扫脸进闸人脸
router.get('/deleteidentify', (request, response) => {
    let sql = 'delete from identify where photo=?'

    fs.unlink(request.query.photo, (err) => {
        if (err) throw err;
        console.log('删除成功');
    })
    console.log(request.query.photo);
    db.query(sql, request.query.photo, (error, result) => {
        if (error) return console.log(error.message);
        response.send('success');
    })
})

//把罪犯添加进数据库
router.post('/addmonitor', (request, response) => {
    let sql = 'insert into monitor set ?'
    console.log(request.body)
    db.query(sql, request.body, (error, result) => {
        if (error) return console.log(error.message);
        if (result.affectedRows === 1) {
            response.send('success');
        }
    })
})

//获取罪犯人脸
router.get('/getmonitor', (request, response) => {
    let sql = 'select * from monitor';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        response.send(result);
    })
})

//删除罪犯人脸
router.get('/deletemonitor', (request, response) => {
    let sql = 'delete from monitor where photo=?'
    fs.unlink(request.query.photo, (err) => {
        if (err) throw err;
        console.log('删除成功');
    })
    console.log(request.query.photo);
    db.query(sql, request.query.photo, (error, result) => {
        if (error) return console.log(error.message);
        response.send('success');
    })
})

// 计算人数添加进数据库
router.post('/addcount', (request, response) => {
    let sql = 'insert into count set ?'
    console.log(request.body)
    db.query(sql, request.body, (error, result) => {
        if (error) return console.log(error.message);
        if (result.affectedRows === 1) {
            response.send('success');
        }
    })
})

//获取人流量数据
router.get('/getcount', (request, response) => {
    let sql = 'select * from count';
    db.query(sql, (error, result) => {
        if (error) return console.log(error.message);
        response.send(result);
    })
})

//删除人流量数据
router.get('/deletecount', (request, response) => {
    let sql = 'delete from count where photo=?'
    fs.unlink(request.query.photo, (err) => {
        if (err) throw err;
        console.log('删除成功');
    })
    console.log(request.query.photo);
    db.query(sql, request.query.photo, (error, result) => {
        if (error) return console.log(error.message);
        response.send('success');
    })
})

module.exports = router;