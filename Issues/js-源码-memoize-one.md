# memoize-one源码解析
例如有一个add函数
```js
function add(a,b) {
  return a + b;
}
```
现在要对add函数的返回结果进行缓存，就是第一次计算出a+b的结果会进行缓存，下次入参如果不变
立即返回结果，不会再执行add函数。
## 实现简版
定义一个memoize的方法，接受一个函数作为参数，返回也是一个函数
```js
function memoize(fn) {
  // 返回一个函数
  return function () {
    // 1.获取参数
    let _len = arguments.length;
    let newArgs = new Array(_len);
    for(let _key = 0; _key < _len; _key ++) {
      newArgs[_key] = arguments[_key]
    }

    // 2.如果参数不变
    if(参数不变) {
      // 立即返回缓存结果
    }

    // 3.如果参数变化
    if(参数变化) {
      // 3.1 执行fn获取新结果
      const newRst = fn.apply(this, newArgs);

      // 3.2 缓存新结果

      // 3.3 缓存新参数

      // 3.4 返回新结果
      return newRst;
    }

  }
}
```
利用闭包对结果和参数进行缓存
> 当js引擎调用memoize方法时，创建memoize的**执行上下文**memoizeContext
> 并被压入执行上下文栈ECStack中，当memoize执行完毕，memoizeContext
> 被弹出ECStack，按理说memoizeContext会被垃圾回收机制回收掉，但是因为
> return出来的这个函数引用了memoizeContext中的一个局部变量，所以memoizeContext
> 不会被回收销毁，就保存在了内存中

```js
function memoize(fn) {
  // 缓存结果
  let lastResult;
  // 缓存参数
  let lastArgs = [];
 
  // 判断两次入参是否相等
  const isNewArgEqualToLast = function (current,index) {
    return current === lastArgs[index]
  }

  // 返回一个函数
  return function () {
    // 1.获取参数
    let _len = arguments.length;
    let newArgs = new Array(_len);
    for(let _key = 0; _key < _len; _key ++) {
      newArgs[_key] = arguments[_key]
    }

    // 2.如果参数不变
    // 参数不变包括：1.参数个数不变 2.参数每一项不变
    if(newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
      // 立即返回缓存结果
      return lastResult;
    }

    // 3.如果参数变化
    // 3.1 执行fn获取新结果
    const newRst = fn.apply(this, newArgs);
    
    // 3.2 缓存新结果
    lastResult = newRst;
    
    // 3.3 缓存新参数
    lastArgs = newArgs;
    
    // 3.4 返回新结果
    return newRst;

  }
}
```

## 如果想自定义比较函数怎么办？
上面默认比较形式是 ===，如果想自定义比较函数可以传一个isEqual
```js
const simpleIsEqual = function (a,b) {
  return a === b;
}

function memoize(fn,isEqual) {
  // 为什么是void 0？其实就是undefined的意思
  // 在局部作用域中undefined可以当作变量被重写，所以不安全
  // void运算符对表达式进行求值，返回的总是undefined
  // 为什么是0？void 0是表达式中最短的，字节少
  if(typeof isEqual === void 0) {
    isEqual = simpleIsEqual
  }

  // 缓存结果
  let lastResult;
  // 缓存参数
  let lastArgs = [];
 
  // 判断两次入参是否相等
  const isNewArgEqualToLast = function (current,index) {
    return isEqual(current, lastArgs[index]);
  }

  // 返回一个函数
  return function () {
    // 1.获取参数
    let _len = arguments.length;
    let newArgs = new Array(_len);
    for(let _key = 0; _key < _len; _key ++) {
      newArgs[_key] = arguments[_key]
    }

    // 2.如果参数不变
    // 参数不变包括：1.参数个数不变 2.参数每一项不变
    if(newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
      // 立即返回缓存结果
      return lastResult;
    }

    // 3.如果参数变化
    // 3.1 执行fn获取新结果
    const newRst = fn.apply(this, newArgs);
    
    // 3.2 缓存新结果
    lastResult = newRst;
    
    // 3.3 缓存新参数
    lastArgs = newArgs;
    
    // 3.4 返回新结果
    return newRst;

  }
}

```
## 条件优化
添加一些判断上的优化，这样性能会更高
```js
const simpleIsEqual = function (a,b) {
  return a === b;
}

function memoize(fn,isEqual) {
  // 为什么是void 0？其实就是undefined的意思
  // 在局部作用域中undefined可以当作变量被重写，所以不安全
  // void运算符对表达式进行求值，返回的总是undefined
  // 为什么是0？void 0是表达式中最短的，字节少
  if(typeof isEqual === void 0) {
    isEqual = simpleIsEqual
  }

  // 缓存结果
  let lastResult;
  // 缓存参数
  let lastArgs = [];
  // 执行标识
  let calledOnce = false;
  // 缓存this
  let lastThis;
 
  // 判断两次入参是否相等
  const isNewArgEqualToLast = function (current,index) {
    return isEqual(current, lastArgs[index]);
  }

  // 返回一个函数
  return function () {
    // 1.获取参数
    let _len = arguments.length;
    let newArgs = new Array(_len);
    for(let _key = 0; _key < _len; _key ++) {
      newArgs[_key] = arguments[_key]
    }

    // 2.如果参数不变
    if(
      // 如果calledOnce为false后面的判断条件都不会执行 节省性能
      calledOnce &&
      // 如果作用域都变了缓存失效 后面的不用执行
      lastThis === this &&
      // 参数长度一样
      newArgs.length === lastArgs.length && 
      // 参数每一项一样
      newArgs.every(isNewArgEqualToLast)
    ) {
      // 立即返回缓存结果
      return lastResult;
    }

    // 3.如果参数变化
    // 3.1 执行fn获取新结果
    const newRst = fn.apply(this, newArgs);
    
    // 3.2 缓存新结果
    lastResult = newRst;
    
    calledOnce = true;
    lastThis = this;
    
    // 3.3 缓存新参数
    lastArgs = newArgs;
    
    // 3.4 返回新结果
    return newRst;

  }
}
```

## memoize-one.js源码
```js
var simpleIsEqual = function simpleIsEqual(a, b) {
  return a === b;
};

function index (resultFn, isEqual) {
  if (isEqual === void 0) {
    isEqual = simpleIsEqual;
  }

  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;

  var isNewArgEqualToLast = function isNewArgEqualToLast(newArg, index) {
    return isEqual(newArg, lastArgs[index], index);
  };

  var result = function result() {
    for (var _len = arguments.length, newArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      newArgs[_key] = arguments[_key];
    }

    if (calledOnce && lastThis === this && newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
      return lastResult;
    }

    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  };

  return result;
}

export default index;

```

