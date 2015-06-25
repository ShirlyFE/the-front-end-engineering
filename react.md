# REACT
react不是一个MVC框架,而是facebook开发的一款js库，用来构建可重复调用的UI组件，侧重view层，是单向的从数据到视图的渲染，不存在双向数据绑定，不直接操作DOM，而是利用虚Virtual DOM通过diff算法更新真实DOM

JSX是JavaScript的一种支持XML字面量的扩展，尽管React并不依赖JSX，但是React网站上的示例代码都依赖它。


## react解决的问题
借用官方的说法：

> We built React to solve one problem: building large applications with data that changes over time.

## react的diff算法
render 执行的结果得到的不是真正的 DOM 节点。结果仅仅是轻量级的 JavaScript 对象，也就是被广泛提及的virtual DOM

看个[demo](https://github.com/shirlyLoveU/shirlyloveu.github.com/blob/master/shirlyDemo/react/diffTest.html)


































## 资源
[Why did we build React?](http://facebook.github.io/react/blog/2013/06/05/why-react.html)

[Facebook's React vs AngularJS: A Closer Look](http://www.quora.com/Pete-Hunt/Posts/Facebooks-React-vs-AngularJS-A-Closer-Look)

[Facebook’s New React JavaScript Library Tutorial Rewritten in AngularJS](https://medium.com/make-your-own-apps/facebooks-new-react-javascript-library-tutorial-rewritten-in-angularjs-e71bcedc36b)

[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)

[深入解析react](http://blog.reverberate.org/2014/02/react-demystified.html)

[React’s diff algorithm](http://calendar.perfplanet.com/2013/diff

[React Native 的理解](http://div.io/topic/851)

[React Native通信机制详解](http://blog.cnbang.net/tech/2698/)

[React-Native学习指南](http://top.css88.com/archives/701)

[Facebook React Native 中文教程](http://wiki.jikexueyuan.com/project/react-native/style.html)

