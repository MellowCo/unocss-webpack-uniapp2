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

[具体使用](https://github.com/MellowCo/unocss-preset-weapp#uniapp-vue2)




---
## V0.1.3

### 去除`import`模式

> uniapp vue2 使用`import 'uno.css'` 无法及时生成`css`代码，导致打包时没有`css`代码

### 注释占位符 改为 css选择器占位符

> 原使用`注释占位符`(/* unocss-start */)，但是在`app`打包时，会将注释删除，导致打包后的`app`没有`css`文件

1. vue.config.js

```js
const UnoCSS = require('unocss-webpack-uniapp2').default
const transformWeClass = require('unplugin-transform-we-class/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS(),
      transformWeClass(),
    ],
  },
}
```

2. App.vue

> 使用`uno-start`和`uno-end`,作为占位符，内容随意

```vue
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

3. main.js

```js
// 不在需要导入 uno.css
// import 'uno.css'
```











## 参数说明(V0.1.3以作废)

* cssMode，可选值`style`和`import`,默认值`import`

### style

> `style`模式用于兼容`uniapp vue2 app`，如果需要开发`app`,`cssMode`设置为`style`,对`小程序`和`h5`没有影响
>
> 因为`app`不可以使用`improt 'uno.css'`引入生成的css，
>
> 所以可以将生成的unocss添加到`App.vue`入口文件中，就可以解决这个问题

1. vue.config.js

```js
// 使用 unocss-webpack-uniapp2 替换 @unocss/webpack
const UnoCSS = require('unocss-webpack-uniapp2').default
const transformWeClass = require('unplugin-transform-we-class/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS({
        // 需要app开发，cssMode设置为 style
        cssMode: 'style',
      }),
      transformWeClass(),
    ],
  },
}
```

2. main.js

```js
import Vue from 'vue'
import App from './App'
// 使用  cssMode: 'style'，不需要在 main.js 中引入 uno.css
// import 'uno.css'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
```

3. App.vue

> 添加占位符(/* unocss-start */ ),用于生成css代码的填充

```vue
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
/* unocss-start */
生成的unocss代码 会添加在这里
/* unocss-end */
</style>
```



---

### import

> 默认参数，不支持`app`开发

1. vue.config.js

```js
// 使用 unocss-webpack-uniapp2 替换 @unocss/webpack
const UnoCSS = require('unocss-webpack-uniapp2').default
const transformWeClass = require('unplugin-transform-we-class/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      UnoCSS(),
      transformWeClass(),
    ],
  },
}
```

2. main.js

```js
import Vue from 'vue'
import App from './App'
// 使用  cssMode: 'import'，需要在 main.js 中引入 uno.css
import 'uno.css'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
```





