# 利用vue自定义指令开发数据加载状态

## 场景描述

表格或者div容器中，在数据加载出来之前的状态显示。数据加载完成后，状态消失。利用v-loading指令控制。

## 代码实现

About.vue

```vue
<template>
  <div class="about">
    <button @click="loading=!loading">改变状态</button>
    <div class="test" v-loading="loading">
      我是test
    </div>
  </div>
</template>
<script>
  export default {
    name: 'About',
    data () {
      return {
        // loading控制加载样式的显示与隐藏
        loading: true
      }
    }
  }
</script>
<style lang="scss">
  .test{
    border: 1px solid #dddddd;
    width: 500px;
    height: 300px;
  }
</style>

```

在src/config/directive.js中写下面代码（这段代码写在哪不重要，自己定义）

```javascript
/** 注册一个全局指令v-loading */
import Vue from 'vue'

// 插入dom
function insertLoadingDom (el) {
  el.style.position = 'relative'
  const div = document.createElement('div')
  div.setAttribute('id', 'loading__child')
  div.style.cssText = 'position: absolute;left: 0;right: 0;bottom: 0;top: 0;z-index: 999;background: #000;opacity: .5;color: #ffffff;'
  div.innerHTML = '<span style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);">loading...</span>'
  el.appendChild(div)
}

// 删除dom
function removeLoadingDom (el) {
  const div = el.querySelector('#loading__child')
  el.removeChild(div)
}

Vue.directive('loading', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    if (binding.value) {
      insertLoadingDom(el)
    }
  },
  update: function (el, binding) {
    if (!binding.value) {
      removeLoadingDom(el)
    } else {
      insertLoadingDom(el)
    }
  }
})

```

然后再main.js中引入directive.js

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局指令
import './config/directive'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

