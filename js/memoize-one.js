function add(a,b) {
  console.log('我执行了------')
  return a + b;
}

const simpleIsEqual = function (a,b) {
  return a === b;
}

function memoize(fn,isEqual) {
  if(typeof isEqual === void 0) {
    isEqual = simpleIsEqual;
  }

  // 缓存的结果
  let lastResult;
  // 缓存参数
  let lastArgs = [];
  // 执行标识
  let calledOnce = false;
  // 缓存this
  let lastThis;

  // 判断两次入参是否相等
  const isNewArgEqualToLast = function (currentArg,index) {
    return isEqual(currentArg, lastArgs[index])
  }

  return function () {
    // 1.对arguments进行存储
    let _len = arguments.length;
    let newArgs = new Array(_len);
    for(let _key = 0; _key < _len; _key ++) {
      newArgs[_key] = arguments[_key]
    }

    // 2.判断参是否变化
    if(
      // 如果calledOnce为false后面的判断条件都不会执行 节省性能
      calledOnce &&
      // 如果作用域都变了缓存失效
      lastThis === this &&
      // 长度要想等
      newArgs.length === lastArgs.length &&
      // 参数每一项要相等
      newArgs.every(isNewArgEqualToLast)
    ) {
      // 如果不变 直接返回lastResult
      return lastResult;
    }

    // 3.参数变化
    // 重新计算结果
    lastResult = fn.apply(this,newArgs);

    calledOnce = true;
    lastThis = this;

    // 保存最新参数
    lastArgs = newArgs;

    return lastResult;

  }
}

const memoizeAdd = memoize(add);

// 传参和add函数一样
const rst = memoizeAdd(1,2);
const rst2 = memoizeAdd(1,2);
console.log(rst)
console.log(rst2)


