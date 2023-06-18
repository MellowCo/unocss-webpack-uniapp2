# unocss-webpack-uniapp2

[UnoCSS](https://github.com/unocss/unocss) Webpack plugin for UniApp2, fork form [@unocss/webpack](https://github.com/unocss/unocss/tree/main/packages/webpack)

## 示例app
[unocss-webpack-uniapp2.apk](https://raw.githubusercontent.com/MellowCo/unocss-webpack-uniapp2/main/unocss-webpack-uniapp2.apk)

![](https://fastly.jsdelivr.net/gh/MellowCo/image-host/2022/202208071542409.png)


## 解决问题

>  小程序项目启动时 部分class生成失败 需要手动触发

![image-20220724191023247](https://fastly.jsdelivr.net/gh/MellowCo/image-host/2022/202207241910381.png)



---

>  `uniapp vue2` **app** 无法使用 `import 'uno.css'`

<img src="https://fastly.jsdelivr.net/gh/MellowCo/image-host/2022/202207242000978.png" alt="image-20220724200055889" style="zoom:50%;" />

## 使用

[具体使用 demo](https://github.com/MellowCo/unocss-preset-weapp#uniapp-vue2)


---
1. vue.config.js

```js
const UnoCSS = require('unocss-webpack-uniapp2').default

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS(),
    ],
  },
}
```

2. unocss.config.js
```js
import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

const { transformerAttributify, presetWeappAttributify } = extractorAttributify()

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      // h5兼容
      platform: 'uniapp',
      isH5: process.env.UNI_PLATFORM === 'h5',
    }),
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
    },
  ],
  transformers: [
    transformerAttributify(),
    transformerClass(),
  ],
})
```



3. App.vue

> 使用`uno-start`和`uno-end`,作为占位符，内容随意

```html
<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
}
</script>

<style>
.uno-start {
  --un: 0;
}
/* unocss 代码生成在这 */
.uno-end {
  --un: 0;
}
</style>
```


4. main.js

```js
// 不在需要导入 uno.css
// import 'uno.css'
```







