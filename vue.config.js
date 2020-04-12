module.exports = {
  devServer: {
    proxy: {
      '/useFileUploadAPI': { // 这里最好有一个
        target: 'http://localhost:8080/photo/userFile/uploadFiles', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/useFileUploadAPI': '/'
        }
      }
    }

  }
}
