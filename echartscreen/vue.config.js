// import config from '@/config'
const config = require('./src/config/index.js')
module.exports = {
  devServer: {
    port: 4000,
    open: true,
  //   proxy: {
  //     '/api': {
  //         target: 'https://127.0.0.1:3000/json/',
  // //         ws: true,
  //         changOrigin: true,    //是否开启代理
  //         pathRewrite: { //  /api开头的请求会去到target下请求
  //           '^/api': ''        //   替换/api 为空字符
  //         }}
  //   }
    
  },
  lintOnSave: false,
}
