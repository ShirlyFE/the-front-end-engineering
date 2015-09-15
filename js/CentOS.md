# CentOs

## 查看系统信息

CentOs可以使用 **cat /etc/redhat-release** 命令查看系统版本，比如我的是：CentOS release 6.4 (Final)

uname -r 可以查看linux系统的版本，下面命令得到的结果表明我的系统是64位的，也可以使用uname -a了解更加详细的信息
```
$ uname -r
2.6.32-358.el6.x86_64
``` 

## rpm
rpm 即RedHat Package Management，是RedHat的发明之一 ，在一个操作系统下，需要安装实现各种功能的软件包。这些软件包一般都有各自的程序，
但是同时也有错综复杂的依赖关系。同时还需要 解决软件包的版本，以及安装，配置，卸载的自动化问题，rpm包管理系统就是用来解决此类问题的

任何系统都需要包管理系统，因此很多linux都使用rpm系统，除了rpm，其他一些系统也有自己的软件包管理程序， 例如 debian的deb包

一般使用格式：
> rpm [选项] [rpm软件包]

### rpm包管理的用途
1. 可以安装、删除、升级和管理以rpm包形式发布的软件；
2. 可以查询某个rpm包中包含哪些文件，以及某个指定文件属于哪个rpm包；
3. 可以在查询系统中的某个rpm包是否已安装以及其版本；
4. 作为开发者可以把自己开发的软件打成rpm包发布；
5. 依赖性的检查，查询安装某个rpm包时，需要哪些其它的rpm包。 

注：
1. RPM软件的安装、删除、更新只有root权限才能使用；
2. 对于查询功能任何用户都可以操作。

### rpm包的查询功能

> rpm -q [select-options] [query-options]

1. 查看包x是否安装： rpm -q x
2. 查看系统中所有已安装的包： rpm -qa
3. 查找某个软件包： rpm -qa | grep x
4. 查看一个已经安装的文件属于哪个软件包： rpm -qf 文件绝对路径
5. 查询一个已安装软件包的信息： rpm -qi 软件包名
6. 查看一下已安装软件的配置文件： rpm -qc 软件名
7. 查看一个已经安装软件的文档安装位置：rpm -qd 软件名
8. 查看一下已安装软件所依赖的软件包及文件： rpm -qR 软件名

对于未安装的软件包的查看（查看的前提是当前目录下已存在一个.rpm文件）

1. 查看一个软件包的用途、版本等信息： rpm -qpi x.rpm
2. 查看一件软件包所包含的文件：rpm -qpl x.rpm
3. 查看软件包的文档所在的位置: rpm -qpd x.rpm
4. 查看一个软件包的配置文件: rpm -qpc x.rpm
5. 查看一个软件包的依赖关系: rpm -qpR x.rpm


### 软件包的安装、升级、删除等

安装和升级一个rpm 包:
```
  rpm -ivh x.rpm   #安装一个新的rpm 包
  rpm -Uvh x.rpm   #升级一个rpm 包
  rpm -ivh --nodeps --force x.rpm  #如果有依赖关系的，需解决依赖关系
  rpm -Uvh --nodeps --force x.rpm  #如果找不到依赖关系的包,用此命令强制安装
  rpm -ivh --test mplayer-1.0pre7try2-2.i386.rpm  #--test表示测试，并不真正安装
  rpm -ivh --relocate /=/usr/local/mplayer mplayer-1.0pre7try2-2.i386.rpm  #为软件包指定安装目录：要加 --relocate 参数，需要注意，通常可执行程序都放在安装目录下的bin或者sbin目录中
```

删除一个rpm 包
```
	rpm -e 软件包名  #如果有其它的rpm依赖于该rpm包，系统会出现警告
	# 如果一定要卸载，可以用选项 --nodeps 忽略依赖关系
```

RPM管理包管理器支持网络安装和查询
```
 	#格式： rpm  [选项]  rpm包的http或者ftp的地址
	rpm -qpi http://mirrors.kernel.org/.../RPMS/rsh-0.17-29.rpm  #查询包
	rpm -ivh http://mirrors.kernel.org/.../RPMS/rsh-0.17-29.rpm  #安装包
```

## 用户和用户组命令

用户列表文件：/etc/passwd

用户组列表文件：/etc/group

查看系统中有哪些用户：cut -d : -f 1 /etc/passwd

查看可以登录系统的用户：cat /etc/passwd | grep -v /sbin/nologin | cut -d : -f 1

查看用户操作：w(需要root权限)

查看某一用户：w 用户名

查看登录用户：who

查看用户登录历史记录：last

## linux超级守护进程xinetd
守护进程，也就是通常说的Daemon进程，是Linux中的后台服务进程。它是一个生存期较长的进程，通常独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。守护进程常常在系统引导装入时启动，在系统关闭时终止

由于在Linux中， 每一个系统与用户进行交流的界面称为终端，每一个从此终端开始运行的进程都会依附于这个终端，这个终端就称为这些进程的控制终端，当控制终端被关闭时，相 应的进程都会自动关闭。但是守护进程却能够突破这种限制，它从被执行开始运转，直到整个系统关闭时才退出。如果想让某个进程不因为用户或终端或其他的变化而受到影响，那么就必须把这个进程变成一个守护进程

每个守护进程都会监听一个端口，一些常用守护进程的监听端口是固定的，像httpd监听80端口， sshd监听22端口等；具体的端口信息可以通过 cat /etc/services 来查看

在Linux中，守护进程有两种方式，一种是svsy方式，一种是xinetd方式（超级守护进程）。 每个守护进程都会有一个脚本，可以理解成工作配置文件，守护进程的脚本需要放在指定位置。独立启动守护进程放在 /etc/init.d/ 目录下，当然也包括xinet的shell脚本；超级守护进程按照xinet中脚本的指示，它所管理的守护进程位于/etc/xinetd.config目录下

关于xinetd的详细配置情况参考[Linux 超级守护进程 xinetd](http://linuxzoe.blog.51cto.com/3005391/572965)


## 使用ssh-copy-id实现免密登录

工作中我们常需要通过ssh登上跳板机，然后通过跳板机登上服务器执行脚本或者做一些部署，但是因为权限的原因每次登录都需要输入密码，为此我们需要一种安全又便捷的免密码登录，为了理解ssh免密登录的原理，我们先来看看密码登录时的原理：
* 客户端发送ssh连接请求
* 服务端响应请求，将公钥发送给客户端
* 客户端用公钥加密自己的用户名发送给服务端
* 服务端用私钥解密用户名，比对用户列表看是否允许登录
* 若允许登录则接受请求，要求输入密码
* 客户端用公钥加密密码，并发送给服务端
* 服务端用私钥解密密码，验证用户
* 验证成功后提示用户
* 客户端用公钥加密一个通信密码给服务端，此后双方用此密码加密通信内容

通信的关键是一对公钥-秘钥系统，公钥加密的数据必须用秘钥解开，同样地，秘钥加密的数据也必须由公钥解开。那么，如果服务端有客户端的公钥，它用此公钥加密的数据就只有客户端自己能用自己的私钥解开（假设客户端保密工作做的好，只有自己知道自己的私钥）。所以，如果客户端能解开服务端加密的数据，那么服务端就能够信任此客户端为可信的。所以，只要在服务端拷贝客户端的公钥，就可以完成安全快捷的免密码ssh登录。原理如下：
* 客户端发送ssh连接请求
* 服务端发现在authorized_keys文件中有客户端的主机名
* 服务端用authorized_keys里客户端的公钥加密一个challenge
* 客户端解密challenge，将内容用服务端的公钥加密传给服务端
* 服务端收到challenge，发现与原始内容一样，完成客户端认证
* 客户端用服务端公钥加密通信密码，双方用通信密码通信

为了将公钥拷贝到服务端，首先要在本地创建公钥和私钥文件，这可以通过命令ssh-keygen来完成，然后要将客户端的公钥拷贝到服务端对应用户的~/.ssh/authorized_keys文件中，另一种方式就是使用ssh-copy-id

ssh-copy-id命令可以把本地主机的公钥复制到远程主机的authorized_keys文件上，ssh-copy-id命令也会给远程主机的用户主目录（home）和~/.ssh, 和~/.ssh/authorized_keys设置合适的权限

语法：
```
> ssh-copy-id [-i [identity_file]] [user@]machine

-i : 指定公钥文件
```

ssh-copy-id是一个普普通通的脚本文件
```
$ which ssh-copy-id
/usr/bin/ssh-copy-id
$ file /usr/bin/ssh-copy-id
/usr/bin/ssh-copy-id: POSIX shell script text executable
```

ssh-copy-id脚本内容如下：
```
#!/bin/sh

# Shell script to install your public key on a remote machine
# Takes the remote machine name as an argument.
# Obviously, the remote machine must accept password authentication,
# or one of the other keys in your ssh-agent, for this to work.

ID_FILE="${HOME}/.ssh/id_rsa.pub"

if [ "-i" = "$1" ]; then
  shift
  # check if we have 2 parameters left, if so the first is the new ID file
  if [ -n "$2" ]; then
    if expr "$1" : ".*\.pub" > /dev/null ; then
      ID_FILE="$1"
    else
      ID_FILE="$1.pub"
    fi
    shift         # and this should leave $1 as the target name
  fi
else
  if [ x$SSH_AUTH_SOCK != x ] ; then
    GET_ID="$GET_ID ssh-add -L"
  fi
fi

if [ -z "`eval $GET_ID`" ] && [ -r "${ID_FILE}" ] ; then
  GET_ID="cat ${ID_FILE}"
fi

if [ -z "`eval $GET_ID`" ]; then
  echo "$0: ERROR: No identities found" >&2
  exit 1
fi

if [ "$#" -lt 1 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "Usage: $0 [-i [identity_file]] [user@]machine" >&2
  exit 1
fi

{ eval "$GET_ID" ; } | ssh $1 "umask 077; test -d ~/.ssh || mkdir ~/.ssh ; cat >> ~/.ssh/authorized_keys && (test -x /sbin/restorecon && /sbin/restorecon ~/.ssh ~/.ssh/authorized_keys >/dev/null 2>&1 || true)" || exit 1

cat <<EOF
Now try logging into the machine, with "ssh '$1'", and check in:

  .ssh/authorized_keys

to make sure we haven't added extra keys that you weren't expecting.

EOF
```

可以看到如果使用ssh-copy-id报错：/usr/bin/ssh-copy-id: ERROR: No identities found,是因为使用选项 -i 但是没有值传递或者传递的公钥文件不可访问(不存在)

举例： 把本地的ssh公钥文件安装到远程主机对应的账户下：
```
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server  #注意，你需要有server的登录权限，如果你不知道user用户登录server的密码时也是无法把公钥文件发过去的

#也就是说ssh-copy-id做到的是让你通过ssh输入一次密码传送公钥之后以后都不用输入密码，这样自然也就可以通过脚本来做登录然后执行服务器脚本等操作了
```

### 补充ssh的一些基本知识

假定你要以用户名user，登录远程主机host，只需：
```
$ ssh user@host

# 如果本地用户名与远程用户名一致，登录时可以省略用户名
$ ssh host
```

SSH的默认端口是22，也就是说，你的登录请求会送进远程主机的22端口。使用p参数，可以修改这个端口:
```
$ ssh -p 2222 user@host #ssh直接连接远程主机的2222端口
```

## rsync进行数据镜像备份

rsync是一个远程数据同步工具，可通过LAN/WAN快速同步多台主机间的文件。它使用所谓的“Rsync演算法”来使本地和远程两个主机之间的文件达到同步，这个算法只传送两个文件的不同部分，而不是每次都整份传送，因此速度相当快。所以通常可以作为备份工具来使用

运行Rsync server的机器也叫backup server，一个Rsync server可同时备份多个client的数据；也可以多个Rsync server备份一个client的数据。Rsync可以搭配ssh甚至使用daemon模式。Rsync server会打开一个873的服务通道(port)，等待对方rsync连接。连接时，Rsync server会检查口令是否相符，若通过口令查核，则可以开始进行文件传输。第一次连通完成时，会把整份文件传输一次，下一次就只传送二个文件之间不同的部份


rsync在CentOs6上默认已经安装，如果没有则可以yum install rsync -y进行安装，服务端和客户端是同一个安装包
```
$ rsync -h
```

格式： rsync [选项] 源文件 目标文件

常见选项：
* -n:如果担心命令执行不正确，一同步复制，可能这个复制的后果是致命的，那后果可就严重了，这里我们可以加-n先测试一下
* -a，--archive 归档模式，表示以递归的方式传输文件，并且保持文件属性，等同于-rlptgoD
* -r，–recursive 对子目录以递归模式处理
* -l,--links 表示拷贝链接文件
* -p , --perms 表示保持文件原有权限
* -t , --times 表示保持文件原有时间
* -g , --group 表示保持文件原有属用户组
* -o , --owner 表示保持文件原有属主
* -D , --devices 表示块设备文件信息
* -z , --compress 基于网络时使用，对文件压缩后传输
* -H 表示硬连接文件
* -A 保留ACL属性信息
* -P, --progress 显示传输进度
* -u, --update 仅仅进行更新，也就是跳过所有已经存在于目标位置，并且文件时间晚于要备份的文件。(不覆盖更新的文件)
* --port=PORT 指定其他的rsync服务端口
* --delete 删除那些目标位置有而原始位置没有的文件
* --password-file=FILE 从FILE中得到密码
* --bwlimit=KBPS 限制I/O带宽，KBytes /second
* --filter "- 文件名"需要过滤的文件
* --exclude= ：需要过滤的文件
* -v, --verbose: 显示同步过程的详细信息
* -q , --quiet: 静默模式，尽可能输出少的信息
* -e SSH: 远程复制时，表示使用ssh协议作承载
* --stats: 显示如何执行压缩和传输的，也就是显示传输状态的 

**注意：** rsync命令使用中，如果源参数的末尾有斜线，就会复制指定目录内容，而不复制目录本身;没有斜线，则会复制目录本身

### 本地同步文件，举例：将test目录同步到dd目录下
 
```
$ rsync -r /home/lili.tian/test /home/lili.tian/dd #执行之后会创建dd目录，且test目录同步到dd目录下
```

说明：如果担心备份过程有误，可以通过-nv侧进行测试，rsync会模拟备份过程，但不真的备份
```
$ rsync -r /home/lili.tian/test /home/lili.tian/dd -nv #测试ok之后再执行真正的备份
```

rsync命令的工作模式有四种：
1. shell模式，也称为本地模式，速度要比cp快
2. 远程shell模式，其可以借助于ssh或者rsh协议承载其数据传输过程
3. 列表模式，其工作方式与ls相似，仅列出源的内容：-nv
4. 服务器模式，此时，rsync可以工作为守护进程，能够接收客户端的数据传输请求，在使用时可以在客户端使用rsync命令发送给守护进程，也可以向服务器主获取文件。

上面本地同步文件的示例已经看到了1、3两种工作模式

在进行远程文件同步时本人更推荐4，因为4是基于tcp的传输只要两台机器可以ping通就可以进行文件传输，但是模式2就需要用户可以通过ssh登陆到备份服务器，在公司环境中开发人员一般是通过跳板机登陆服务器，服务器之间用户是没有办法通过ssh直接登陆的，因为密码未知，这就限制了rsync的使用，本人做专题系统发布经过各种尝试之后最终也是选择了rsync的服务器模式来同步资源文件

举几个ssh推送文件和拉取文件的示例：
```
#把本地的etc目录推送到172.16.251.244主机上去
$ rsync -r -e ssh /tmp/etc root@172.16.251.244:/tmp/  #需要输入root用户登录服务器172.16.251.244的密码

#拉取远程主机上的文件
$  rsync -e ssh -r -a root@172.16.251.244:/etc/pam.d ./ --stats
```

举几个推送文件到rsync服务器和从rsync服务器拉取文件的示例
```
#把文件推送到rsync服务器端去：
$ rsync -auzv messages myuser@172.16.27.1::my_data_rsync

#从rsync服务器上拉取文件到本地
$ rsync myuser@172.16.27.1::my_data_rsync/messages /tmp/
```

使用服务器模式无需远程shell，使用TCP直接连接rsync daemon，唯一需要的就是在一台机器上启动rsync daemon来启用守护进程，或者通过xinetd超级进程来管理rsync后台进程

### 同步远程服务器数据

要求如下：将数据源服务器A的/home/q/www/specialtopic.qunar.com目录文件同步到备份服务器B的/home/q/www目录下,其中

* 源服务器A： 192.168.1.1
* 备份服务器B: 192.168.1.2
* 平台CentOs
* rsync默认监听端口873

#### 配置过程

##### 备份服务器B配置

在服务器间rsync传输文件，需要有一个是开着rsync的服务，而这一服务需要两个配置文件，说明当前运行的用户名和用户组，这个用户名和用户组在改变文件权限和相关内容的时候有用，否则有时候会出现提示权限问题。配置文件也说明了模块、模块化管理服务的安全性，每个模块的名称都是自己定义的，可以添加用户名密码验证，也可以验证IP，设置目录是否可写等，不同模块用于同步不同需求的目录。

设置rsync配置文件，配置文件默认不存在，需要手动添加
```
$ sudo vi /etc/rsyncd.conf

list = false #是否允许用户列出文件列表
uid = root  #以什么身份运行或获取数据的
gid = root  #用户所属组
use chroot = no #
max connections = 10 #做为服务器端最大并发连接数
strict modes = yes #是否工作在严格模式下，严格检查文件权限等相关信息
pid file = /var/run/rsyncd.pid #定义pid文件路径
log file = /var/log/rsyncd.log #定义日志文件存放路径的

[specialtopic_rsync] #同步模块标识
path = /home/q/www #同步目录的路径
ignore errors = yes #中间复制过程有一个文件出错了是要继续复制还是中止复制，yes表示继续复制，no表示中止复制
read only = no #打算让别人仅仅是来拉取数据的，yes就可以了，如果打算让别人推送过来做备份的那就为no
write noly = no #只允别人在里面写数据，但不可以拉取数据 
hosts allow = 192.168.1.1 #做白名单的，允许哪些主机可以访问
hosts deny = * #定义黑名单，allow和deny同时出现时先检查hosts allow,如果匹配就allow，否则检查hosts deny，如果匹配则拒绝，如是二者都不匹配，则由默认规则处理，即为允许
uid = root
gid = root
auth users = lili.tian #做用户验证的，只允许哪个用户来复制
secrets file = /etc/rsyncd.auth #存放验证用户的密码的
```
**注意：** 修改 rsyncd.conf 配置文件后不必重启rsync daemon，因为每次的client连接都会去重新读取该文件

创建密码文件：
```
$ sudo vi /etc/rsyncd.auth
lili.tian:shirly_special_topic_546372819
```
说明：一行一个用户，格式是“用户名:密码”，并且这里的用户名和密码与操作系统的用户名密码无关，可以随意指定，与/etc/rsyncd.conf中的auth users对应即可

确保密码文件权限600，否则报错
```
$ sudo chmod 600 /etc/rsyncd.auth
```

确保同步的目标目录/home/q/www存在，否则报错

确保目录属主与rsyncd.conf中的配置一致，不一致时通过如下命令让其一致：
```
sudo chown root.root /home/q/www
```

启动rsync：
```
sudo rsync --daemon --config=/etc/rsyncd.conf
```

也可以通过超级守护进程xinetd启动rsync,操作如下：
* yum install -y xinetd
* 配置rsync
```
$ sudo vi /etc/xinetd.d/rsync 
# default: off
# description: The rsync server is a good addition to an ftp server, as it \
# allows crc checksumming etc.
service rsync
{
  disable = no
  flags   = IPv6
  socket_type     = stream
  wait            = no
  user            = root
  server          = /usr/bin/rsync
  server_args     = --daemon --config=/etc/rsyncd.conf
  log_on_failure  += USERID
}
```
* 启动xinetd：sudo service xinetd restart


##### 源服务器A的配置

保存备份服务器验证用户lili.tian(auth users = lili.tian)的验证密码
```
$ sudo vi /etc/rsyncd.auth
shirly_special_topic_546372819
```

确保文件权限600，否则报错
```
$ sudo chmod 600 /etc/rsyncd.auth
```

测试文件同步
```
$ sudo rsync -avz --delete --progress /home/q/www/specialtopic.qunar.com lili.tian@192.168.1.2::specialtopic_rsync --password-file=/etc/rsyncd.auth
```

##### 启动rsync注意点

需要重启rsync的话，先 cat /var/run/rsyncd.pid查询到rsync的pid，然后 kill -p pid 之后执行启动命令

增加rsync开机启动：在 /etc/rc.local 增加 /usr/bin/rsync --daemon

**注意：** 在不同主机之间的进行备份，是必须架设rsync 服务器的。


### 定时数据同步
使用rsync定时同步数据，每次同步需要扫描所有文件后进行比对，然后进行差量传输。如果文件数量达到了百万甚至千万量级，扫描所有文件将是非常耗时的。而且正在发生变化的往往是其中很少的一部分，显得非常低效



### 触发式数据同步

为了避免定时数据同步每次都扫描所有文件对比差异的耗时，可以使用inotify监听需要同步目录的变更情况，然后使用rsync同步变更文件

inotify是Linux下的一种强大的、细粒度的、异步的文件系统事件监控机制，通过Inotify可以监控文件系统中添加、删除，修改、移动等各种细微事件，利用这个内核接口，第三方软件就可以监控文件系统下文件的各种变化情况，而inotify-tools就是这样的一个第三方软件

linux内核2.6.13之后就支持inotify了，确认方法：
```
$ ls /proc/sys/fs/inotify
> max_queued_events max_user_instances max_user_watches  #支持这三个选项就说明inotify可用
```

安装[inotify-tools](http://pkgs.repoforge.org/inotify-tools/): 
```
$ rpm -ivh http://pkgs.repoforge.org/inotify-tools/inotify-tools-3.13-1.el6.rf.x86_64.rpm
``` 

inotify-tools安装成功后会生成inotifywait 和 inotifywatch辅助工具程序，用来监控、汇总改动情况，命令行中输入以下命令如果都有打印出帮助信息，说明inotify-tools安装成功
```
$ inotifywatch -h
$ inotifywait -h
```

#### 触发式数据同步配置

##### 源服务器A
```
$ sudo vi /root/rsync.sh

#!/bin/bash
src=/home/q/www/specialtopic.qunar.com
des=lili.tian@192.168.1.2::specialtopic_rsync
/usr/local/bin/inotifywait -mrq --timefmt '%d/%m/%y %H:%M' --format '%T %w%f' \
-e modify,delete,create,attrib ${src} \
| while read x
    do
        /usr/bin/rsync -avz --delete --progress $src $des --password-file=/etc/rsyncd.auth &&
        echo "$x was rsynced" >> /var/log/rsync.log
    done
```

脚本说明：
* -m: 保持监听事件
* -r：递归查看目录。
* -q：打印出事件。
* -e modify,delete,create,attrib：监听写入，删除，创建，属性改变事件

为脚本添加执行权限：
```
chmod +x /root/rsync.sh
```

在rc.local中加入自启动：
```
$ sudo echo "/root/rsync.sh" >> /etc/rc.local
```

运行同步脚本：
```
$ sudo /root/rsync.sh &
```

### rsync相关资源
[Linux下同步工具inotify+rsync使用详解](http://segmentfault.com/a/1190000002427568)



