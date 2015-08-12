# http

## 服务器推送技术
传统模式的 Web 系统以客户端发出请求、服务器端响应的方式工作。这种方式并不能满足很多现实应用的需求，譬如：

* 监控系统：后台硬件热插拔、LED、温度、电压发生变化；
* 即时通信系统：其它用户登录、发送信息；
* 即时报价系统：后台数据库内容发生变化；

### comet
一般将基于 HTTP 长连接、无须在浏览器端安装插件的“服务器推送”技术为“Comet”。所以Comet 方式通俗的说就是一种长连接机制 (long lived http) 。同样是由 Browser 端主动发起请求，但是 Server 端以一种似乎非常慢的响应方式给出回答。这样在这个期间内，服务器端可以使用同一个 connection 把要更新的数据主动发送给 Browser 。因此请求可能等待较长的时间，期间没有任何数据返回，但是一旦有了新的数据，它将立即被发送到客户机。Comet 又有很多种实现方式，但是总的来说对 Server 端的负载都会有增加 . 虽然对于单位操作来说，每次只需要建议一次 connection, 但是由于 connection 是保持较长时间的 , 对于 server 端的资源的占用要有所增加。

优点：实时性好（消息延时小）；性能好（能支持大量用户）

缺点：长期占用连接，丧失了无状态高并发的特点。

应用：股票系统。实时通讯。

#### comet通常包含以下四个过程：

**1. 轮询的建立**
建立轮询的过程很简单，浏览器发起请求后进入循环等待状态，此时由于服务器还未做出应答，所以HTTP也一直处于连接状态中。 
**2. 数据的推送**
在循环过程中，服务器程序对数据变动进行监控，如发现更新，将该信息输出给浏览器，随即断开连接，完成应答过程，实现“服务器推”。 
**3. 轮询的终止**
轮询可能在以下3种情况时终止： 
**3.1. 有新数据推送**
当循环过程中服务器向浏览器推送信息后，应该主动结束程序运行从而让连接断开，这样浏览器才能及时收到数据。 
**3.2. 没有新数据推送** 
循环不能一直持续下去，应该设定一个最长时限，避免WEB服务器超时（Timeout），若一直没有新信息，服务器应主动向浏览器发送本次轮询无新信息的正常响应，并断开连接，这也被称为“心跳”信息。 
**3.3. 网络故障或异常** 
由于网络故障等因素造成的请求超时或出错也可能导致轮询的意外中断，此时浏览器将收到错误信息。 
**4. 轮询的重建**
浏览器收到回复并进行相应处理后，应马上重新发起请求，开始一个新的轮询周期。

#### Comet实现模型

##### 传统轮询
在 Web 早期，这一点常使用 meta 刷新实现。这将自动指示浏览器在指定秒数之后重新装载页面，从而支持简陋的轮询（ polling ）。例如在 HTML 文件中加入 <META HTTP-RQUIV="Refresh" CONTENT=12> ，实际上就是 HTTP 头标告知浏览器每 12 秒更新一次文档。

优点：不需要服务器端配置

缺点：用户体验度差对服务器的压力很大，带宽流失严重

##### ajax轮询
异步响应机制，即通过不间断的客户端 Ajax 请求，去发现服务端的变化。这种方式由于是客户端主动连接的，所以会有一定程度的延时，并且服务器的压力也不小。

使用AJAX实现服务器推送与传统AJAX应用的不同之处在于：

* 服务器端会阻塞请求直到有数据返回或者超时；
* 客户端JS响应函数在处理完服务端返回的信息后会再次发出请求，重新建立连接；

代码片段:
```javascript
window.setInterval(function () {
    $.get(url, 
        {"timed": new Date().getTime()}, 
        function (data) {
            $("#logs").append("[data: " + data + " ]<br/>");
    });
}, 3000);
```

##### 长轮询
原理是客户端发出一个http长连接请求，然后等待服务器的响应，服务器接到请求之后，并不立即发送出数据，而是hold住这个Connecton。这个处理是非阻塞的，所以服务器可以继续处理其他请求。在某个时刻，比如服务器有新数据了，服务器再主动把这个消息推送出去，即通过之前建立好的连接将数据推送给客户端。客户端收到返回。这个时候就可以处理数据，然后再次发起新的长连接。服务器压力一般，实时性很高。Servlet 3.0开始已经支持该技术。sina微博就是使用的原生Servlet 3实现的消息推送。

##### 基于iframe
通过在 HTML 页面里嵌入一个隐蔵帧，然后将这个隐蔵帧的 SRC 属性设为对一个长连接的请求，服务器端就能源源不断地往客户端输入数据。这种方式的难点在于如何判断连接中断并重新尝试连接。

普通轮询iframe代码片段：
```javascript
window.setInterval(function () {
    $("#logs").append("[data: " + $($("#frame").get(0).contentDocument).find("body").text() + " ]<br/>");
    $("#frame").attr("src", {url} + new Date().getTime());
    // 延迟1秒再重新请求
    window.setTimeout(function () {
        window.frames["polling"].location.reload();
    }, 1000);
}, 5000);
```

长连接iframe代码片段
```javascript
window.setInterval(function () {
    var url = {url} + new Date().getTime();
    var $iframe = $('<iframe id="frame" name="polling" style="display: none;" src="' + url + '"></iframe>');
    $("body").append($iframe);

    $iframe.load(function () {
        $("#logs").append("[data: " + $($iframe.get(0).contentDocument).find("body").text() + " ]<br/>");
        $iframe.remove();
    });
}, 5000);
```

**套接字：** 可以利用 Flash 的 XMLSocket 类或者 Java 的 Applet 来建立 Socket 连接，实现全双工的服务器推送，然后通过 Flash 或者Applet 与 JavaScript 通信的接口来实现最终的数据推送。但是这种方式需要 Flash 或者 JVM 的支持，同样不太合适于终端用户。


**HTML5的WebSocket：** 这种方式其实与套接字一样，但是这里需要单独强调一下：它是不需要用户额外安装任何插件的。HTML5 提供了一个 WebSocket 的 JavaScript 接口，可以直接与服务端建立Socket 连接，实现全双工通信，这种方式的服务器推送就是完全意义上的服务器推送了，没有半点模拟的成分，只是现阶段支持 HTML5 的浏览器并不多，而且一般老版本的各种浏览器基本都不支持。

##### 实际开发中应注意问题
对于一个实际的应用而言，系统的稳定性和性能是非常重要的。将 HTTP 长连接用于实际应用，很多细节需要考虑。

###### 不要在同一客户端同时使用超过两个的 HTTP 长连接
这个是由于HTTP 1.1 规范中规定：客户端不应该与服务器端建立超过两个的 HTTP 连接，新的连接会被阻塞。


###### 服务器端的性能和可扩展性
一般的WEB服务器是为每个连接创建一个线程，所以在使用Comet时，服务器要维护大量并发，长期存在的长连接。在这种背景下，就需要服务器负载均衡和集群技术，或者在服务端做一些优化。之前有个测试显示200万个Http长连接占用19G服务器内存，一个大约9kb；所以,你可以算一下你的服务器最多可以维护多少个长连接。

###### 控制信息与数据信息使用不同的 HTTP 连接
用长连接时，存在一个很常见的场景：客户端网页需要关闭，而服务器端还处在读取数据的堵塞状态，客户端需要及时通知服务器端关闭数据连接。服务器在收到关闭请求后首先要从读取数据的阻塞状态唤醒，然后释放为这个客户端分配的资源，再关闭连接。

###### 在客户和服务器之间保持“心跳”信息
客户端不知道何时服务器才有数据传送。服务器端需要确保当客户端不在状态（工作）时，释放为这个客户端分配的资源，防止内存泄漏。因此需要一种机制使双方知道大家都在正常运行。

#### websocket、webworker、server sent events

##### Web Workers
在HTML5的规范引入了Web Workers概念，解决了javascript无法多线程工作的问题。
一个worker可以理解为一个线程，那么workers自然是多线程了。
web worker处于一个自包含的环境中，无法访问主线程的window对象和document对象，和主线程通信只能通过异步消息传递机制。

将期望单独异步执行的javascript代码放在一个单独的js文件中，然后在页面中通过构造函数Worker()来创建一个线程。
Worker()构造函数的参数的是js文件的路径，可以是相对路径也可以是绝对路径（必须是同源的）。worker.js文件就会被异步加载，并在后台执行

[web worker](http://javascript.ruanyifeng.com/htmlapi/webworker.html)

##### 跨文档消息机制 Cross-document messaging
HTML5 提供了在网页文档之间相互接收和发送消息的功能。只需要获取到网页所在的窗口对象实例，两个 Web 页面就可以相互通信了，甚至是跨域的。postMessage 允许页面中多个 iframe/window 间的通信。

要想接收从其他窗口发送来的信息，只需要监听窗口对象的 onmessage 事件即可。
一个窗口想要发送消息，则通过 postMessage(message, “”) 来传递数据。两个参数代表的含义分别是：

* 第一个参数表示所要发送的消息文本，可以是任何 js对象（一般都通过 JSON 把对象转化成文本）；
* 第二个参数表示接收消息的对象窗口的url地址，通配符星号 指定全部地址。

不用通配符也可以指定具体的 url，那么在 onmessage 中加个来源判断
```javascript
if( event.origin !== ‘xxxx’ ) return;
```

示例: 模拟不同域间的通信，比如父页面中嵌了个 iframe 子页面，且父子是不同源的。
父页面给子页面发送消息，子页面接收
```javascript
// 父页面中：父向子发
document.getElementById('iframeId').contentWindow.postMessage('父向子发送的数据');
// 子页面中：子对消息监听，随时接收数据
window.addEventListener('message', function(event){
    console.log(event.data);
});
```
与之对应，如果子页面给父页面发消息的话，如下：

```javascript
// 父页面中：监听
window.addEventListener('message', function(event){
    console.log(event.data);
});
// 子页面中：子对父发消息
window.parent.postMessage('子向父发送的数据');
```

##### Server Sent Events
HTML5的服务器端发送事件（Server Sent Events）是由Opera 创建的，它实现了将Comet 技术规范化。这个标准通过JavaScript API EventSource 为应用提供了原生的实时更新支持。Event Source 可以连接到服务器端，通过HTTP 流异步推送数据到客户端。Server-Sent Events 在浏览器和服务器端之间建立一个单一、双向、持久的连接。

和WebSocket API 不同，Server-Sent Events 和EventSource 对象在应用里使用HTTP 实现服务端实时推送功能。

##### Web sockets
WebSocket的主要作用是，允许服务器端与客户端进行全双工（full-duplex）的通信

WebSocket不使用HTTP协议，而是使用自己的协议

```javascript
if(window.WebSocket != undefined) {
    var connection = new WebSocket('ws://localhost:1740');
}

/*
建立连接以后的WebSocket实例对象（即上面代码中的connection），有一个readyState属性，表示目前的状态，可以取4个值：
0： 正在连接
1： 连接成功
2： 正在关闭
3： 连接关闭

*/

// 握手协议成功以后，readyState就从0变为1，并触发open事件，这时就可以向服务器发送信息了
connection.onopen = wsOpen;

function wsOpen (event) {
    console.log('Connected to: ' + event.currentTarget.URL);
}

connection.onmessage = wsMessage;

// event对象的data属性包含了服务器返回的数据。
function wsMessage (event) {
    console.log(event.data);
}

//连接建立后，客户端通过send方法向服务器端发送数据。
connection.send(message);

// 如果出现错误，浏览器会触发WebSocket实例对象的error事件。
connection.onerror = wsError;

function wsError(event) {
    console.log("Error: " + event.data);
}

connection.onclose = wsClose;

function wsClose () {
    console.log("Closed");
}

connection.close();

```

[WebSocket](http://javascript.ruanyifeng.com/htmlapi/websocket.html)

[HTML5 web通信（跨文档通信/通道通信）简介](http://www.zhangxinxu.com/wordpress/2012/02/html5-web-messaging-cross-document-messaging-channel-messaging/)

[Chrome 远程调试协议分析与实战](http://fex.baidu.com/blog/2014/06/remote-debugging-protocol/)

## 缓存分类

缓存分为数据库缓存、服务端侧（server side，比如 Nginx、Apache）和客户端侧（client side，比如 web browser）。

很多应用往往关系比较复杂，数据库表繁多，如果频繁进行数据库查询，很容易导致数据库不堪重荷。为了提供查询的性能，会将查询后的数据放到内存中进行缓存，下次查询时，直接从内存缓存直接返回，提供响应效率。比如常用的缓存方案有memcached等

服务端缓存又分为 代理服务器缓存 和 反向代理服务器缓存，其实广泛使用的 CDN 也是一种服务端缓存，目的都是让用户的请求走”捷径“，并且都是缓存图片、文件等静态资源。

代理服务器是浏览器和源服务器之间的中间服务器，浏览器先向这个中间服务器发起Web请求，经过处理后（比如权限验证，缓存匹配等），再将请求转发到源服务器。代理服务器缓存的运作原理跟浏览器的运作原理差不多，只是规模更大。可以把它理解为一个共享缓存，不只为一个用户服务，一般为大量用户提供服务，因此在减少相应时间和带宽使用方面很有效，同一个副本会被重用多次。常见代理服务器缓存解决方案有Squid等

CDN（Content delivery networks）缓存，也叫网关缓存、反向代理缓存。CDN缓存一般是由网站管理员自己部署，为了让他们的网站更容易扩展并获得更好的性能。浏览器先向CDN网关发起Web请求，网关服务器后面对应着一台或多台负载均衡源服务器，会根据它们的负载请求，动态将请求转发到合适的源服务器上。虽然这种架构负载均衡源服务器之间的缓存没法共享，但却拥有更好的可扩展性。从浏览器角度来看，整个CDN就是一个源服务器

客户端侧缓存一般指的是浏览器缓存，目的就是加速各种静态资源的访问，想想现在的大型网站，随便一个页面都是一两百个请求，每天 pv 都是亿级别，如果没有缓存，用户体验会急剧下降、同时服务器压力和网络带宽都面临严重的考验。
<!--
### Browser Caches
If you examine the preferences dialog of any modern Web browser (like Internet Explorer, Safari or Mozilla), you’ll probably notice a “cache” setting. This lets you set aside a section of your computer’s hard disk to store representations(资源) that you’ve seen, just for you. The browser cache works according to fairly simple rules. It will check to make sure that the representations are fresh, usually once a session (that is, the once in the current invocation of the browser).

This cache is especially useful when users hit the “back” button or click a link to see a page they’ve just looked at. Also, if you use the same navigation images throughout your site, they’ll be served from browsers’ caches almost instantaneously.

### Proxy Caches
Web proxy caches work on the same principle, but a much larger scale. Proxies serve hundreds or thousands of users in the same way; large corporations and ISPs often set them up on their firewalls, or as standalone devices (also known as intermediaries).

Because proxy caches aren’t part of the client or the origin server, but instead are out on the network, requests have to be routed to them somehow. One way to do this is to use your browser’s proxy setting to manually tell it what proxy to use; another is using interception. Interception proxies have Web requests redirected to them by the underlying network itself, so that clients don’t need to be configured for them, or even know about them.

Proxy caches are a type of shared cache; rather than just having one person using them, they usually have a large number of users, and because of this they are very good at reducing latency and network traffic. That’s because popular representations are reused a number of times.

### Gateway Caches
Also known as “reverse proxy caches” or “surrogate caches,” gateway caches are also intermediaries, but instead of being deployed by network administrators to save bandwidth, they’re typically deployed by Webmasters themselves, to make their sites more scalable, reliable and better performing.

Requests can be routed to gateway caches by a number of methods, but typically some form of load balancer is used to make one or more of them look like the origin server to clients.

Content delivery networks (CDNs) distribute gateway caches throughout the Internet (or a part of it) and sell caching to interested Web sites. Speedera and Akamai are examples of CDNs.

-->
## 浏览器缓存机制详解

浏览器缓存控制机制有两种：HTML Meta标签 vs. HTTP头信息

### HTML Meta标签控制缓存

浏览器缓存机制，其实主要就是HTTP协议定义的缓存机制（如： Expires； Cache-control等）。但是也有非HTTP协议定义的缓存机制，如使用HTML Meta 标签，Web开发者可以在HTML页面的<head>节点中加入<meta>标签，代码如下：

```html
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
```

上述代码的作用是告诉浏览器当前页面不被缓存，每次访问都需要去服务器拉取。使用上很简单，但只有部分浏览器可以支持，而且所有缓存代理服务器都不支持，因为代理不解析HTML内容本身。而广泛应用的还是 HTTP头信息.

Many people believe that assigning a Pragma: no-cache HTTP header to a representation will make it uncacheable. This is not necessarily true; the HTTP specification does not set any guidelines for Pragma response headers; instead, Pragma request headers (the headers that a browser sends to a server) are discussed. Although a few caches may honor this header, the majority won’t, and it won’t have any effect. Use the headers below instead.

### http头信息控制缓存

浏览器有一套自己的缓存机制，而在这个机制的基础上缓存规则的制定则主要依靠后端来实现。

#### 什么是缓存

> A web cache is a mechanism for the temporary storage (caching) of web documents, such as HTML pages and images, to reduce bandwidth usage, server load, and perceived lag.

意思是： 

> WEB缓存就是临时存储WEB文档，例如HTML页面、图片等降低带宽使用、服务器负载、提升响应速度的一种机制。

#### How Web Caches Work

All caches have a set of rules that they use to determine when to serve a representation from the cache, if it’s available. Some of these rules are set in the protocols (HTTP 1.0 and 1.1), and some are set by the administrator of the cache (either the user of the browser cache, or the proxy administrator, or the DBA).

Generally speaking, these are the most common rules that are followed
<!-- 对于浏览器端的缓存来讲，这些规则是在HTTP协议头和HTML页面的Meta标签中定义的。他们分别从新鲜度和校验值两个维度来规定浏览器是否可以直接使用缓存中的副本，还是需要去源服务器获取更新的版本。 -->
1. If the response’s headers tell the cache not to keep it, it won’t.
2. If the request is authenticated or secure (i.e., HTTPS), it won’t be cached.
3. A cached representation is considered fresh (that is, able to be sent to a client without checking with the origin server) if:
    * It has an expiry time or other age-controlling header set, and is still within the fresh period, or。(Expires是Web服务器响应消息头字段，在响应http请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据，而无需再次请求。)
    * If the cache has seen the representation recently, and it was modified relatively long ago.
    Fresh representations are served directly from the cache, without checking with the origin server.
4. If a representation is stale, the origin server will be asked to validate it, or tell the cache whether the copy that it has is still good.
5. Under certain circumstances — for example, when it’s disconnected from a network — a cache can serve stale responses without checking with the origin server.

<!-- 
新鲜度（过期机制）：也就是缓存副本有效期。一个缓存副本必须满足以下条件，浏览器会认为它是有效的，足够新的：
含有完整的过期时间控制头信息（HTTP协议报头），并且仍在有效期内；
浏览器已经使用过这个缓存副本，并且在一个会话中已经检查过新鲜度；
满足以上两个情况的一种，浏览器会直接从缓存中获取副本并渲染。

校验值（验证机制）：服务器返回资源的时候有时在控制头信息带上这个资源的实体标签Etag（Entity Tag），它可以用来作为浏览器再次请求过程的校验标识。如过发现校验标识不匹配，说明资源已经被修改或过期，浏览器需要重新获取资源内容。
-->
一个URI的完整HTTP协议交互过程是由HTTP请求和HTTP响应组成的。有关HTTP详细内容可参考
《[Hypertext Transfer Protocol — HTTP/1.1](http://www.w3.org/Protocols/rfc2616/rfc2616.html)》

《[HTTP协议详解](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html)》

If no validator (an ETag or Last-Modified header) is present on a response, and it doesn't have any explicit freshness information, it will usually — but not always — be considered uncacheable.

Together, freshness and validation are the most important ways that a cache works with content. A fresh representation will be available instantly from the cache, while a validated representation will avoid sending the entire representation over again if it hasn’t changed.

we said that validation is used by servers and caches to communicate when a representation has changed. By using it, caches avoid having to download the entire representation when they already have a copy locally, but they’re not sure if it’s still fresh.

Validators are very important; if one isn’t present, and there isn’t any freshness information (Expires or Cache-Control) available, caches will not store a representation at all.

The most common validator is the time that the document last changed, as communicated in Last-Modified header. When a cache has a representation stored that includes a Last-Modified header, it can use it to ask the server if the representation has changed since the last time it was seen, with an If-Modified-Since request.

HTTP 1.1 introduced a new kind of validator called the ETag. ETags are unique identifiers that are generated by the server and changed every time the representation does. Because the server controls how the ETag is generated, caches can be sure that if the ETag matches when they make a If-None-Match request, the representation really is the same.

Almost all caches use Last-Modified times as validators; ETag validation is also becoming prevalent.

Most modern Web servers will generate both ETag and Last-Modified headers to use as validators for static content (i.e., files) automatically; you won’t have to do anything. However, they don’t know enough about dynamic content (like CGI, ASP or database sites) to generate them;


HTTP headers give you a lot of control over how both browser caches and proxies handle your representations.They can’t be seen in the HTML, and are usually automatically generated by the Web server. However, you can control them to some degree, depending on the server you use.

HTTP headers are sent by the server before the HTML, and only seen by the browser and any intermediate caches. Typical HTTP 1.1 response headers might look like this:

```
    HTTP/1.1 200 OK
    Date: Fri, 30 Oct 1998 13:19:41 GMT 
    Server: Apache/1.3.3 (Unix)
    Cache-Control: max-age=3600, must-revalidate
    Expires: Fri, 30 Oct 1998 14:19:41 GMT
    Last-Modified: Mon, 29 Jun 1998 02:28:12 GMT
    ETag: "3e86-410-3596fbbc"
    Content-Length: 1040
    Content-Type: text/html
```
***注：Date头域表示消息发送的时间，时间的描述格式由rfc822定义。例如，Date: Mon,31 Dec 2001 04:25:57GMT。***

当Cache-Control/Expires与Last-Modified/ETag一起使用时，Cache-Control/Expires的优先级要高于Last-Modified/ETag。即当本地副本根据Cache-Control/Expires发现还在有效期内时，则不会再次发送请求去服务器询问修改时间（Last-Modified）或实体标识（Etag）了。

一般情况下，使用Cache-Control/Expires会配合Last-Modified/ETag一起使用，因为即使服务器设置缓存时间, 当用户点击“刷新”按钮时，浏览器会忽略缓存继续向服务器发送请求，这时Last-Modified/ETag将能够很好利用304，从而减少响应开销。

* Last-Modified：标示这个响应资源的最后修改时间。web服务器在响应请求时，告诉浏览器资源的最后修改时间。
* If-Modified-Since：当资源过期时，发现资源具有Last-Modified声明，则再次向web服务器请求时带上头 If-Modified-Since(其值是第一次响应头返回的Last-Modified字段)。web服务器收到请求后发现有头If-Modified-Since 则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源又被改动过，则响应整片资源内容（写在响应消息包体内），HTTP 200；若最后修改时间较旧，说明资源无新修改，则响应HTTP 304 (无需包体，节省浏览)，告知浏览器继续使用所保存的cache。

* Etag：web服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识。
* If-None-Match：当资源过期时（使用Cache-Control标识的max-age），发现资源具有Etage声明，则再次向web服务器请求时带上头If-None-Match （Etag的值）。web服务器收到请求后发现有头If-None-Match 则与被请求资源的相应校验串进行比对，决定返回200或304。

Useful Cache-Control response headers include:

* max-age=[seconds] — specifies the maximum amount of time that a representation will be considered fresh. Similar to Expires, this directive is relative to the time of the request, rather than absolute. [seconds] is the number of seconds from the time of the request you wish the representation to be fresh for.
* s-maxage=[seconds] — similar to max-age, except that it only applies to shared (e.g., proxy) caches.
* public — marks authenticated responses as cacheable; normally, if HTTP authentication is required, responses are automatically private.(简而言之就是指示响应可以被任何缓存区缓存)
* private — allows caches that are specific to one user (e.g., in a browser) to store the response; shared caches (e.g., in a proxy) may not.
* no-cache — forces caches to submit the request to the origin server for validation before releasing a cached copy, every time. This is useful to assure that authentication is respected (in combination with public), or to maintain rigid freshness, without sacrificing all of the benefits of caching.
* no-store — instructs caches not to keep a copy of the representation under any conditions.
* must-revalidate — tells caches that they must obey any freshness information you give them about a representation. HTTP allows caches to serve stale representations under special conditions; by specifying this header, you’re telling the cache that you want it to strictly follow your rules.
* proxy-revalidate — similar to must-revalidate, except that it only applies to proxy caches.

For example:
```
Cache-Control: max-age=3600, must-revalidate
```
**When both Cache-Control and Expires are present, Cache-Control takes precedence.**

### 既生Last-Modified何生Etag？

你可能会觉得使用Last-Modified已经足以让浏览器知道本地的缓存副本是否足够新，为什么还需要Etag（实体标识）呢？HTTP1.1中Etag的出现主要是为了解决几个Last-Modified比较难解决的问题：

* Last-Modified标注的最后修改只能精确到秒级，如果某些文件在1秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间
* 如果某些文件会被定期生成，但有时内容并没有任何变化，但Last-Modified却改变了，导致文件没法使用缓存
* 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形

Etag是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。Last-Modified与ETag是可以一起使用的，服务器会优先验证ETag，一致的情况下，才会继续比对Last-Modified，最后才决定是否返回304。

浏览器第一次请求流程图：
![浏览器第一次请求流程图](../images/httpCacheStep.png)

浏览器再次请求流程:
![浏览器再次请求流程](../images/anotherHttpCacheStep.png)

![http响应几种状态码的区别](../images/httpstatusdescription.jpg)


## 用户行为与缓存

浏览器缓存行为还与用户行为有关

<pre>
    用户操作       Expires/Cache-Control Last-Modified/Etag

    地址栏回车               有效           有效
    页面链接跳转             有效           有效
    新开窗口                 有效           有效
    前进、后退               有效           有效
    F5刷新                   无效           有效
    ctrl+F5刷新              无效           无效
</pre>

通过上表我们可以看到，当用户在按F5进行刷新的时候，会忽略Expires/Cache-Control的设置，会再次发送请求去服务器请求，而Last-Modified/Etag还是有效的，服务器会根据情况判断返回304还是200；而当用户使用Ctrl+F5进行强制刷新的时候，只是所有的缓存机制都将失效，重新从服务器拉去资源。

更详细的信息可以参考:

[What requests do browsers' “F5” and “Ctrl + F5” refreshes generate?](http://stackoverflow.com/questions/385367/what-requests-do-browsers-f5-and-ctrl-f5-refreshes-generate)

[Behind Refresh Button](http://podlipensky.com/2012/03/behind-refresh-button/)

### 如何有效控制缓存？

当通过地址栏跳转到一个已经访问过的页面时，如果在之前设置的缓存有效期之内浏览器将不会与服务器进行任何协商直接读取本地缓存内容作为响应内容，那即使我更新了一段css代码，那么老访客看到的可能还是从本地读取的老旧的样式表文件，那怎么样才能让我更新的内容强制让客户端与服务器进行对话确认呢？简单：最常见的办法是在文件路径后面添加指定版本号，例如：

```html
    <link rel="stylesheet" href="http://example.com/themes/boldframe/style.css?v=2014-06-07">
```
每次对文件的修改都要更新版本号，通过这种方式强制让浏览器与服务器进行对话，解决缓存的负面问题。

### I understand that caching is good, but I need to keep statistics on how many people visit my page!

If you must know every time a page is accessed, select ONE small item on a page (or the page itself), and make it uncacheable, by giving it a suitable headers. For example, you could refer to a 1x1 transparent uncacheable image from each page. The Referer header will contain information about what page called it.

Be aware that even this will not give truly accurate statistics about your users, and is unfriendly to the Internet and your users; it generates unnecessary traffic, and forces people to wait for that uncached item to be downloaded.

### My pages are password-protected; how do proxy caches deal with them?

By default, pages protected with HTTP authentication are considered private; they will not be kept by shared caches. However, you can make authenticated pages public with a Cache-Control: public header; HTTP 1.1-compliant caches will then allow them to be cached.

If you’d like such pages to be cacheable, but still authenticated for every user, combine the Cache-Control: public and no-cache headers. This tells the cache that it must submit the new client’s authentication information to the origin server before releasing the representation from the cache. This would look like:

```
    Cache-Control: public, no-cache
```
Whether or not this is done, it’s best to minimize use of authentication; for example, if your images are not sensitive, put them in a separate directory and configure your server not to force authentication for it. That way, those images will be naturally cacheable.

### 无法被缓存的请求：

* HTTP信息头中包含Cache-Control:no-cache，pragma:no-cache，或Cache-Control:max-age=0等告诉浏览器不用缓存的请求
* 需要根据Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
* 经过HTTPS安全加密的请求（有人也经过测试发现，ie其实在头部加入Cache-Control：max-age信息，firefox在头部加入Cache-Control:Public之后，能够对HTTPS的资源进行缓存，参考《[HTTPS的七个误解](http://www.ruanyifeng.com/blog/2011/02/seven_myths_about_https.html)》）
POST请求无法被缓存
* HTTP响应头中不包含Last-Modified/Etag，也不包含Cache-Control/Expires的请求无法被缓存

### 如何构建可缓存站点

#### 同一个资源保证URL的稳定性
URL是浏览器缓存机制的基础，所以如果一个资源需要在多个地方被引用，尽量保证URL是固定的。同时，比较推荐使用公共类库，比如Google Ajax Library等，有利于最大限度使用缓存

#### 给Css、js、图片等资源增加HTTP缓存头，并强制入口Html不被缓存
对于不经常修改的静态资源，比如Css，js，图片等，可以设置一个较长的过期的时间，或者至少加上Last-Modified/Etag，而对于html页面这种入口文件，不建议设置缓存。这样既能保证在静态资源不变的情况下，可以不重发请求或直接通过304避免重复下载，又能保证在资源有更新时，只要通过给资源增加时间戳或者更换路径，就能让用户访问最新的资源

#### 减少对Cookie的依赖
过多的使用Cookie会大大增加HTTP请求的负担，每次GET或POST请求，都会把Cookie都带上，增加网络传输流量，导致增长交互时间；同时cookie是很难被缓存的，应该尽量少使用，或者在动态页面上使用。

#### 减少对HTTPS加密协议的使用
通过HTTPS请求的资源，默认是不会被缓存的，必须通过特殊的配置，才能让资源得到缓存。建议只对涉及敏感信息的请求使用HTTPS传输，其他类似Css，Js，图片这些静态资源，尽量避免使用。

#### 多用Get方式请求动态Cgi
虽然POST的请求方式比Get更安全，可以避免类似密码这种敏感信息在网络传输，被代理或其他人截获，但是Get请求方式更快，效率更高，而且能被缓存，建议对于那些不涉及敏感信息提交的请求尽量使用Get方式请求

#### 动态CGI也是可以被缓存
如果动态脚本或CGI输入的内容在一定的时间范围内是固定的，或者根据GET参数相同，输入的内容相同，我们也认为请求是可以被缓存的，有以下几种方式，可以达到这个效果：

1. 让动态脚本定期将内容改变时导出成静态文件，Web直接访问带有Last-Modified/Etag的静态文件
2. 开发者可以通过代码给动态脚本的响应头中添加Cache-Control: max-age，告诉浏览器在过期前可以直接使用副本
3. 通过代码给动态脚本的响应头添加Last-Modified/Etag信息，浏览器再次请求的时候，可以通过解析If-Modified-Since/If-None-Match得知浏览器是否存在缓存，由代码逻辑控制是否返回304

### 参考链接

[浏览器缓存机制](http://www.laruence.com/2010/03/05/1332.html)

[HTTP 304客户端缓存优化的神奇作用和用法](http://spyrise.org/blog/http-304-not-modified-header-setting-optimize/)

[Caching Tutorial for Web Authors and Webmasters](https://www.mnot.net/cache_docs/)

[HTTP Cache](http://symfony.com/doc/current/book/http_cache.html)

[HTTP 缓存](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)

[Increasing Application Performance with HTTP Cache Headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers)

[web缓存机制系列](http://www.alloyteam.com/2013/12/web-cache-6-hybrid-app-tailored-cache/)

[html5离线应用无法更新的定位与解决](http://www.alloyteam.com/2012/01/html5-offline-app-update-problem/)