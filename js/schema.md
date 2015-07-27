# scheme

## 什么是scheme

Scheme是一个协议，用来进行页面之间的跳转,比如说浏览器中一个网站内部的各种跳转:http://www.cocoachina.com/

iOS Scheme是用来完成iOS中各个UIViewController之间的跳转，通过一个类似于浏览器的网址


## Inside App Scheme For iOS 的用处

* 定向页面推送（Push）
* Web和native app间界面互相跳转（web页面url，web页面点击跳转App内部界面）

在iOS中，需要调起一个app可以使用schema协议，这是iOS原生支持的，并且因为iOS系统中都不能使用自己的浏览器内核，所以所有的浏览器都支持，这跟android生态不一样，android是可以自己搞内核的，但是iOS不行。

在iOS中提供了两种在浏览器中打开APP的方法：Smart App Banner和schema协议。

### Smart App Banner

即通过一个meta 标签，在标签上带上app的信息和打开后的行为，例如：app-id之类的，代码形如：

```html
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
```

具体可以看下开发文档：[promoting apps with app banners](https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html)

### 使用schema URL来打开iOS APP
schema类似自定义url协议，我们可以通过自定义的协议来打开自己的应用

```shell
myapplink://
# 例如 facebook的
fb://
# itunes的
itms-apps://
# 还有短信也是类似的
sms://
```


如果要打开一个app，最简单的方式是通过一个链接，如我们在html中这样写：
```html
<a href="myapplink://">打开我的app</a>
```

当用户点击链接的时候就可以打开对应的app。


## Android 中Intent认识

Intent的中文意思是“意图，意向”，在Android中Intent用来协助应用间的交互与通讯，具体来说就是负责对应用中一次操作的动作、动作涉及数据、附加数据进行描述，Android则根据此Intent的描述，负责找到对应的组件，将 Intent传递给调用的组件，并完成组件的调用。Intent不仅可用于应用程序之间，也可用于应用程序内部的Activity/Service之间的交互。因此，可以将Intent理解为不同组件之间通信的“媒介”专门提供组件互相调用的相关信息。

在Google Doc中是这样描述Intent的（摘自Android中文翻译组）
当接收到ContentResolver发出的请求后，内容提供者被激活。而其它三种组件──activity、服务和广播接收器被一种叫做intent的异步消息所激活。intent是一个保存着消息内容的Intent对 象。对于activity和服务来说，它指明了请求的操作名称以及作为操作对象的数据的URI和其它一些信息。比如说，它可以承载对一个activity 的请求，让它为用户显示一张图片，或者让用户编辑一些文本。而对于广播接收器而言，Intent对象指明了声明的行为。比如，它可以对所有感兴趣的对象声 明照相按钮被按下。

### 对于每种组件来说，激活的方法是不同的

#### Activity的激活 

通过传递一个Intent对象至 Context.startActivity()或Activity.startActivityForResult()以载入（或指定新工作给）一个activity。相应的activity可以通过调用 getIntent() 方法来查看激活它的intent。Android通过调用activity的onNewIntent()方法来传递给它继发的intent。

一个activity如果启动下一个Activity时它期望它所启动的那个activity返回一个结果，它会以调用startActivityForResult()来取代startActivity()。比如说，如果它启动了另外一个activity以使用户挑选一张照片，它也许想知道哪张照片被选中了。结果将会被封装在一个Intent对象中，并传递给发出调用的activity的onActivityResult() 方法。

#### Service的激活

通过传递一个Intent对象至Context.startService()将启动一个服务（或传递给正在运行的服务一个新的指令）。Android调用服务的onStart()方法并将Intent对象传递给它。

与此类似，一个Intent可以被调用组件传递给 Context.bindService()以获取一个正在运行的目标服务的连接。这个服务会经由onBind() 方法的调用获取这个Intent对象（如果服务尚未启动，bindService()会先启动它）。比如说，一个activity可以连接至前述的音乐回放服务，并提供给用户一个可操作的（用户界面）以对回放进行控制。这个activity可以调用 bindService() 来建立连接，然后调用服务中定义的对象来影响回放。

#### BroadCast的激活

应用程序可以凭借将Intent对象传递给 Context.sendBroadcast() ，Context.sendOrderedBroadcast()， 以及Context.sendStickyBroadcast()和其它类似方法来产生一个广播。Android会调用所有对此广播有兴趣的广播接收器的 onReceive()方法将intent传递给它们。

### Intent类的重要变量

在Intent类的Java源代码中定义了Intent相关内容的变量，如下：

```java
// Action
private String mAction;
// Data
private Uri mData;
private String mType;
private String mPackage;
// ComponentName
private ComponentName mComponent;
// Flag
private int mFlags;
// category
private HashSet<String> mCategories;
// extras
private Bundle mExtras;
```

componentName（组件名称），指定Intent的目标组件的类名称。组件名称是可选的，如果填写，Intent对象会发送给指定组件名称的组件，否则也可以通过其他Intent信息定位到适合的组件。组件名称是个ComponentName类型的对象。

用法：

```php
Intent intent = new Intent();
// 构造的参数为当前Context和目标组件的类路径名
ComponentName cn = new ComponentName(HelloActivity.this, "com.byread.activity.OtherActivity");
intent.setComponent(cn);
startActivity(intent);
```


相当于以下常用方法：
```php
Intent intent = new Intent();
intent.setClass(HelloActivity.this, OtherActivity.class);
startActivity(intent);
```

Intent类中也包含一个初始化ComponentName的构造函数

```php
public Intent(Context packageContext, Class cls) {
    mComponent = new ComponentName(packageContext, cls);
}
```

action（动作）,指定Intent的执行动作，比如调用拨打电话组件。

```php
public Intent(String action) {
    mAction = action;
}
```


data（数据），起到表示数据和数据MIME类型的作用。不同的action是和不同的data类型配套的，通过设置data的Uri来获得。

```php
public Intent(String action, Uri uri) {
    mAction = action;
    mData = uri;
}
```

比如调用拨打电话组件

```php
Uri uri = Uri.parse("tel:10086");
// 参数分别为调用拨打电话组件的Action和获取Data数据的Uri
Intent intent = new Intent(Intent.ACTION_DIAL, uri);
startActivity(intent);
```

category（类别），被执行动作的附加信息。例如应用的启动Activity在intent-filter中设置category。

```xml
<intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
```

extras（附加信息），为处理Intent组件提供附加的信息。可通过putXX()和getXX()方法存取信息；也可以通过创建Bundle对象，再通过putExtras()和getExtras()方法来存取。

flags（标记），指示Android如何启动目标Activity，设置方法为调用Intent的setFlags方法。常用的Flags参数有：

* FLAG_ACTIVITY_CLEAR_TOP
* FLAG_ACTIVITY_NEW_TASK
* FLAG_ACTIVITY_NO_HISTORY
* FLAG_ACTIVITY_SINGLE_TOP

### Intent的传递

**显式方式：** 直接设置目标组件的ComponentName，用于一个应用内部的消息传递，比如启动另一个Activity或者一个services。
通过Intent的setComponent和setClass来指定目标组件的ComponentName。

**隐式方式：** ComponentName为空，用于调用其他应用中的组件。需要包含足够的信息，这样系统才能根据这些信息使用intent filter在所有的组件中过滤action、data或者category来匹配目标组件。

如果Intent指明定了action，则目标组件的IntentFilter的action列表中就必须包含有这个action，否则不能匹配；

如果Intent没有提供type，系统将从data中得到数据类型。和action一样，目标组件的数据类型列表中必须包含Intent的数据类型，否则不能匹配；

如果Intent中的数据不是content: 类型的URI，而且Intent也没有明确指定它的type，将根据Intent中数据的scheme （比如 http: 或者mailto: ） 进行匹配。同上，Intent 的scheme必须出现在目标组件的scheme列表中；

如果Intent指定了一个或多个category，这些类别必须全部出现在组建的类别列表中。比如 Intent中包含了两个类别：LAUNCHER_CATEGORY 和 ALTERNATIVE_CATEGORY，解析得到的目标组件必须至少包含这两个类别。

### Intent调用常见系统组件

```java
// 调用浏览器
Uri webViewUri = Uri.parse("http://blog.csdn.net/zuolongsnail");
Intent intent = new Intent(Intent.ACTION_VIEW, webViewUri);

// 调用地图
Uri mapUri = Uri.parse("geo:100,100");
Intent intent = new Intent(Intent.ACTION_VIEW, mapUri);
 
// 播放mp3
Uri playUri = Uri.parse("file:///sdcard/test.mp3");
Intent intent = new Intent(Intent.ACTION_VIEW, playUri);
intent.setDataAndType(playUri, "audio/mp3");
 
// 调用拨打电话
Uri dialUri = Uri.parse("tel:10086");
Intent intent = new Intent(Intent.ACTION_DIAL, dialUri);

// 直接拨打电话，需要加上权限<uses-permission id="android.permission.CALL_PHONE" />
Uri callUri = Uri.parse("tel:10086");
Intent intent = new Intent(Intent.ACTION_CALL, callUri);
 
// 调用发邮件（这里要事先配置好的系统Email，否则是调不出发邮件界面的）
Uri emailUri = Uri.parse("mailto:zuolongsnail@163.com");
Intent intent = new Intent(Intent.ACTION_SENDTO, emailUri);

// 直接发邮件
Intent intent = new Intent(Intent.ACTION_SEND);
String[] tos = { "zuolongsnail@gmail.com" };
String[] ccs = { "zuolongsnail@163.com" };
intent.putExtra(Intent.EXTRA_EMAIL, tos);
intent.putExtra(Intent.EXTRA_CC, ccs);
intent.putExtra(Intent.EXTRA_TEXT, "the email text");
intent.putExtra(Intent.EXTRA_SUBJECT, "subject");
intent.setType("text/plain");
Intent.createChooser(intent, "Choose Email Client");

// 发短信
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.putExtra("sms_body", "the sms text");
intent.setType("vnd.android-dir/mms-sms");

// 直接发短信
Uri smsToUri = Uri.parse("smsto:10086");
Intent intent = new Intent(Intent.ACTION_SENDTO, smsToUri);
intent.putExtra("sms_body", "the sms text");

// 发彩信
Uri mmsUri = Uri.parse("content://media/external/images/media/23");
Intent intent = new Intent(Intent.ACTION_SEND);
intent.putExtra("sms_body", "the sms text");
intent.putExtra(Intent.EXTRA_STREAM, mmsUri);
intent.setType("image/png");
 
// 卸载应用
Uri uninstallUri = Uri.fromParts("package", "com.app.test", null);
Intent intent = new Intent(Intent.ACTION_DELETE, uninstallUri);

// 安装应用
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setDataAndType(Uri.fromFile(new File("/sdcard/test.apk"), "application/vnd.android.package-archive");
 
// 在Android Market中查找应用
Uri uri = Uri.parse("market://search?q=愤怒的小鸟");        
Intent intent = new Intent(Intent.ACTION_VIEW, uri);
```


