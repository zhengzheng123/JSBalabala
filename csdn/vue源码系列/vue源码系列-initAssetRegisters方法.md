# vue源码系列-initAssetRegisters方法

## initAssetRegisters在哪？
在Vue的第二次包装里
文件位置：'src/core/index.js'
```javascript
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
...

initGlobalAPI(Vue)

...

export default Vue
```
进入initGlobalAPI
```javascript
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```
最后这行就是initAssetRegisters方法

## initAssetRegisters的作用是什么？
vue官网api中有Vue.component（注册或获取全局组件） Vue.directive（注册或获取全局指令）
Vue.filter（注册或获取全局过滤器）这三个全局api
它们的定义都是在initAssetRegisters这个方法中完成的

## initAssetRegisters解析
进入initAssetRegisters方法
```javascript
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 如果type是component，并且definition是对象
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```
initAssetRegisters接受Vue构造函数为参数，然后给Vue添加自身属性component，directive，filter。属性值都是function，它接受两个参数id和definition，最终返回的是新的definition（是Vue子类构造器）



ASSET_TYPES来自'shared/constants.js'

```javascript
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

当type是component时，结合官网Vue.component的用法

![image-20210222105822409](C:\Users\liz-q\AppData\Roaming\Typora\typora-user-images\image-20210222105822409.png)

当参数definition是一个对象时执行这两行

```javascript
if (type === 'component' && isPlainObject(definition)) {
    definition.name = definition.name || id    
    // 在initGlobalAPI方法中，执行了 Vue.options._base = Vue，所以this.options._base就是Vue
    // 在initGlobalAPI方法中，执行了initExtend(Vue)，所以Vue上有extend方法
    definition = this.options._base.extend(definition)
}
```

第一行设置组件的名称，如果在definition中没有传name，id就是组件的name。

第二行就是把definition传入extend，返回Vue的子构造器。



看看extend方法都做了什么？在initGlobalAPI中找到initExtend(Vue)，进入可以看到

```javascript
Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    // 关键是这行，VueComponent中执行了this._init(options)，这个和Vue函数中一摸一样，不同是在这给Sub自身添加了很多属性，这些属性Vue上是没有的
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // 设置Sub的prototype指向Super的prototype，Super就是Vue，所以Sub就是Vue的子构造器
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
```

请注意关键注释



extend方法最终返回的是子构造器Sub。

所以可以很容易理解Vue.component第二个参数可以是Vue.extend函数或者是一个对象了，如果是对象，经过处理后还是返回了Vue.extend。



Vue.directive和Vue.filter和Vue.component处理过程类似。



