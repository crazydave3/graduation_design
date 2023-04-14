module.exports = {
    // 关闭ESLINT校验工具
    lintOnSave: false,
    devServer: {
        // proxy: 'https://aip.baidubce.com/rest/2.0/face',
        proxy: {
            '/api': {
                target: "https://aip.baidubce.com/rest/2.0", // 实际跨域请求的API地址
                secure: true, // https请求则使用true
                ws: true,
                changeOrigin: true, // 跨域
                // 请求地址重写  http://front-end/api/login ⇒ http://api-url/login
                pathRewrite: {
                    '^/api': '/',
                }
            }
        }
    },
}