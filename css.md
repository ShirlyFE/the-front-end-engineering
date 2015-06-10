### 1. the most interesting HTML/JS/DOM/CSS hacks that most web developers don't know about

#### see the layout

```css
    * { background-color: rgba(255,0,0,.2); }
    * * { background-color: rgba(0,255,0,.2); }
    * * * { background-color: rgba(0,0,255,.2); }
    * * * * { background-color: rgba(255,0,255,.2); }
    * * * * * { background-color: rgba(0,255,255,.2); }
    * * * * * * { background-color: rgba(255,255,0,.2); }
```
e.g. take [http://time.com](http://time.com)

![time home page](./images/main-qimg-9c359cbc341b1f22ea03300c0e2fe529.jpg)

With the above CSS, you will see something along the lines of:

![the layout of home page](./images/main-qimg-5e440f5d3fe8eb6ac7786d5bb6bb125b.jpg)

Different depth of nodes will use different colour allowing you to see the size of each element on the page, their margin and their padding. Now you can easily identify inconsistencies. Cool!

#### 2. quickly run html in the browser without creating a HTML file

Enter this in the address bar(won't work in IE): 

<pre>data:text/html,&lt;h1&gt;Hello, world!&lt;/h1&gt;</pre>

You can **make a page's CSS editable in the browser without using JS**(which also won't work in IE):

```html
    <!DOCTYPE html>
    <html>
        <body>
            <style style="display:block" contentEditable>
                body { color: blue }
            </style>
        </body>
    </html>
```
### 3. vh & vw (viewport width & viewport height) 

There are two units in CSS that have a solid browser support, yet they are widely underused:

One of the scenarios where we can use vh is a website with about 3-4 scrollable pages of content on which we have some elements. If we want to make each element the same height as the viewport (not the body height), the height: 100%; will not do the trick. Instead, height: 100vh; on each element will give each one the height of the viewport size.

To prevent the content from being hiddden if it overflows the height of that element, a min-height can be used.

[Using vw and vh Measurements In Modern Site Design](http://demosthenes.info/blog/660/Using-vw-and-vh-Measurements-In-Modern-Site-Design)

### 4. An HTML element with an ID creates a JavaScript global with the same name

Surprising but true, and it's done by modern browsers as a means of backwards compatibility:

```html
    <div id="someInnocentDiv"></div>
```

```javascript
    console.log(someInnocentDiv) // <div id="someInnocentDiv"></div>
```

### css BFC(block formatting context)

#### 什么是BFC
BFC(Block Formatting Context)，简单讲，它是提供了一个独立布局的环境，每个BFC都遵守同一套布局规则。例如，在同一个BFC内，盒子会一个挨着一个的排，相邻盒子的间距是由margin决定且垂直方向的margin会重叠。而float和clear float也只对同一个BFC内的元素有效

#### BFC的触发条件
1. 浮动元素，float 除 none 以外的值
2. 绝对定位元素，position（absolute，fixed）
3. display 为以下其中之一的值 inline-block，table-cell，table-caption
4. overflow 除了 visible 以外的值（hidden，auto，scroll）

#### BFC 的特性
1. 内部的Box会在垂直方向，从顶部开始一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生叠加,所以触发BFC可以阻止外边距折叠
3. BFC 可以包含浮动的元素，这也正是使用 overflow: hidden 与 overflow: auto 方法闭合浮动的原理，使用 overflow: hidden 或 overflow: auto 触发浮动元素父元素的 BFC 特性，从而可以包含浮动元素，闭合浮动。但是 IE6-7 并不支持 W3C 的 BFC ，而是使用自产的 hasLayout 。从表现上来说，它跟 BFC 很相似，只是 hasLayout 自身存在很多问题，导致了 IE6-7 中一系列的 bug 。触发 hasLayout 的条件与触发 BFC 有些相似，使用 zoom: 1 既可以触发 hasLayout 又不会对元素造成其他影响，相对来说会更为方便。
4. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。
5. 计算BFC的高度时，浮动元素也参与计算。
6. BFC 可以阻止元素被浮动元素覆盖，浮动元素的块状兄弟元素会无视浮动元素的位置，尽量占满一整行，这样就会被浮动元素覆盖，为该兄弟元素触发 BFC 后可以阻止这种情况的发生。




## 资料
[详解BFC](http://kayosite.com/remove-floating-style-in-detail.html)