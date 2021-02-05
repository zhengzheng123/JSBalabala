## javascript作用域理解

### 执行上下文（Execution Context）

每当控制器转到可执行代码的时候，就会进入一个可执行上下文，就是当前代码的**执行环境**，它会形成一个作用域。

javascript中的执行环境包含三种：

- 全局环境
- 函数环境
- eval

### 执行上下文的生命周期

当调用一个函数时，一个新的执行上下文会被创建，它包含两个阶段：

- 创建阶段

  在这个阶段，执行上下文会创建**变量对象（VO）**，作用域链（scopeChain），确定this指向

- 代码执行阶段

  创建完成之后就开始执行代码，这个时候会完成变量赋值，函数引用，以及执行其他代码

### 变量对象（Variable Object）

变量对象的创建依次经历：

1. 建立arguments对象，
2. 检查当前上下文的函数声明，也就是使用function关键字声明的函数。在变量对象中，以函数名创建一个属性，属性值为指向该函数所在的内存地址，如果函数名的属性已经存在，则覆盖。
3. 减产当前上下文中的变量声明，每找到一个变量声明，就在变量对象中以变量名建立一个属性，属性值为undefined。如果该变量名的属性已经存在，为了防止同名的函数被修改为undefined，则会直接跳过

### 作用域链

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

>函数创建

函数的作用域在函数创建的时候就决定了

这是因为函数内部有一个[[scope]]的内部属性，当函数创建的时候，就会保存**所有**父变量对象到其中

```js
function foo(){
    function bar(){
        ...
    }
}
```

函数创建的时候各自的[[scope]]为：

```js
foo.[[scope]] = [
    globalContext.VO
]
bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO,
]
```

### 案例

```js
var scope = "global scope"
function checkscope(){
    var foo = "foo"
    return foo;
}
checkscope()
```

执行过程如下：

1. 创建checkscope函数，保存作用域链到内部属性[[scope]]中

   ```js
   checkscope.[[scope]] = [
       globalContext.VO
   ]
   ```

   

2. 执行checkscope函数，创建checkscope函数**执行上下文**，checkscope函数执行上下文被压入**执行上下文栈**

   ```js
   ECStack = [
       checkscopeContext,
       globalContext
   ]
   ```

3. checkscope函数不立即执行，开始准备工作。第一步：复制函数[[scope]]属性创建作用域链，用arguments创建**变量对象VO**，随后初始化变量对象，加入形参，函数声明，变量声明

   ```js
   checkscopeContext = {
       VO:{
           arguments: {
               length: 0
           },
           foo: undefined
       },
       scope: checkscope.[[scope]]
   }
   ```

4. 第二步：激活VO变成**活动对象AO**

   ```js
   checkscopeContext = {
       AO:{
           arguments: {
               length: 0
           },
           foo: undefined
       },
       scope: checkscope.[[scope]]
   }
   ```

5. 第三步：将AO压入checkscope函数作用域链顶端

   ```js
   checkscopeContext = {
       AO:{
           arguments: {
               length: 0
           },
           foo: undefined
       },
       scope: [AO,checkscope.[[scope]]]
   }
   ```

6. 准备工作做完，开始执行函数，随着函数的执行，修改AO的属性值

   ```js
   checkscopeContext = {
       AO:{
           arguments: {
               length: 0
           },
           foo: "foo"
       },
       scope: [AO,checkscope.[[scope]]]
   }
   ```

7. 查找到foo的值，返回后函数执行完毕，checkscope执行上下文从执行上下文栈中弹出

   ```js
   ECStack = [
       globalContext
   ]
   ```

   

