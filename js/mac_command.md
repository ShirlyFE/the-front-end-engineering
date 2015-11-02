pwd: 查看当前目录路径

alias：
1. 用来设置全局变量，比如可以用别名表示应用执行路径，但是直接在terminal中作设置的话只会在当前shell中生效，如果重新开启一个Shell或者重新登录，则这些alias将无法使用。
那让其永久生效的方法有以下两种：
<1>.若要每次登入就自动生效别名，则把别名加在/etc/profile或~/.bashrc中。然后# source ~/.bashrc，如果文件不存在则新建它，有的话就直接打开修改添加

<2>.若要让每一位用户都生效别名，则把别名加在/etc/bashrc最后面，然后# source /etc/bashrc

设置别名：alias name="command line"

删除别名：unalias name
列出当前所有的别名设置：# alias -p 或者# alias



