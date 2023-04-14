const routerApi = require('./router');
const bodyParser = require("body-parser"); // post 数据需要
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.use(routerApi);

// 监听端口
app.listen(80, () => {
    console.log("开启成功");
});

console.log('success listen at port:80......');