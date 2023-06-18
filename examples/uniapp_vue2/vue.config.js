const UnoCSS = require('unocss-webpack-uniapp2').default

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS(),
    ],
  },
}
