ubuntu下安装node.js
一、Git安装：

  1、 二进制方式安装：

        $ sudo apt-get install git-core

安装完成后，在终端中输入 git 就可以看到相关的命令了。如果只是需要使用git来管理本地的代码，那么现在就可以

使用了。如果需要和github上的项目结合，还需要做其他的一些操作。


 2、github帐号的申请
        如果只是需要将github上感兴趣的代码拷贝到本地，自己进行修改使用，而不打算共享发布的话，其实不申请

帐号也没有关系，只需要 git clone 代码到本地就可以了。 $ git clone git:// IP work（工作目录名）。毕竟使用

github 就是为了开源的目的，首先去 github.com 上注册一个帐号。


   3、在本地建立一个文件夹，然后做一些全局变量的初始化

        $ git config --global user.name = "用户名或者用户ID"

        $ git config --global user.email = 邮箱

        这两个选项会在以后的使用过程中自动添加到代码中。


    4、创建验证用的公钥
          这个是比较复杂和困扰大多数人的地方，因为 git 是通过 ssh 的方式访问资源库的，所以需要在本地创建验证

用的文件。使用命令：$ ssh-keygen （需要填写ssh key存放的文件）建立相应

的密钥文件.可以使用 $ ssh -v git@github.com 命令来测试链接是否畅通。


    5、上传公钥
        在 github.com 的界面中 选择右上角的 Account Settings，然后选择 SSH Public Keys ，选择新加。 Title 可

  以随便命名，Key 的内容拷贝自 ~/.ssh/id_rsa.pub 中的内容，完成后，可以再使用 ssh -v  git@github.com 进行

测试。看到下面的信息表示验证成功。


安装node从此处开始

备一些包
sudo apt-get install g++ curl libssl-dev apache2-utils

git是不可少的
sudo apt-get install git-core

用git下载node.js最新版
git clone https://github.com/joyent/node.git

或者再添加了公钥之后使用：git clone git@github.com:joyent/node.git

或者直接下载源码
wget http://nodejs.org/dist/node-v0.8.2.tar.gz
gunzip node-v0.8.2.tar.gz
tar -xf node-v0.8.2

开始编译安装node.js
cd node(进入下载下来的node目录)
./configure
make
sudo make install

输入node –v 或者node –version可以查看node.js当前的版本

运行第一个node.js的程序
在主文件夹中创建example.js，编辑文本

或者终端输入 

gedit example.js
var http = require('http');
  http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node.js');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');

编写程序


在命令行中
Node example.js

浏览器中浏览，浏览器中出现hello node.js

 

二 更加详细的版本

   http://www.lzlu.com/blog/?p=792

 

三 在安装nmp出现的问题：

When I do:

root@ubuntu:~# curl http://npmjs.org/install.sh | sh

I get:

% Total % Received % Xferd Average Speed Time Time Time Current
Dload Upload Total Spent Left Speed
100 85 0 85 0 0 133 0 --:--:-- --:--:-- --:--:-- 393
sh: 2: Syntax error: newline unexpected

 

解决办法是：

Use https instead of http in the URL. The error you're seeing is because your download is an HTML page telling you that.


安装testem
npm install testem -g
安装成功后输入：testem，将会看到
TEST'EM' 'SCRIPTS!'
open the URL below in a browser to connect
http://localhost:7357
说明安装成功了


ubuntu下安装phantomJs
以下方法是通过源码编译的方式安装，但是时间超长，而且成功的几率还很低，所以最好下载二进制包进行安装
sudo apt-get update
sudo apt-get install build-essential chrpath git-core libssl-dev libfontconfig1-dev
git clone git://github.com/ariya/phantomjs.git
cd phantomjs
git checkout 1.9
./build.sh
注意：
build.sh by default will launch parallel compile jobs depending on the available CPU cores, e.g. 4 jobs on a modern hyperthreaded dual-core processor. If necessary, e.g. when building on a virtual machine/server or other limited environment, reduce the jobs by passing a number, e.g ./build.sh --jobs 1 to set only one compile job at a time.

构建过程的官方原文见：phantomjs.ort/build.html

二进制包的安装过程

根据系统结构选择合适的二进制安装包：

    x86: http://phantomjs.googlecode.com/files/phantomjs-1.5.0-linux-x86-dynamic.tar.gz
    x86_64: http://phantomjs.googlecode.com/files/phantomjs-1.5.0-linux-x86_64-dynamic.tar.gz

获取安装包并解压：

mkdir ~/bin/
cd ~/bin/
wget http://phantomjs.googlecode.com/files/phantomjs-1.5.0-linux-x86-dynamic.tar.gz
tar xzf phantomjs-1.5.0-linux-x86-dynamic.tar.gz

将可执行文件放入系统路径：

sudo ln -s ~/bin/phantomjs/bin/phantomjs /usr/local/bin/phantomjs

安装依赖——fontconfig和freetype

sudo pacman -S fontconfig freetype2

在终端下测试Phantomjs。你应该会看到如下输出：

[charles@foo] $ phantomjs
phantomjs>


PhantomJS文档：http://javascript.ruanyifeng.com/tool/phantomjs.html
