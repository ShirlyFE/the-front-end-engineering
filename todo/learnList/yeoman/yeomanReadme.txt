1.yeoman概念：
Yeoman其实是三个工具的集合：YO、GRUNT、BOWER

    YO：Yeoman核心工具，项目工程依赖目录和文件生成工具，项目生产环境和编译环境生成工具
    GRUNT：grunt去年很火，前端构建工具，jquery就是使用这个工具打包的
    BOWER：Web开发的包管理器，概念上类似npm，npm专注于nodeJs模块，而bower专注于CSS、JavaScript、图像等前端相关内容的管理

可以说：效率和规范是yeoman的核心诉求，旨在为开发者提供一系列健壮的工具、程序库和工作流
———————————————————————————————————————————————————————————————————————————————
yeoman 安装使用需要ruby和compass，ruby安装的时候不要使用二进制安装，否则还得安装其他的辅助程序，直接安装rubyinstaller，地址http://rubyinstaller.org/downloads/，安装了ruby之后运行下面的命令安装compass
$ gem update --system
$ gem install compass
———————————————————————————————————————————————————————————————————————————————
安装yeoman：npm install -g yo bower(本来需要grunt-cli的，因为本人之前已经安装过，所以这里掠过)
安装yeoman-generator-* :npm install -g generator-webapp
使用yeoman：新建工程目录，cd入此目录下，$ yo webapp命令生成项目结构
有问题时手动运行bower install & npm install 安装需要的各种依赖
$grunt server，自动打开浏览器监测项目更改并自动刷新浏览器

———————————————————————————————————————————————————————————————————————————————
注意的问题：在用bower安装components时，总是会报错: >>> bower ECMDERR Failed to execute "git ls-remote --tags --heads git://github.com/angular-ui/ui-router.git", exit code of #128
解决方案：change the protocol from git to https, it works >>> git ls-remote --tags --heads https://github.com/angular-ui/ui-router.git
使用此命令实现彻底修改git为https：git config --global url."https://".insteadOf git://
_______________________________________________________________________________
@赞！ $ grunt server命令打开终端只要watch的文件有更新它就会自动刷新浏览器来看到更新，这是很棒的东西，因为：：：如果你有PHP 开发经验，会习惯在修改PHP 脚本后直接刷新浏览器以观察结果，而你在开发Node.js实现的HTTP应用时会发现，无论你修改了代码的哪一部份，都必须终止Node.js 再重新运行才会奏效。这是因为Node.js 只有在第一次引用到某部份时才会去解析脚本文件，以后都会直接访问内存，避免重复载入，而PHP 则总是重新读取并解析脚本（如
果没有专门的优化配置）。Node.js的这种设计虽然有利于提高性能，却不利于开发调试，因
为我们在开发过程中总是希望修改后立即看到效果，而不是每次都要终止进程并重启.
在没有使用yeoman的时候解决这个办法可以用supervisor，它可以帮助监视你对代码的改动，并自动重启Node.js。
使用方法很简单，首先使用npm 安装supervisor：
$ npm install -g supervisor 

但是用了yeoman之后，它已经为我们做好了所有这些事情

2.yeoman特性：
Yeoman拥有如下特性：

    快速创建骨架应用程序——使用可自定义的模板（例如：HTML5、Boilerplate、Twitter Bootstrap等）、AMD（通过RequireJS）以及其他工具轻松地创建新项目的骨架。
    自动编译CoffeeScrip和Compass——在做出变更的时候，Yeoman的LiveReload监视进程会自动编译源文件，并刷新浏览器，而不需要你手动执行。
    自动完善你的脚本——所有脚本都会自动针对jshint（软件开发中的静态代码分析工具，用于检查JavaScript源代码是否符合编码规范）运行，从而确保它们遵循语言的最佳实践。
    内建的预览服务器——你不需要启动自己的HTTP服务器。内建的服务器用一条命令就可以启动。
    非常棒的图像优化——Yeoman使用OptPNG和JPEGTran对所有图像做了优化，从而你的用户可以花费更少时间下载资源，有更多时间来使用你的应用程序。
    生成AppCache清单——Yeoman会为你生成应用程序缓存的清单，你只需要构建项目就好。
    “杀手级”的构建过程——你所做的工作不仅被精简到最少，让你更加专注，而且Yeoman还会优化所有图像文件和HTML文件、编译你的CoffeeScript和Compass文件、生成应用程序的缓存清单，如果你使用AMD，那么它还会通过r.js来传递这些模块。这会为你节省大量工作。
    集成的包管理——Yeoman让你可以通过命令行（例如，yeoman搜索查询）轻松地查找新的包，安装并保持更新，而不需要你打开浏览器。
    对ES6模块语法的支持——你可以使用最新的ECMAScript 6模块语法来编写模块。这还是一种实验性的特性，它会被转换成eS5，从而你可以在所有流行的浏览器中使用编写的代码。
    PhantomJS单元测试——你可以通过PhantomJS轻松地运行单元测试。当你创建新的应用程序的时候，它还会为你自动创建测试内容的骨架。


3.对于项目的思考：
    1).项目目录该如何规划？
    2).使用什么类库来支撑系统开发？
    3).生产环境如何搭建（比如很多前端的生产环境是基于php，也有基于NodeJs）
    4).编译环境如何搭建（编译环境其实应该归到生产环境中，但前端很多人使用coffeescript/less/sass等，所以需要编译环境）
    5).单元测试环境如何搭建？
    6).调试环境如何搭建（本地代理远程assets等）
    7).开发完毕后打包部署如何处理？




4.yeoman命令使用
yeoman init:
yeoman默认的init模板基于：HTML5样板，Boostrap最为js的可选插件，Compass用来编辑Sass文件，Requirejs用来进行模块化编程和脚本加载







requirejs grunt部署的问题：
todo-generator目前的实现是通过require r.js的优化机制将所有依赖文件合并到一个js文件，这也是官网推荐的方案，但是存在的问题是：
1. 将依赖的库文件也一起合并到单个文件中，这个一方面不能将库文件和业务代码拆分，不便于缓存，另一方面如果库文件引用的不是本服务器上的文件，而是另一个服务器的库文件，比如jquery，那么就会因为文件加载顺序的问题而报错。

但是如果不进行优化，那么对于别的服务器的库文件的引用就不会有问题，会依照依赖正确执行

这篇文章是关于利用grunt进行多页面的requirejs优化问题

2. 对于不依赖库文件的组件依赖关系，可以通过r.js进行优化，

3. 要实现业务逻辑代码合并，库文件不合并，除非自己在写代码的时候手动加上模块路径，而这种方式在文件目录结构发生改变的时候需要手动修改模块文件路径。目前还没有发现为模块文件自动添加路径的优化处理器

4. 基于上面两个原因选择怎样的方式需要权衡


grunt打包发布的时候会存在的问题：
每次做的修改其实是希望只更新修改了的文件的，这可以加个文件的md5戳，但是require的原因，目前的做法是通过require配置，让所有的文件都重新加载一次，不太合理，但是目前没有更好的方法