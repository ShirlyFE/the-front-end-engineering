# eclipse

## eclipse 快捷键

* 输入类的首字母按 **alt + /** 后就会出现自动提示
* **ctrl + H** 在工作空间中查找，文件(File)查找允许用户查找所有文件类型，而java查找只针对java文件进行查找，比如我们要查找Person类使用的事情，可以通过java查找页面，步骤是：

1. 在查找框中输入Person
2. 在search for的单选按钮中选择Type
3. 在limit to单选按钮中选择References
4. 点击search就可以显示Person被引用的情况

## eclipse开发Android应用程序

环境准备：
* 1. 下载[jdk](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)，并安装
* 2. 配置系统环境变量
	```
	JAVA_HOME:  'C:\Program Files\Java\jdk1.7.0_79'

	CLASSPATH:  '.;%JAVA_HOME%\lib\tools.jar'

	PATH:  '%JAVA_HOME%\bin;%PATH%'
	```
* 3. 下载[eclipse](http://www.eclipse.org/downloads/)
	如果安装eclipse报 **'Failed to create the Java Virtual Machine'** 错，则打开eclipse.ini做以下修改：

```java
// -Xmx1024，最大内存占用改为512
-Xmx512m 
-Dosgi.requiredJavaVersion=1.7 //改为自己的jdk的版本
```

* 4. 安装[ADT, Android Development Tools](http://developer.android.com/tools/sdk/eclipse-adt.html)

	* 启动Eclipse后，选择Help -> install new Software
	* 添加ADT plugin-in网址: https://dl-ssl.google.com/android/eclipse/
	* 然后选择安装Android DDMS（Android Dalvik Debug Moniter Server）和Android Development Tools（ADT）

* 5. [Android SDK](http://developer.android.com/sdk/index.html)

安装完成后设置系统变量PATH: C:\Program Files\Android\android-sdk\tools,进入cmd控制台窗口输入 **android -h** 有帮助信息则说明安装完成




## 资源
[前端之Android入门(1):环境配置](http://isux.tencent.com/learn-android-from-zero-session1.html)

[android studio 系列教程](http://stormzhang.com/devtools/2014/11/25/android-studio-tutorial1/)






