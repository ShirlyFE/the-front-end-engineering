# curl
curl是一种命令行工具，作用是发出网络请求，然后得到和提取数据，显示在"标准输出"（stdout）上面，支持多种工具

## 基本指令
### 基本用法（配合sed/awk/grep）
```
$curl www.baidu.com
```

### 用-o/--output参数进行下载保存，相当于wget命令
```
$curl http://bpsky.net > index.html

$curl -o index.html http://bpsky.net

# 大写的-O是自动按服务器上的名字来保存文件到本地
$curl -O http://bpsky.net/target.tar.gz
```

### 自动跳转
```php
#有的网址是自动跳转的。使用-L参数，curl就会跳转到新的网址
curl -L www.sina.com
```

### -i参数显示http response头信息
```
# -I参数只显示http response的头信息
curl -i www.sina.com
```

### -v参数可以显示一次http通信的整个过程，包括端口连接和http request头信息
```
$ curl -v http://localhost
* Adding handle: conn: 0x8b2cd8
* Adding handle: send: 0
* Adding handle: recv: 0
* Curl_addHandleToPipeline: length: 1
* - Conn 0 (0x8b2cd8) send_pipe: 1, recv_pipe: 0
* About to connect() to localhost port 80 (#0)
*   Trying ::1...
* Connection refused
*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 80 (#0)
> GET / HTTP/1.1
> User-Agent: curl/7.30.0
> Host: localhost
> Accept: */*
>
< HTTP/1.1 302 Moved Temporarily
< X-Powered-By: Express
< Location: /user/login
< Vary: Accept
< Content-Type: text/plain; charset=utf-8
< Content-Length: 45
< set-cookie: connect.sid=s%3AeE73m2VVBBhVOU0S0bJmyYNNQU6VCA1Q.fjN8lyim7dccUTF9k
qqLCbzNj0m2IkaL%2Fb%2Ba%2B%2Fe9I%2BE; Path=/; HttpOnly
< Date: Mon, 25 May 2015 10:44:11 GMT
< Connection: keep-alive
<
Moved Temporarily. Redirecting to /user/login* Connection #0 to host localhost l
eft intact
```

### 也可以通过下面查看更详细的通信过程
```
curl --trace output.txt www.sina.com
curl --trace-ascii output.txt www.sina.com
# 运行后打开output.txt文件查看
```

### http默认是get请求，使用-X参数支持http其他请求方式
```
curl -X POST www.example.com

curl -X DELETE www.example.com
```

### --header参数增加头信息
```
curl --header "Content-Type:application/json" http://example.com
```

### -x/--proxy <proxyhost[:host]>指定代理及端口，不指定默认为1080
```
$curl -x  123.45.67.89:1080  -o page.html http://bpsky.net
```

### 使用cookie
```
curl --cookie "name=xxx" www.example.com
```

### -D cookies保存cookie在本地
```
# baidu.txt是保存cookie的文件，baidu.html保存请求的百度主页数据
curl www.baidu.com -o baidu.html -D baidu.txt
```

### user agent字段模仿浏览器
这个字段是用来表示客户端的设备信息。服务器有时会根据这个字段，针对不同设备，返回不同格式的网页，比如手机版和桌面版。
```
curl --user-agent "[User Agent]" [URL]

$curl -A  "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)"  [URL]
```

### -e/--referer伪造referer
有时你需要在http request头信息中，提供一个referer字段，表示你是从哪里跳转过来的。

```
curl --referer http://www.example.com http://www.example.com
```

### 批量下载
```
$curl -O http://cgi2.tky.3web.ne.jp/~zzh/screen[1-10].JPG

$curl -O http://cgi2.tky.3web.ne.jp/~{zzh,nick}/[001-201].JPG  
# 上面请求产生的下载就是: ~zzh/001.JPG ~zzh/002.JPG ... ~nick/201.JPG
```

### 自定义文件名的下载
```
$curl -o #2_#1.jpg http://cgi2.tky.3web.ne.jp/~{zzh,nick}/[001-201].JPG 
#上面的命令下载后就是这样的： 001_zzh.jpg
```

### -C/--continue-at <offset>断点续传
```php
# 如果指定offset，则从offset的位置开始续传。如果未指定offset，或者直接用"-C -"，则curl会自己分析该从什么位置开始续传
$curl -c -O http://cgi2.tky.3wb.ne.jp/~zzh/screen1.JPG  
```

### -r/--range <range>分块下载
该选项指定下载字节的范围，常应用于分块下载文件。

range的表示方式有多种，如:
* 100-500，则指定从100开始的400个字节数据；

* -500表示最后的500个字节；

* 5000-表示从第5000个字节开始的所有字节；

* 另外还可以同时指定多个字节块，中间用","分开

```
$curl -r 0-10240 -o "zhao.part1" http://vfile.home.news.cn/music/public/vd05/200905/31/a8/MUfs052009053117155750a8be70.mp3  &\  

$curl -r 10241-20480 -o "zhao.part2" http://vfile.home.news.cn/music/public/vd05/200905/31/a8/MUfs052009053117155750a8be70.mp3  &\  

$curl -r 20481-40960 -o "zhao.part3" http://vfile.home.news.cn/music/public/vd05/200905/31/a8/MUfs052009053117155750a8be70.mp3  &\  

$curl -r 40961- -o "zhao.part4" http://vfile.home.news.cn/music/public/vd05/200905/31/a8/MUfs052009053117155750a8be70.mp3   

# 这样就会将目标mp3文件分块下载为3个文件,然后合并
$cat zhao.part* > zhao.mp3
```

### GET 上传（发送表单信息）
```
$curl http://www.yahoo.com/login.cgi?user=nickwolfe&password=12345   
```

### POST 上传
```php
# --data参数post数据
$curl -d "user=nickwolfe&password=12345" http://www.yahoo.com/login.cgi 
# 如果数据没有经过表单编码，还可以让curl为你编码，参数是--data-urlencode。
curl --data-urlencode "date=April 1" example.com/form.cgi
```

### POST 文件上传

假如文件上传的表单是下面这样
```html
<form method="POST" enctype='multipart/form-data' action="upload.cgi">
    <input type=file name=upload>
　　<input type=submit name=press value="OK">
</form>
```
用下面curl上传文件

```
curl --form upload=@localfilename --form press=OK [URL]

$curl -F upload=@localfilename  -F press=OK [URL]
```

### -T/--upload-file <file>  上传命令
该选项是上传命令，如向http服务器上传一个文件：
```
curl -T D:\new_divide.mp3 http://www.uploadserver.com/path/
```
向一个ftp服务器上传文件：
```
curl -T D:\new_divide.mp3 -u user:password ftp://upload_site:port/path/
```

## 资源

[linux curl](http://www.blogjava.net/nkjava/archive/2012/09/17/387851.html)

[linux curl 命令详解，以及实例](http://blog.51yip.com/linux/1049.html)

[Curl学习笔记](http://zhongfox.github.io/blog/linux/2013/07/05/curl-note/)

[Linux Shell脚本编程－－curl命令详解](http://blog.csdn.net/xifeijian/article/details/9367339)

[curl命令详解](http://www.cnblogs.com/mycats/p/3935757.html)

[curl网站开发指南](http://www.ruanyifeng.com/blog/2011/09/curl.html)
