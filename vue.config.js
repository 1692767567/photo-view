module.exports = {
  devServer: {
    proxy: {
      '/useFileUploadAPI': { // 相册文件上传接口
        target: 'http://localhost:8080/photo/userFile/uploadFiles', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/useFileUploadAPI': '/'
        }
      },
      '/dynamicImgUploadAPI': { // 动态图片上传接口
        target: 'http://localhost:8080/photo/dynamic/uploadDynamicImg', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/dynamicImgUploadAPI': '/'
        }
      },
      '/albumTempImgUploadAPI': { // 动态相册模板图片上传
        target: 'http://localhost:8080/photo/management/albumTemp/uploadTempImg', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/albumTempImgUploadAPI': '/'
        }
      },
      '/albumTempFileUploadAPI': { // 动态相册模板css、js文件上传
        target: 'http://localhost:8080/photo/management/albumTemp/uploadTempFile', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/albumTempFileUploadAPI': '/'
        }
      },
      '/userAlbumFileUploadAPI': { // 用户动态相册的文件上传
        target: 'http://localhost:8080/photo/userAlbumFile/uploadFiles', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/userAlbumFileUploadAPI': '/'
        }
      },
      '/userAlbumTempPhotUploadAPI': { // 用户动态相册模板文件上传
        target: 'http://localhost:8080/photo/albumTemp/uploadTempImg', // 服务器端接口地址
        ws: true, // 如果要代理 websockets，配置这个参数
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/userAlbumTempPhotUploadAPI': '/'
        }
      }
    }

  }
}
