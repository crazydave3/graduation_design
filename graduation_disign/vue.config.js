module.exports = {
    // 关闭ESLINT校验工具
    lintOnSave: false,
    devServer: {
        proxy: 'https://aip.baidubce.com/rest/2.0/face'
    },
}