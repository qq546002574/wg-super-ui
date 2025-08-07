// 构建目标是否为库
const isBuildLib = process.env.npm_lifecycle_script.indexOf('--target lib') > 0
const webpack = require('webpack')
module.exports = {
  publicPath: '', // 相对路径

  outputDir: isBuildLib ? 'dist/lib' : 'dist/docs/demo',
  configureWebpack:{
    plugins:[
      new webpack.ProvidePlugin({
        'window.Quill':'quill/dist/quill.js',
        Quill:"quill/dist/quill.js"
      })
    ]
  },
  // webpack 链式配置
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // const quill = new webpack.ProvidePlugin({
    //   'window.Quill':'quill/dist/quill.js',
    //   Quill:"quill/dist/quill.js"
    // })
    // // config.plugins.assign
    // config.plugins.(quill)

    // const vueRule = config.module.rule("vue");
    
    // if (vueRule) {
    //   vueRule.use("vue-loader").tap(options => {
    //     Object.assign(
    //       options.compilerOptions,
    //       { preserveWhitespace: true }
    //     );
    //     return options;
    //   });
    // } else {
    // 	console.warn('Could not find pre-existing "vue" rule to append!');
    // };
  },

  css: {
    loaderOptions: {
      sass: {
        // scss公共变量
        data: isBuildLib ? undefined : `@import "demo/assets/scss/variables.scss";`
      }
    }
  },

  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //         use: [
  //           {
  //             loader: "url-loader",
  //             options: {
  //               limit: 10000,
  //               name: "img/[name].[ext]",
  //               esModule: false
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }

}
