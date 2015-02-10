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
![浏览器第一次请求流程图](./httpCacheStep.png)

浏览器再次请求流程:
![浏览器再次请求流程](./anotherHttpCacheStep.png)

![http响应几种状态码的区别](./httpstatusdescription.jpg)


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

更详细的信息可以参考
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