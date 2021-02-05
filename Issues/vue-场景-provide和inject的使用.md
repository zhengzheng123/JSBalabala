# vue-场景-provide和inject的使用
## 场景描述

父组件A中有子组件B，C。子组件B中有子组件D，E。在D、E组件中需要监听各自的一个状态变化，然年后通知到组件C中

- 父组件A
  - 子组件B
    - 子组件D
    - 子组件E
  - 子组件C

## 代码实现

A组件

```js
<template>
    // 引入C组件 绑定val属性
    <C :val="val"></C>
</template>
export default {
    name: 'A',
    data () {
        return {
            val: ''
        }
    },
    // provide
    provide () {
        return {
            fn: this.change
        }
    },
    methods: {
        change (val) {
            this.val = val
        }
    }
}
```

D组件

```js
export default {
    name: 'D',
    // inject
    inject: {
        fn: { default: null }
    },
    data () {
        return {
            test: ''
        }
    },
    watch: {
        test: function () {
            this.fn && this.fn('我是D组件')
        }
    }
    
}
```

E组件（和D组件一样）

```js
export default {
    name: 'E',
    // inject
    inject: {
        fn: { default: null }
    },
    data () {
        return {
            test: ''
        }
    },
    watch: {
        test: function () {
            this.fn && this.fn('我是D组件')
        }
    }
    
}
```

C组件

```js	
export default {
    name: 'C',
    props: {
        val: String
    },
    watch: {
        // 监听属性val
        val: function (val, oldVal) {
            console.log('我发生变化了...'， val)
        }
    }
}
```

## 小结

provide/inject官方介绍：https://cn.vuejs.org/v2/api/#provide-inject

利用vuex或者Vue.observable()也可以实现
