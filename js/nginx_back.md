## 缓存代码片段

```
location / {  
	root /home/html/;  
	proxy_store on;  
	proxy_set_header Accept-Encoding '';  
	proxy_temp_path /home/tmp;  
	if ( !-f $request_filename ) {  
		proxy_pass http://www.sudone.com/;  
	}  
} 
```


## 待解决问题
1. nginx的启动和停止守护进程 [启动和停止守护进程](http://book.51cto.com/art/201204/327661.htm)  [初始fork和nginx守护进程ngx_daemon](http://blog.csdn.net/xiaoliangsky/article/details/39998373) [ daemontools](http://linbo.github.io/2013/02/24/daemontools/) [Linux Nginx服务守护监控](http://blog.csdn.net/love__coder/article/details/7222746) []()


2. nginx 负载均衡 [nginx做负载均衡器以及proxy缓存配置](http://seanlook.com/2015/06/02/nginx-cache-check/) [Nginx 与Tomcat 实现动静态分离、负载均衡](http://blog.csdn.net/congcong68/article/details/41846945)

3. nginx 缓存功能  [基于nginx实现缓存功能及uptream模块详细使用方法](http://yijiu.blog.51cto.com/433846/1409177) [利用proxy_store实现高效的静态文件分布缓存服务器](http://www.programgo.com/article/40761268458/)

## nginx低权限账户配置

nginx

1、修改文件属性
使用chown命令可以修改文件或目录所属的用户：
       命令：chown 用户 目录或文件名
       例如：chown qq /home/qq  (把home目录下的qq目录的拥有者改为qq用户) 

使用chgrp命令可以修改文件或目录所属的组：
       命令：chgrp 组 目录或文件名
       例如：chgrp qq /home/qq  (把home目录下的qq目录的所属组改为qq组)
将网页文件改为所属用户可写可读，同组用户、其它用户只读，将临时文件夹设为所有用户可写可读。
注意目录的可运行权限，否则其它用户访问不了该目录。

2、修改Nginx配置文件


Ubuntu下默认为/etc/nginx，配置文件为nginx.conf，我的在/usr/local/nginx
一般服务器管理员均会转移Nginx的默认安装位置等配置。
打开配置文件。
[plain] view plaincopy
vi nginx.conf  

参考我的另一篇文章：
《Nginx配置文件详细说明》   http://blog.csdn.net/rk2900/article/details/8275762
将user修改为你需要运行的账户


OK

3、平滑重启
键入命令实现平滑重启，防止对服务器上现有网站的影响。
[plain] view plaincopy
/usr/nginx/sbin/nginx -s reload  


## nginx设置代理时加后缀“/” 总是报错：

[nginx变量总结](http://blog.csdn.net/yankai0219/article/details/8070790)

[nginx 并发数问题思考：worker_connections,worker_processes与 max clients](http://www.tuicool.com/articles/2yUzem7)

[关于Nginx的一些优化(突破十万并发)](http://blog.csdn.net/moxiaomomo/article/details/19442737)


了解下set的作用
