### event.stopPropagation()
> This prevents any callbacks from being fired on any nodes further along the event chain, but it does not prevent any additional callbacks of the same event name from being fired on the current node.

也就是说stopPropagation是阻止事件的传播，而不是之前理解的阻止事件的冒泡

### event.stopImmediatePropagation

> stopImmediatePropagation (function)
This prevents any callbacks from being fired on any nodes further along the event chain, including any additional callbacks of the same event name on the current node.

[An Introduction To DOM Events](http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)

[javascript事件机制详解（涉及移动兼容）](http://www.cnblogs.com/yexiaochai/p/3462657.html)

### 利用modern browser生成图片的base64编码

```javascript
    var image = document.createElement('img')

    document.ondragover = function(e) {
        e.preventDefault()
    }
    document.ondrop = function (e) {
        e.preventDefault()  // prevent browser from trying to run/display the file
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = e.target.result
            console.log(result) // base64 encoded file data!
            image.src = result
            document.body.appendChild(image)
        };
        reader.readAsDataURL(e.dataTransfer.files[0]);
    }
```

关于拖曳与拖放事件的API这里做下简单说明：

1. **DataTransfer**对象：拖曳对象媒介，使用一般为Event.dataTransfer。
2. **draggable**属性：标签元素要设置draggable=true，否则不会有效果，例如：
```html
    <div title="拖拽我" draggable="true">列表1</div>
```
3. **ondragstart**事件：拖拽元素开始被拖拽时触发，此事件作用在被拖曳元素上
4. **ondragenter**事件：拖曳元素进入目标元素时触发，此事件作用在目标元素上
5. **ondragover**事件：拖拽元素在目标元素上移动时触发，此事件作用在目标元素上
6. **ondrop** 事件：拖拽元素在目标元素上同时鼠标放开时触发，此事件作用在目标元素上
7. **ondragend**事件：拖拽完成后触发，此事件作用在被拖曳元素上
8. **Event.preventDefault()**方法：阻止默认的些事件方法等执行。在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发。另外，如果是从其他应用软件或是文件中拖东西进来，尤其是图片的时候，默认的动作是显示这个图片或是相关信息，并不是真的执行drop。此时需要用用document的ondragover事件把它直接干掉。
9. **Event.effectAllowed**属性：拖拽效果

[简单拖曳demo](http://shirlyloveu.github.io/shirlyDemo/dragAnddrop.html)

[生成图片base64编码demo](http://shirlyloveu.github.io/shirlyDemo/getBase64EncodeOfImage.html

### 函数表达式和函数声明

命名函数表达式在Debug或者Profiler分析的时候来描述函数的名称，也可以使用函数名实现递归，但很快你就会发现其实是不切实际的。详情且看下文：

在ECMAScript中，创建函数的最常用的两个方法是函数表达式和函数声明，两者期间的区别是有点晕，因为ECMA规范只明确了一点：函数声明必须带有标示符（Identifier）（就是大家常说的函数名称），而函数表达式则可以省略这个标示符：

　　函数声明:

　　function 函数名称 (参数：可选){ 函数体 }

　　函数表达式：

　　function 函数名称（可选）(参数：可选){ 函数体 }

所以，可以看出，如果不声明函数名称，它肯定是表达式，可如果声明了函数名称的话，如何判断是函数声明还是函数表达式呢？ECMAScript是通过上下文来区分的，如果function foo(){}是作为赋值表达式的一部分的话，那它就是一个函数表达式，如果function foo(){}被包含在一个函数体内，或者位于程序的最顶部的话，那它就是一个函数声明。

```javascript
    function foo(){} // 声明，因为它是程序的一部分
    var bar = function foo(){}; // 表达式，因为它是赋值表达式的一部分

    new function bar(){}; // 表达式，因为它是new表达式

    (function(){
        function bar(){} // 声明，因为它是函数体的一部分
    })();

```
还有一种函数表达式不太常见，就是被括号括住的(function foo(){})，他是表达式的原因是因为括号 ()是一个分组操作符，它的内部只能包含表达式，我们来看几个例子：

```javascript
    function foo(){} // 函数声明
    (function foo(){}); // 函数表达式：包含在分组操作符内

    try {
        (var x = 5); // 分组操作符，只能包含表达式而不能包含语句：这里的var就是语句
    } catch(err) {
        // SyntaxError
    }
```
你可能会想到，在使用eval对JSON进行执行的时候，JSON字符串通常被包含在一个圆括号里：eval('(' + json + ')')，这样做的原因就是因为分组操作符，也就是这对括号，会让解析器强制将JSON的花括号解析成表达式而不是代码块。

```javascript
    try {
        { "x": 5 }; // "{" 和 "}" 做解析成代码块
    } catch(err) {
        // SyntaxError
    }

    ({ "x": 5 }); // 分组操作符强制将"{" 和 "}"作为对象字面量来解析 
```

表达式和声明存在着十分微妙的差别，首先，**函数声明会在任何表达式被解析和求值之前先被解析和求值**

另外，还有一点需要提醒一下，函数声明在条件语句内虽然可以用，但是没有被标准化，也就是说不同的环境可能有不同的执行结果，所以这样情况下，最好使用函数表达式：

```javascript
    // 千万别这样做！
    // 因为有的浏览器会返回first的这个function，而有的浏览器返回的却是第二个

    if (true) {
        function foo() {
          return 'first';
        }
    }
    else {
        function foo() {
          return 'second';
        }
    }
    foo();

    // 相反，这样情况，我们要用函数表达式
    var foo;
    if (true) {
        foo = function() {
          return 'first';
        };
    }
    else {
        foo = function() {
          return 'second';
        };
    }
    foo();
```
提到命名函数表达式，理所当然，就是它得有名字，前面的例子var bar = function foo(){};就是一个有效的命名函数表达式，但有一点需要记住：这个名字只在新定义的函数作用域内有效，因为规范规定了标示符不能在外围的作用域内有效：

```javascript
    var f = function foo(){
        return typeof foo; // foo是在内部作用域内有效
    };
    // foo在外部用于是不可见的
    typeof foo; // "undefined"
    f(); // "function"
```
#### 调试器中的函数名

如果一个函数有名字，那调试器在调试的时候会将它的名字显示在调用的栈上。有些调试器（Firebug）有时候还会为你们函数取名并显示，让他们和那些应用该函数的便利具有相同的角色，可是通常情况下，这些调试器只应用简单的规则来取名

```javascript
    function foo(){
        return bar();
    }
    function bar(){
        return baz();
    }
    function baz(){
        debugger;
    }
    foo();

    // 这里我们使用了3个带名字的函数声明
    // 所以当调试器走到debugger语句的时候，Firebug的调用栈上看起来非常清晰明了 
    // 因为很明白地显示了名称
    baz
    bar
    foo
```
通过查看调用栈的信息，我们可以很明了地知道foo调用了bar, bar又调用了baz（而foo本身有在expr_test.html文档的全局作用域内被调用），不过，还有一个比较爽地方，就是刚才说的Firebug为匿名表达式取名的功能：

```javascript
    function foo(){
        return bar();
    }
    var bar = function(){
        return baz();
    }
    function baz(){
        debugger;
    }
    foo();

    // Call stack
    baz
    bar() //看到了么？ 
    foo
```
所以最好还是给函数命名比较稳妥

[命名函数表达式](http://www.cnblogs.com/tomxu/archive/2011/12/29/2290308.html)

### 基本概念的理解 

#### Array sort方法sort(compareFunction)工作原理：

compareFunction是一个比较函数，处理数组相邻的两个元素

sort的排序条件是：
    * 参数大于0，arr的相邻两个元素交换位置
    * 参数小于0，arr的相邻两个元素不交换位置
    * 参数等于0，arr的相邻两个元素大小相等

***可见sort内部用的是冒泡排序***

### 面试题

#### 相应的参考资料

[详解js跨域问题](http://segmentfault.com/a/1190000000718840)

[这10道javascript笔试题你都会么](http://web.jobbole.com/82251/)

[40个重要的HTML5面试题及答案](http://blog.jobbole.com/78346/)

[.apply()、.call() 和arguments对象](http://web.jobbole.com/77496/)

[有趣的JavaScript原生数组函数](http://web.jobbole.com/56712/)

[移动端H5知识普及[系列] - 谈谈相对单位](http://blog.163.com/hongshaoguoguo@126/blog/static/1804698120152300167505/)