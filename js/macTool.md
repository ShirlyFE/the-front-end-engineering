# mac tool install and use note

## 命令行rar、unrar压缩、解压文件

* [rar官网](http://www.rarlab.com/download.htm)下载mac下rar的tar包
* 下载解压后进到**rar**文件所在的目录执行以下两个命令，分别安装 rar 和 unrar：
```shell
	~$: sudo install -c -o $Username rar /bin
	~$: sudo install -c -o $Username unrar /bin

	//注意： 把 Username 替换成你自己的用户名

	//解压命令
	~$: unrar x compressed_file_name.rar
```

### tar压缩与解压命令详解

```
tar [-cxtzjvfpPN] 文件与目录
```

参数说明：
* -c：建立一个压缩文件（--create）
* -x从文档展开文件（--extract,--get）
* -t：列出存档中的文件和目录(--list)
* -z：用gzip对存档压缩或解压（--gzip,--ungzip）
* -j：是bzip2对存档压缩或解压
* -v：详细显示处理的文件（--verbose）
* -f：指定存档或设备（--file）
* -p：展开所有保护信息（--same-permissions,--preserve-permissions）
* -P：不要从文件名中去除‘/’（--absolute-paths）
* -N：仅存储时间较新的文件（--after-date DATE,--newer DATE）

用法说明：
```shell
// 将整个/etc 目录下的文件全部打包成为 /tmp/etc.tar

tar -cvf /tmp/etc.tar /etc   // 仅打包，不压缩
tar -zcvf /tmp/etc.tar.gz /etc  // 打包后用gzip压缩

// 查看上面打包的文件/tmp/etc.tar.gz有哪些文件,注意加上z，因为我们用了gzip压缩
tar -ztvf /tmp/etc.tar.gz

// 将/tmp/etc.tar.gz文件解压在 /usr/local/src文件夹下
cd /usr/local/src
tar -zxvf /tmp/etc.tar.gz
```
