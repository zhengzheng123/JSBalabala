# addEventListener第三个参数

在addEventListener事件委托中第三个参数，可以设置为bool类型（useCapture）或者object类型(options)。

- object类型(options)包括三个布尔值选项

  - capture：true使用事件捕获；false使用事件冒泡（默认值）

  - once：true只调用一次，在调用后自动销毁listener；false可以多次调用（默认值）

  - passive:不同浏览器默认值不同。

    true监听函数listener永远不调用preventDefault方法。**根据规范，默认值为false. 但是chrome, Firefox等浏览器为了保证滚动时的性能，在Window,、Document、 Document.body上针对 touchstart 和 touchmove 事件将passive默认值改为了true**， 保证了在页面滚动时不会因为自定义事件中调用了preventDefault而阻塞页面渲染。

- bool类型（useCapture）: 默认值为false（使用事件冒泡），与capture用法相同。

