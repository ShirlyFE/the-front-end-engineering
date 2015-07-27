document对象：实际上是window对象的属性，document == window.document为true，是唯一一个既属于BOM又属于DOM的对象  

document.lastModified  //获取最后一次修改页面的日期的字符串表示  

document.referrer  //用于跟踪用户从哪里链接过来的  

document.title  //获取当前页面的标题，可读写  

document.URL  //获取当前页面的URL，可读写  


location.assign("http:www.baidu.com");  //同location.href，新地址都会被加到浏览器的历史栈中  

location.replace("http:www.baidu.com");  //同assign()，但新地址不会被加到浏览器的历史栈中，不能通过back和forward访问  

navigator.cookieEnabled  //如果启用cookie返回true，否则返回false  

navigator.javaEnabled  //如果启用java返回true，否则返回false，通过此判断从而知道浏览器是否能显示 Java 小程序。

navigator.platform  //浏览器所在计算机平台的字符串表示  

navigator.plugins  //安装在浏览器中的插件数组  

navigator.taintEnabled  //如果启用了数据污点返回true，否则返回false  

navigator.userAgent  //用户代理头的字符串表示   



location.reload(true | false);  //重新载入当前页面，为false时从浏览器缓存中重载，为true时从服务器端重载，默认为false  

screen对象：用于获取某些关于用户屏幕的信息，也可用window.screen引用它  

  screen.width/height  //屏幕的宽度与高度，以像素计  

  screen.availWidth/availHeight  //窗口可以使用的屏幕的宽度和高度，以像素计 

  screen.colorDepth  //用户表示颜色的位数，大多数系统采用32位  

  window.moveTo(0, 0);  

  window.resizeTo(screen.availWidth, screen.availHeight);  //填充用户的屏幕   

  window.print() 打印当前窗口的内容

  window.focus() 把键盘焦点给予一个窗口

  window.blur() 把键盘焦点从顶层窗口移开

  //阻止事件冒泡函数
function stopBubble(e)
{
    if (e && e.stopPropagation)
        e.stopPropagation()
    else
        window.event.cancelBubble=true
}

 1. blur：元素失去焦点时触发，该事件不冒泡
 2. focus：元素获得焦点时触发。不冒泡
 3. focusin：元素获得焦点时触发，冒泡
 4. focusout：元素失去焦点时触发，冒泡


  mouseenter：类似“mouseover”，但不冒泡，而且当光标移到后代元素上不会触发。 

mouseleave：类似“mouseout”，但不冒泡。在元素上方是不触发。

页面上的所有元素都支持鼠标事件。除了mouseenter和mouseleave外，所有的事件都冒泡，并且他们的默认行为是可以被取消掉的。但取消鼠标事件的默认行为可能会影响到其他事件，因为有些鼠标事件是相互依赖的。

事情还没结束，DOM0事件模型还涉及到直接写在html中的事件。例如：

<div id="test" class="test" onclick="exec();" ></div>
通过这种方式注册的事件相当于动态调用函数(有点eval的意思)，因此不会传入event对象，同时，this指向的是window，不再是触发事件的dom对象。

W3C DOM Leavl 2标准的addEventListener方法执行事件的顺序是按照事件注册的顺序执行的。而IE的attachEvent方法则相反–后注册的事件先觖发，先注册的事件后触发。

W3C DOM Leavl 2标准的浏览器文本节点也会冒泡，而IE内核的浏览器文本节点不会冒泡。


element1.onclick = doSomething;
element2.onclick = doSomething;
上面例子中的dosomething触发时会得到一个event参数，
W3C为此event添加了一个currentTarget 属性，它包含了当前事件处理函数对应的HTML元素：这正是我们需要的。不幸的是，微软事件模型不包含类似的属性。

你可以使用this关键字。在上面的例子中它指向当前事件处理函数对应的HTML元素，就像currentTarget一样。


但是当你使用微软事件模型的时候，this关键字不会指向HTML元素。加上没有类似currentTarget的属性，这意味着当你执行如下代码的时候

element1.attachEvent('onclick',doSomething)
element2.attachEvent('onclick',doSomething)
你不能知道哪个HTML元素当前处理事件（也就是不知道事件绑定在哪个元素上）

 dispatch : function(el ,type){
23
        try{
24
            if(el.dispatchEvent){
25
                var evt = document.createEvent('Event');
26
                evt.initEvent(type,true,true);
27
                el.dispatchEvent(evt);
28
            }else if(el.fireEvent){
29
                el.fireEvent('on'+type);
30
            }
31
        }catch(e){};
32
    }


    任何标准的JavaScript对象应该包含的成员却在IE的window.event对象上消失了。既然window.event已经不是一个标准的JavaScript对象了，所以如果有什么理所当然的事情在window.event上变得不对劲了也不要感到特别惊奇


    与focus/blur的区别：
focusin/focusout 支持事件冒泡，因此可为其实现事件代理。

oninput事件

在做搜索框的智能提示，微博发布区@好友出现列表等功能时，我们需要监听输入框内部的变化。如果使用change事件，只能等失去焦点时才会触发回调，如果使用keydown，keypress，keyup，这几个键盘事件来监听，就监听不了右键的复制，剪贴，粘贴这些操作，这时我们就需要oninput事件了。

oninput事件是W3C提出来的，IE9才支持，但IE9对回退键，粘贴复制操作的监听也失灵，解决办法，用onkeydown解决回退键，oncut和onpaste解决粘贴复制操作（也可以通过onselectionchange事件来解决）。IE6-8下通过onpropertychange事件监听元素一切属性与特性的变化，因此可以通过它模拟oninput事件（事件对象的propertyName属性获取当前变动的属性名）。

兼容写法如下：

if(window.addEventListener){    //IE9+，以及其他标准浏览器

　　element.addEventListener("input",callback);

}

else{

　　element.attachEvent("onpropertychange",function(e){   //如果是IE6-8，input元素上的任何属性有变化就会触发

　　　　if(e.propertyName === "value"){    //如果是value属性有变化，就会触发回调

　　　　　　callback();

　　　　}

　　})

}

if(IE9){   //解决IE9下，input事件对回退，粘贴复制操作的失灵

　　var selectionchange = function(e){

　　　　if(e.type === "focus"){

　　　　　　document.addEventListener("selectionchange",callback);

　　　　}else{

　　　　　　document.removeEventListener("selectionchange",callback);

　　　　}

　　}

　　element.addEventListener("focus",selectionchange);   //input获得焦点就绑定document的selectionchange事件，因此在input中的任何操作都会冒泡到document中

　　element.addEventListener("blur",selectionchange);   //input失去焦点，就移除这个绑定事件

}


HTML5增加了辅助管理DOM焦点的功能。首先就是document.activeElement属性，这个属性始终会引用DOM中当前获得焦点的元素。元素获得焦点的方式有页面加载、用户输入（通常是通过按Tab键）和在代码中调用focus()方法

默认情况下，文档刚加载完成时，document.activeElement中保存的是document.body元素的引用。文档加载期间，document.activeElement的值为null。
另外就是新增了document.hasFocus()方法，这个方法用于确定文档是否获得了焦点。


通过检测文档是否获得了焦点，可以知道用户是不是正在与页面交互。

查询文档获知哪个元素获得了焦点，以及确定文档是否获得了焦点，这两个功能最重要的功能用途是提高web应用的无障碍性。无障碍web应用的一个主要标志就是恰当的焦点管理，而确切地知道哪个元素获得了焦点是一个极大的进步，至少我们不用再像过去那样靠猜测了。


Basically, this is what happens:

The Android stock browser doesn't fire touch events. It just tries to emulate mouse clicks with taps, firing mousedown, mouseup and click events consecutively, but double taps just zoom in and out tha page.

Chrome for Android fires the touchstart event when the finger touches the screen. If it's released soon enough, it fires then mousedown, mouseup, touchend and finally click events.

In case of long tap, after about half a second it fires mousedown and mouseup, and touchend when the finger is lifted, with no click event at the end.

If you move your finger, it fires a touchmove event a couple of times, then it fires a touchcancel event, and nothing happens afterwards, not even a touchend event when lifting the finger.

A double tap triggers the zoom in/out features, but event-wise it fires the combo touchstart-touchevent twice, with no mouse events fired.

Firefox for Android correctly fires the touchstart event, and in case of short tap fires mousedown, mouseup, touchend and click afterwards.

In case of long tap, it fires mousedown, mouseup and finally touchend events. It's the same of Chrome for these things.

But if you move your finger, if fires touchmove continously (as one may expect) but it doesn not fire the touchleave event when the finger leaves the element with the event listener, and doesn't fire the touchcancel event when the finger gets out of the browser viewport.

For double taps, it behaves just like Chrome.

Opera Mobile does the same thing of Chrome and Firefox for a short tap, but in case of long press activates some sort of sharing feature that I really want to disable. If you move your finger, or double tap, it behaves just like Firefox.

Chrome beta does the usual for short taps, but in case of long taps it doesn't fire the mouseup event anymore, just touchstart, then mousedown after half a second, then touchend when the finger is lifted. When the finger is moved, now it behaves like Firefox and Opera Mobile.

In case of double taps, it doesn't fire touch events when zooming out, but only when zooming in.

Chrome beta shows the oddest behaviour, but I can't really complain since it's a beta.

The question is: is there a simple and way to try to detect short taps, long taps and double taps in the most common browsers of touch devices?

Too bad I can't test it on iOS devices with Safari, or IE for Windows Phone 7/Phone 8/RT, but if some of you can, your feedback would be very appreciated.

Here is my latest observation on touch and mouse events on Android 4.3

Opera, Firefox, and Chrome seem to have a standard behavior

On Swipe (touchstart-touchmove-touchend):

No mouse event(exluding mouseover) fires.
Mouseover fires only if touchstart and touchend occurs on the same element. (touchstart-touchmove-touchend-mouseover)
If default is prevented on touchstart: the default swipe behavior does not work. no changes occur regarding mouse event firing.
On Tap(touchstart-touchend):

All mouse events mouseover-mousemove-mousedown-mouseup-click fire after a delay
If default is prevented on touchstart: only mouseover fires.
Android default browser has some non-standard behaviors:

Mouseover fires before touchstart which means mouseover always fires.
All mouse events fire on Tap, even if the default is prevented on touchstart.


Page Visibility
这个HTML5特性可能很少人听说，毕竟目前只有IE10和Chrome13及以上版本的浏览器支持。但是，这个API很有用，它可以用来判断用户是否正在浏览当前页面。在一些需要经常轮询的网站，可以通过判断用户是在浏览还是在挂页面来决定轮询频率，这样可以提高性能和节约带宽。

具体地说，它包括两个属性和一个事件：

document.hidden: 返回一个布尔值表示页面是否可见
document.visibilityState: 返回一个可视状态值, 例如, PAGE_VISIBLE, PAGE_PREVIEW等.
visibilitychange: 可视状态改变会触发的事件.

Pointer和Gestures事件
用过Window8的童鞋都知道，Metro界面提供了全新的一流的触摸用户体验。在IE10和Metro App中，开发者可以使用一种更通用的输入形式，我们叫作“Pointer”。Pointer可以表示任何一个在屏幕中的点，这个点可以是一个鼠标指针，手写笔，一支手指或者多个手指。这个模型让我们在写网页和App的时候更加爽，无需考虑用户在使用PC，Pad还是手机。

![集合touch、mouse、pen的pointer事件](./images/pointer.png)

Pointer事件
和鼠标事件类似，pointer事件会在点击，移动，释放，移进，移出的时候触发：

MSPointerDown
MSPointerMove
MSPointerUp
MSPointerOver
MSPointerOut
与鼠标不同的是，它可能在屏幕上有同时有多个点，例如，在多点触控的设备。这种情况下，多个独立的pointer事件会被触发，对应着屏幕的每一个点。当我们要对单独一个点进行处理，可以通过调用event.getPointerList()获得包含所有pointer的一个数组。

兼容鼠标
当触发pointer事件之后，IE10也会触发鼠标事件。这保证了在不支持Pointer事件的IE浏览器中，网页依然可以兼容。

当然，如果需要，我们也可以在MSPoniterDown事件方法中调用event.preventMouseEvent()来阻止鼠标事件触发。

特性检测
检测Poniter支持情况建议如下：

If (window.navigator.msPointerEnabled) {
//Pointer events are supported.
}

优化触控的一般方法
跟很多其他系统平台一样，IE10对于基本的触控交互提供了相对应的默认处理方法，譬如：

在可滚动区域按住可以移动内容
双指捏张可以缩放
点击，Hold住会出现菜单
轻触文本，可以选中
这些功能可以让网页和App提高触控体验，不过，有时候我们要禁用它们，以便实现我们自己的功能效果或者特别的用户体验。

下面是各种情况的禁用办法：

平移和缩放

1
.disablePanZoom {
2
overflow: hidden; /* 禁用平移 */
3
-ms-content-zooming: none; /* 禁用缩放 */
4
}
快捷菜单 

1
element.addEventListener("MSGestureHold", function(e) { e.preventDefault(); }, false);
2
//禁止菜单显示
3
element.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
4
//禁用菜单
轻触选中

1
element.addEventListener("selectstart", function(e) { e.preventDefault(); }, false);
2
//禁用选中
 Gesture事件
除了Pointer事件之外，IE10还可以识别复杂的交互（譬如，捏放，猛击，旋转等等）。这些交互动作都会被描述为手势事件。最基本的两个静态手势有：

MSGestureTap
MSGestureDoubleTap 
MSGestureHold
更加复杂的手势，可以通过MSGestureStart, MSGestureChange和 MSGestureEnd事件来完成。这些事件包含了手势变换的信息，例如，移动，放大，旋转，加速率等。下面例子可以说明：

view sourceprint?
1
document.addEventListener("MSGestureChange",logGesture,false);
2
var log = document.getElementById("log");
3
function logGesture(event) {
4
   var gesture = "Translation: " + event.translationX + "px, " + event.translationY + "px<br>";
5
  gesture += "Scale: " + event.scale + "x<br>";
6
  gesture += "Rotation: " + event.rotation*360/Math.PI + " deg<br>";
7
  gesture += "Velocity: " + event.velocityX + ", " + event.velocityY;
8
  log.innerHTML = gesture;
9
}

[IE10和适用于win8的使用js的windows应用商店引用包含的多种新DOM功能详解](https://msdn.microsoft.com/library/ie/hh673538.aspx#_DOMTouch)

创建手势对象

在您的网站中处理手势的第一步是实例化手势对象。

var myGesture = new MSGesture();
接下来，为该手势提供一个目标元素。浏览器将对该元素触发手势事件。同时，该元素还可以确定事件的坐标空间。

elm = document.getElementById("someElement");
myGesture.target = elm;
elm.addEventListener("MSGestureChange", handleGesture);
最后，告知手势对象在手势识别期间处理哪些指针。

elm.addEventListener("MSPointerDown", function (evt) {
// adds the current mouse, pen, or touch contact for gesture recognition
myGesture.addPointer(evt.pointerId);
});
注意：请不要忘记您需要使用 –ms-touch-action 来配置元素以防止其执行默认触摸操作（例如，平移和缩放），并为输入提供指针事件。

处理手势事件

一旦手势对象具有有效目标并至少添加了一个指针，则其将开始触发手势事件。手势事件可分为两种：静态手势（例如，点击或保持）和动态手势（例如，收缩、旋转和轻扫）。

长按

长按手势是指用户使用一个手指触摸屏幕，并保持片刻并抬起而不移动的操作。在长按交互期间，MSGestureHold 事件会针对手势的各种状态而多次触发：

element.addEventListener("MSGestureHold", handleHold);
function handleHold(evt) {
if (evt.detail & evt.MSGESTURE_FLAG_BEGIN) {
// Begin signals the start of a gesture. For the Hold gesture, this means the user has been holding long enough in place that the gesture will become a complete press & hold if the finger is lifted.
}
if (evt.detail & evt.MSGESTURE_FLAG_END) {
// End signals the end of the gesture.
}
if (evt.detail & evt.MSGESTURE_FLAG_CANCEL) {
// Cancel signals the user started the gesture but cancelled it. For hold, this occurs when the user drags away before lifting. This flag is sent together with the End flag, signaling the gesture recognition is complete.
}
}
动态手势（收缩、旋转、轻扫和拖动）

动态手势（例如，收缩或旋转）将以转换的形式报告，这与 CSS 2D 转换颇为类似。动态手势可触发三种事件：MSGestureStart、MSGestureChange（随着手势的持续而重复触发）和 MSGestureEnd。每个事件都包含缩放（收缩）、旋转、转换和速度等相关信息。

由于动态手势以转换的形式报告，因此使用包含 CSS 2D 转换的 MSGesture 来操作诸如照片或拼图等元素将变得十分轻松。例如，您可以通过下列方式启用缩放、旋转和拖动元素的操作：

targetElement.addEventListener("MSGestureChange", manipulateElement);
function manipulateElement(e) {
// Uncomment the following code if you want to disable the built-in inertia provided by dynamic gesture recognition
// if (e.detail == e.MSGESTURE_FLAG_INERTIA)
// return;
 
var m = new MSCSSMatrix(e.target.style.transform); // Get the latest CSS transform on the element
e.target.style.transform = m
.translate(e.offsetX, e.offsetY) // Move the transform origin under the center of the gesture
.rotate(e.rotation * 180 / Math.PI) // Apply Rotation
.scale(e.scale) // Apply Scale
.translate(e.translationX, e.translationY) // Apply Translation
.translate(-e.offsetX, -e.offsetY); // Move the transform origin back
}
缩放和旋转等动态手势可支持鼠标操作，具体可通过在旋转鼠标滚轮的同时分别使用 CTRL 或 SHIFT 修饰键来实现。

object.dispatchEvent(eventObj)
  其返回值表示默认行为是否被阻止，false表示默认行为被阻止

object.initEvent (eventName, bubbles, cancelable);


For more information on touch and mouse events, see these great articles and libraries:

http://www.html5rocks.com/en/mobile/touchandmouse/
http://www.quirksmode.org/mobile/tableTouch.html
https://developers.google.com/mobile/articles/fast_buttons
http://caniuse.com/#search=touchstart
https://handjs.codeplex.com/
https://github.com/toolkitchen/PointerEvents




IE10 事件监听
MSPointerDown

类似mousedown，兼容触屏和鼠标操作

 

MSGestureTap

类似onclick，与MSPointerDown区别在于是否有鼠标和手指释放的一下，否则不会触发

 

MSGestureHold

用于监听鼠标或手指按住对象2s

 

MSGestureChange

监听鼠标或手指拖动对象，这个事件在拖动期间会被不断触发

 

MSGestureEnd

类似mouseup，兼容触屏和鼠标操作



MSPointerCancel

与MSGestureEnd的区别在于，这个事件必须要被一些系统性的事件阻断才会触发。例如在拖动对象时，有ALERT框弹出。



如何判断是鼠标还是触屏？

在事件返回的handle中，可以根据pointerType属性判断操作类型



有mouse、pen、touch 3种，假如没有需要区分操作类型的需求。理论上，IE10可以完美兼容鼠标和触屏交互操作。



如何实现一些缩放、旋转、拖动交互？

这些操作都需要依赖MSGestureChange来实现，关键点是如何获取鼠标或手指在对象上操作时的一些参数，例如手指拖动的方向、位移、加速度，甚至是双指或多指同时操作时的参数。

同样是在事件handle上可以获得：

translationX    基于X轴的位移

translationY    基于Y轴的位移

rotate   旋转的度数

scale     缩放的倍数

通过不断的获得这些参数，相应的修改对象的CSS3 transform，便可以实现一些常见的效果。

 

是否有更简单的使用办法？

在IE10下，实现图片放大缩小和图片幻灯片这两种常见交互，通过CSS就可以简单实现。

-ms-content-zooming : zoom;


-ms-content-zoom-limit-min: 100%;        //最小缩放倍数

-ms-content-zoom-limit-max: 500%;        //最大缩放倍数




-ms-scroll-snap-type: mandatory;            //允许snap

-ms-scroll-snap-points-x: snapInterval(0%, 100%);        //每次snap的距离



[js事件兼容性解决方案](http://developer.51cto.com/art/201503/467914_all.htm)

