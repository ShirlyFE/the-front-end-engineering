# SSI(server side include)

SSI被称为“服务器端包含”或“服务器端嵌入”技术。是一种基于服务器端的网页制作技术。

## SSI语法

> <!--# command parameter1=value parameter2=value... -->

### block
描述一个可以在include命令中使用的块，在块中可以存在SSI命令，name是块的名称

```
<!--# block name="one" -->
  the silencer
<!--# endblock ---->
```

Basic SSI directives Syntax

```
<!--#element attribute=value attribute=value ... -->
```

### config
修改SSI的默认设置

* errmsg - 设置默认的错误信息，该指令必须在其他指令的前面，默认字符串为：[an error occurred while processing the directive]。

```
<!--#config errmsg="error!please email mamager!"-->
```
* sizefmt - 设置文件大小的单位，如bytes。该指令需放在fsize指令前使用

```
<!--#config sizefmt="bytes"-->
<!--#fsize file="head.html"-->
```

* timefmt - 设置日期与时间的显示格式，需放在echo指令前，默认为：

```
"%A, %d-%b-%Y %H:%M:%S %Z"
```

示例

```
<!--#config timefmt="%A, %B %d, %Y"-->
<!--#echo var="last_modified"-->
```

### echo
用于显示各种服务器变量

* var - 变量的名称
* default - 如果变量为空，则显示这个字符串，默认为none，如：

```
<!--# echo var="name" default="no" -->  
```
常见的服务器变量：

* **DOCUMENT_NAME**：显示当前文档的名称
* **DOCUMENT_URI**：显示当前文档的虚拟路径
* **QUERY_STRING_UNESCAPED**：显示未经转义处理的由客户端发送的查询字串，其中所有的特殊字符前面都有转义符"\
* **DATE_LOCAL**：显示服务器设定时区的日期和时间。用户可以结合config命令的timefmt参数，定制输出信息
* **DATE_GMT**：功能与DATE_LOCAL一样，只不过返回的是以格林尼治标准时间为基准的日期
* **LAST_MODIFIED**：显示当前文档的最后更新时间

echo命令还可以显示以下CGI环境变量:

* **SERVER_SOFTWARE**：显示服务器软件的名称和版本
* **SERVER_NAME**：显示服务器的主机名称，DNS别名或IP地址
* **SERVER_PROTOCOL**：显示客户端请求所使用的协议名称和版本，如HTTP/1.0
* **SERVER_PORT**：显示服务器的响应端口
* **REQUEST_METHOD**：显示客户端的文档请求方法，包括GET, HEAD, 和POST
* **REMOTE_HOST**：显示发出请求信息的客户端主机名称
* **REMOTE_ADDR**：显示发出请求信息的客户端IP地址
* **AUTH_TYPE**：显示用户身份的验证方法
* **REMOTE_USER**: 显示访问受保护页面的用户所使用的帐号名称


示例
```
<!--#config timefmt="%A,the %d of %B,in the year %Y"-->
<!--#echo var="DATE_LOCAL"-->
```

输出结果
```
Saturday, the 15 of April, in the year 2000
```

Today's date

```
<!--#config timefmt="%Y/%m/%d %a %H:%M:%S" -->
Today is <!--#echo var="DATE_LOCAL" -->
```

Modification date of the file

```
This document last modified <!--#flastmod file="index.html" -->
```

### include
包含一个其他来源的记录

* file - 包含一个文件
* virtual - 包含一个请求
* stub - 如果请求为空或返回一个错误后使用的默认块
* wait - 当设置为yes时，在当前的请求未完成之前剩余的SSI不会进行判定
#### Including the results of a CGI program

```
<!--#include virtual="/cgi-bin/counter.pl" -->
<!--#include virtual="/cgi-bin/example.cgi?argument=value" -->
```

You can use "#exec cgi=" directive, but it can be disabled using the IncludesNOEXEC Option.

#### Including a standard footer

```
<!--#include virtual="/footer.html" -->
```
stub
```
<!--# block name="one" --> <!--# endblock -->
<!--# include virtual="/remote/body.php?argument=value" stub="one" -->
```
wait
```
<!--# include virtual="/remote/body.php?argument=value" wait="yes" -->
```
### Executing commands

* cmd - 使用/bin/sh执行指定的字串。如果SSI使用了IncludesNOEXEC选项，则该命令将被屏蔽

* cgi - 可以用来执行CGI脚本 

```
<!--#exec cmd="ls" -->
```

This feature is dangerous. You can allow SSI, but not the exec feature, with the IncludesNOEXEC argument to the Options directive.

### Setting variables
设置一个变量
* var - 变量
* value - 变量值

```
<!--#set var="modified" value="$LAST_MODIFIED" -->
<!--#set var="date" value="${DATE_LOCAL}_${DATE_GMT}" -->
```

### Conditional expressions(if/elif/else/endif)

expr - 判断一个表达式，可以是变量

```
<!--#if expr="test_condition" -->
<!--#elif expr="test_condition" -->
<!--#else -->
<!--#endif -->
```

比较字符串：

```
  <!--# if expr="$name = text" -->
  <!--# if expr="$name != text" -->

```
或者匹配正则：

```
  <!--# if expr="$name = /text/" -->
  <!--# if expr="$name != /text/" -->
```

如果使用变量，则用他们的值代替。

### Fsize
显示指定文件的大小，可以结合config命令的sizefmt参数定制输出格式

* file - 指定文件
```
<!--#fsize file="index_working.html"-->
```

### Flastmod
显示指定文件的最后修改日期，可以结合config 命令的timefmt参数控制输出格式

```
<!--#config timefmt="%A, the %d of %B, in the year %Y"-->
<!--#flastmod file="file.html"-->
```

## 参考资源：
[nginx ssi api](http://nginx.org/ru/docs/http/ngx_http_ssi_module.html)

[ssi in one page](http://www.ssi.su/)