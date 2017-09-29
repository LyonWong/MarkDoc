#GameBegin Android SDK 集成文档 All In One（V2.9.x）

---------

[TOC]

---------

## 一、接入说明

### 1.1 文档综述

本文档主要用于对游戏开发商（ CP ）如何集成 GameBegin Android SDK 进行说明。
在整个 GB_Android_SDK_yyyymmdd.zip 压缩包中，包含如下内容：

> 1. **GameBegin Android SDK 集成文档 Vx.x.html**（本文档）
> 2. **gb_android_sdk**（ GameBegin Android SDK library 项目）
> 3. **MainActivity**（ Demo 项目）

项目间依赖关系：

![](http://ou8yjaa9w.bkt.clouddn.com/0742e01d34cfff2edc45712ec9dc3da6.jpeg)


###1.2 导入 SDK 项目

以下皆以 `ADT` 为基础，以 `Demo 项目（ MainActivity ）` 为例。虽然 Android 官方和我们都推荐使用更强大的 Android Studio 进行开发。但就目前来看 Android Studio 对 C/C++ 的支持度还不够，待 Android Studio 完善功能之后，我们将在文档中进行补充。

####1.2.1 导入 GameBegin SDK 项目

打开ADT，选择 File -> Import，在 Select 中选择 Android 下的 Existing Android Code into Workspace（见图1.2.1-1）。点击 Next 之后，引入gb_android_sdk 项目（见图1.2.1-2），点确定，加载完成。
![](http://ou8yjaa9w.bkt.clouddn.com/41ac0a0101467d72a6668c8307e6493d.jpg)
图1.2.1-1

![](http://ou8yjaa9w.bkt.clouddn.com/7a21dafbb8909a3377ee239ec5e7e998.jpg)

图1.2.1-2

####1.2.2  导入 Demo 项目

项目导入方法同1.2.1，导入 MainActivity。
> 此项目导入过程是以 Demo 项目为例，实际项目接入开发过程中，CP 方在ADT中已经先引入了游戏项目，可以忽略这一步。

设置项目依赖 GameBegin SDK 项目，方法同1.2.3项目依赖设置部分（见图1.2.4-1）。
![](http://ou8yjaa9w.bkt.clouddn.com/1e7ee471a921a9cb081988192bc957a2.jpg)
图1.2.4-1

至此，我们项目导入部分已经完成。

###1.3 配置 AndroidManifest.xml

我们为了尽可能减少合作伙伴工作量，使用了 `manifest merge` 方式来进行配置，这样接入工程师只需要在 `gb_android_sdk` 项目下进行配置。由于已经做好了初始配置，接入工程师只需要根据下面的内容进行相应修改就可以了。

####1.3.1 设置 manifest merge

在游戏项目中找到 `project.properties` 并添加配置

``` xml
manifestmerger.enabled=true
```

> 使用 manifest merge 过程中，如遇到 `Unknown error merging manifest` 错误，请检查：
> 1、ADT 版本是否 > 20 preview 版本；
> 2、主项目与 library 项目的 targetSdkVersion、minSdkVersion 是否保持一致。

####1.3.2 配置 Facebook

1) 在 gb_android_sdk/res/values/string.xml 中设置 facebook_app_id。

``` xml
<string name="facebook_app_id">{FACEBOOK_APP_ID}</string>
```

2) 在 gb_android_sdk/AndroidManifest.xml 中 设置 Facebook `provider` 

``` xml
<provider
    android:name="com.facebook.FacebookContentProvider"
    android:authorities="com.facebook.app.FacebookContentProvider{FACEBOOK_APP_ID}"
    android:exported="true" />
```

>Facebook 的 facebook_app_id 请向 GB 的开发索取。
>请确保刚才在 AndroidMenifest.xml 中添加的 `com.facebook.app.FacebookContentProvider{FACEBOOK_APP_ID}` 处的 facebook_app_id 与 string.xml 中的 facebook_app_id 保持一致。

####1.3.3 配置 Fortumo

在 gb_android_sdk/AndroidManifest.xml 中，把 Fortumo 配置中的 `your_packagename` 替换为本项目的包名

权限部分

``` xml
<permission
        android:name="{your_packagename}.fortumo.PAYMENT_BROADCAST_PERMISSION"
        android:label="Read payment status"
        android:protectionLevel="signature" />

<uses-permission android:name="{your_packagename}.fortumo.PAYMENT_BROADCAST_PERMISSION" />
```

application 下 Fortumo receiver

``` xml
<receiver android:name="com.gamebegin.sdk.pay.fortumo.FortumoStatusReceiver" android:permission="{your_packagename}.fortumo.PAYMENT_BROADCAST_PERMISSION">
    <intent-filter>
        <action android:name="mp.info.PAYMENT_STATUS_CHANGED" />
    </intent-filter>
</receiver>
```

####1.3.4 配置 BluePay

把 gb_android_sdk/assets 下的 `BluePay.ref` 文件拷贝到项目对应的 assets 下。

####1.3.5 配置 Scheme

在游戏项目 AndroidManifest.xml 的主 `Activity` 中添加 Scheme（请向 GB 的开发索取）

``` xml
<主Activity>
...
	<intent-filter>
	    <action android:name="android.intent.action.VIEW" />
	    <category android:name="android.intent.category.DEFAULT" />
	    <category android:name="android.intent.category.BROWSABLE" />
	    <data android:scheme="{scheme}" android:host="{host}" android:path="{path}" />
	</intent-filter>
</主Activity>
```


####1.3.6 配置完成
至此，我们已经完成了 GameBegin SDK 的导入与配置。此时，连上 Android 手机或虚拟机，就可以正常的运行 Demo 项目。

>在导入项目的过程中，我们需要确保导入的 jar 包应保持一致，否则将出现包冲突错误。其中最常见包冲突错误的是 `android-support-v4.jar`。
>如果发现 android-support-v4.jar 冲突了，可以复制 `facebook/libs` 下的 android-support-v4.jar 替换其他项目中的包即可。


###1.4 添加必要的代码

需要在主 Activity 中实现部分方法。

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    //调用GB方法
    GameBegin.onActivityResult(requestCode, resultCode, data);
    super.onActivityResult(requestCode, resultCode, data);
}

@Override
public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    GameBegin.onRequestPermissionsResult(requestCode, permissions, grantResults);
}
    
@Override
protected void onStart() {
    super.onStart();
    GameBegin.onStart(activity);
}

@Override
protected void onResume() {
    super.onResume();
    GameBegin.onResume(activity);
}

@Override
protected void onPause() {
    super.onPause();
    GameBegin.onPause(activity);
}

@Override
protected void onStop() {
    super.onStop();
    GameBegin.onStop(activity);
}

@Override
protected void onDestroy() {
    super.onDestroy();
    GameBegin.onDestroy(activity);
}
```

##二、GameBegin SDK 功能

GameBegin SDK 功能调用过程
![](http://ou8yjaa9w.bkt.clouddn.com/a49b095f12ab01f38f56ab8bb4565d2a.jpg)


**说明与建议：**
1. 请在 `onCreate` 方法中初始化 GB SDK；
2. GB 更新功能为可选，可提供用户强制更新，更新地址可配置；
3. 如需要悬浮功能助手，在登录的回调中开启。除`单机游戏`外，建议判断成功登录之后调用；
4. 在注销的回调中关闭悬浮功能助手。


###2.1 初始化 SDK（必须）

1) 方法定义

```java
public static GameBegin getInstance(
	Context context, String gameId, String sdkSecret,
	String gameLang, boolean isDebug, boolean printLog)

public static GameBegin getInstance(
	Context context, String gameId, String sdkSecret,
    int gameType, String gameLang, boolean isDebug, boolean printLog)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|gameId|游戏Id，String|GB 提供|
|sdkSecret|SDK 接口密钥，String|GB 提供|
|gameType|（可选）游戏类型，int|设置此参数为单机游戏时，调用登录，会分自动分配账号，而不会弹出登录窗口。<br/>GameBegin.GAME_TYPE_NET 网络游戏（默认值）<br/> GameBegin.GAME_TYPE_SINGLE 单机游戏|
|gameLang|语言版本，String|GBLanguage.EN  英语<br/>GBLanguage.ZH_CN  简体中文 <br/>GBLanguage.ZH_HK 繁体中文 <br/> GBLanguage.JA 日语 <br/>GBLanguage.TH 泰语 <br/> GBLanguage.VI 越南语 <br/> GBLanguage.ID 印尼语<br/>|
|isDebug|是否开启调试模式，boolean|发布时请去设置为 false<br/>调试时服务端为: http://edit.gamebegin.com <br/>正式服务器: http://www.gamebegin.com|
|printLog|是否打印 LOG，boolean|为调试用途|

3) 代码示例

```java
GameBegin gameBegin;

Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    boolean isDebug = true; //修改测试环境地址
    boolean printLog = true; //修改控制台SDK log输出

    //初始化GameBeginSDK
    gameBegin = GameBegin.getInstance(this, "1",
	    "R6OxTL2YaCM0yzrU", "sc", isDebug, printLog);
    //设置注销监听器
    gameBegin.setLogoutListener(new GBListener() {
        @Override
        public void afterLogout() {
            ShowMessage("After Logout");
        }
    });
    //初始化退出弹窗
    GameBegin.initExitDialog("退出", "确定退出？", "确定", new ExitDialogListener() {
        @Override
        public void onClick() {
            Log.d("demo", "确定.. click");
        }
    }, "取消", new ExitDialogListener() {
        @Override
        public void onClick() {
            Log.d("demo", "取消.. click");
        }
    });
```
> 初始化时，需要传入语言参数，切换语言，可以使用 `GameBegin.setLanguage(String Language)` 方法，参数参考初始化方法中的语言参数部分。


###2.2 登录接口（必须）

1) 方法定义

```java
public void login(Context context, GBListener listener)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|listener|回调监听对象，GBListener|重写 afterLogin 方法|


回调参数

|参数|说明|备注|
|---|---|---|
|uid|用户id，int||
|username|用户名，String||
|token|授权 token，String||

3) 代码示例

```java
//登录
gameBegin.login(activity, new GBListener() {
    @Override
    public void afterLogin(int uid, String username, String token) {
        ShowMessage("After Login|uid:"+uid+", username:"+username+", token:"+token);
    }
});
```

###2.3 注销接口（必须）

1) 方法定义

```java
public void logout(Context context)
```

> 注销接口的回调对象设置方法是独立的，请尽量跟在初始化方法后面进行设置，参考 `2.1.3 代码示例`

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||

回调参数：无

3) 代码示例

```java
//注销接口回调对象的设置，请尽量跟在初始化方法后面，参考 2.1.3 代码实例中的写法
gameBegin.setLogoutListener(new GBListener() {
    @Override
    public void afterLogout() {
        ShowMessage("After Logout");
    }
});

//注销
gameBegin.logout(activity);
```

###2.4 支付接口（必须）

1) 方法定义
支付接口目前提供两种调用方式。

1) 无回调监听

```java
public void charge(String productId, int quantity, String callbackInfo)
```

2) 有回调监听

```java
public void charge(String productId, int quantity,
	String callbackInfo, ChargeDialogListener listener)
```

>回调对象参数设置为 null 与无回调监听的效果一样。

2) 参数说明

|参数|说明|备注|
|---|---|---|
|productId|商品id，String|GP 后台对应的值，当值为 `"0"` 时，为散充|
|quantity|数量，int|一般情况下，设置为 1 即可|
|callbackInfo|服务端透传参数，String|服务端回调使用。如果不需要，可置为空串，如果有多个参数，有一个思路是可以进行一次可逆设置，比如对多个参数进行 Base64 处理。|
|listener|回调监听器，ChargeDialogListener|回调的监听器，提供关闭窗口后的回调方法：afterClose(String result)|
>**callbackInfo 说明**
>callbackInfo 为服务端透传参数，可以让作为一种客户端与服务端的请求安全校验。
>当完成充值之后，GameBegin 服务器将向游戏服务器发请求，此时请求会带上 callbackInfo。
>
>```sequence
>Game->GB SDK: charge(callbackInfo)
>GB SDK->GB Server: request(callbackInfo)
>GB Server->GB SDK: OK
>GB SDK->Game: call listener(option)
>GB Server->Game Server: charge ok(callbackInfo)
>```

回调参数

|参数|说明|备注|
|---|---|---|
|result|充值结果，String|Json 字符串，可能为 `null`，是前端提供的一个充值结果反馈。 |

>**result参数的Json对象说明**
>
>|status|message|备注|
>|---|---|---|
>|0|undefined|状态不明, 由于支付延迟等原因，无法判断支付状态|
>|1|success|支付成功, 用户完成付款操作|
>|-1|failed|支付失败，由于某些原因，充值失败|

3) 代码示例

```java

//有回调监听散充
gameBegin.charge("0", 1, "", new ChargeDialogListener() {
    @Override
    public void afterClose(String result) {
        Log.d("DEBUG_TEST", "afterclose: " + result);
    }
});
```

###2.5 设置接口（必须）

####2.5.1 onReady

游戏完成加载后，进入第一个等待用户操作的界面（通常为选服界面）。

1) 接口定义

```java
public void onReady(Context context)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||

3) 代码示例

```java
gameBegin.onReady(activity);
```

####2.5.2 onPlay

用户登录完毕，选择好服务器，开始游戏时调用，设置服务器ID以及用户信息，方便运营客服在解决用户问题时提供必要的信息。

1) 接口定义

```java
public void onPlay(Context context, Map<String, String> playMap)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|playMap|需要的键值对，Map<String, String>||

playMap中的键值为

|key|说明|
|---|---|
|SDKStatsExtra.SERVER_ID|服 ID，必须，String|
|SDKStatsExtra.ROLE_ID|角色 ID，String|
|SDKStatsExtra.ROLE_NAME|角色名，新用户可能还没角色名，可为空串，String|
|SDKStatsExtra.ROLE_LEVEL|角色等级，String|
|SDKStatsExtra.ROLE_COIN|游戏过程中获得的游戏币（如银两）余额，String|
|SDKStatsExtra.ROLE_MONEY|充值获得的货币（如元宝）余额，String|

3) 代码示例

```java
Map<String, String> playMap = new HashMap<String, String>();
playMap.put(SDKStatsExtra.SERVER_ID, "1");
playMap.put(SDKStatsExtra.ROLE_ID, "1");
playMap.put(SDKStatsExtra.ROLE_NAME, "無名少俠");
playMap.put(SDKStatsExtra.ROLE_LEVEL, "100");
playMap.put(SDKStatsExtra.GAME_COIN, "99999");
playMap.put(SDKStatsExtra.TOPUP_MONEY, "999");
gameBegin.onPlay(activity, playMap);
```

####2.5.3 onCreation

记录用户创角

1) 接口定义

```java
public void onCreation(String roleName, String role)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|roleName|用户角色名, String||
|role|角色职业，String|角色职业（游戏若无职业，可用空串）|

3) 代码示例

```java
gameBegin.onCreation("無名少俠", "法师");
```

####2.5.4 onUpdate

记录游戏热更

1) 接口定义

```java
public void onUpdate(String updateTag)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|updateTag|更新时的版本内容，String|可以是版本号，或者是某个更新的描述（若无版本号，可用空串）|

3) 代码示例

```java
gameBegin.onUpdate("3.2.1");
```

####2.5.5 onTutorialCompletion

记录用户完成新手引导

1) 接口定义

```java
public void onTutorialCompletion()
```

2) 参数说明
无

3) 代码示例

```java
gameBegin.onTutorialCompletion();
```

####2.5.6 onLevel

记录用户升级

1) 接口定义

```java
public void onLevel(int level)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|level|等级，int||

3) 代码示例

```java
gameBegin.onLevel(88);
```

####2.5.7 onBarrier

记录用户遇到障碍点

1) 接口定义

```java
public void onBarrier()
```

2) 参数说明
无

3) 代码示例

```java
gameBegin.onBarrier();
```

####2.5.8 onEvent

记录自定义事件

1) 接口定义

```java
public void onEvent(String eventName, Map<String, Object> eventValue)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|eventName|事件名，String||
|eventValue|事件值，Map&lt;String, Object&gt;||


3) 代码示例

```java
Map<String, Object> param = new HashMap<String, Object>();
param.put(SDKStatsExtra.ROLE_LEVEL, "233");
gameBegin.onEvent("WiFi链接后更新", param);
```

###2.6 平台功能接口（必须）
平台功能，二选一，具体需其，需要平台运营同学和 CP 同学商量

####2.6.1 悬浮功能助手

开启

1) 接口定义

```java
public void floatMenuOn(int startX, int startY)
```
2) 参数说明

|参数|说明|备注|
|---|---|---|
|startX|平台键初始出现的左上角 X 轴坐标，int||
|startY|平台键初始出现的左上角 Y 轴坐标，int||

3) 代码示例

```java
gameBegin.floatMenuOn(100, 100);
```

关闭

1) 接口定义

```java
public void floatMenuOff()
```

2) 参数说明
无

3) 代码示例

```java
gameBegin.floatMenuOff();
```

####2.6.2 功能弹窗

1) 接口定义

```java
public void openWebview(int type)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|type|具体需要的功能，int|WEBVIEW_TYPE_CUSTOMER=客服<br/>WEBVIEW_TYPE_BULLETIN=公告<br/> WEBVIEW_TYPE_USER=用户中心|



3) 代码示例

```java
gameBegin.openWebview(GameBegin.WEBVIEW_TYPE_CUSTOMER);
gameBegin.openWebview(GameBegin.WEBVIEW_TYPE_BULLETIN);
gameBegin.openWebview(GameBegin.WEBVIEW_TYPE_USER);
```


###2.7 更新接口（可选）

1) 接口定义

```java
public void checkUpdate(Context context, GBListener listener)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|listener|更新回调对象，GBListener|重写 afterCheckUpload 方法|

回调参数

|参数|说明|备注|
|---|---|---|
|needUpload|是否需要更新，boolean|建议在登录前先调用检测更新接口，待回调（afterCheckUpload）之后再进行判断。当需要更新时，则停止其他逻辑，不需要更新时，则开始其他逻辑。|

3) 代码示例

```java
gameBegin.checkUpdate(activity, new GBListener() {
    @Override
    public void afterCheckUpload(boolean needUpload) {
        Log.d("GB Demo", "need upload: " + needUpload);
    }
});
```

###2.8 分享接口（可选）

####2.8.1 Facebook 分享

#####FacebookShare

1) 接口定义

```java
public FacebookShare(Context context, FacebookCallback<Sharer.Result> facebookCallback)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|facebookCallback|Facebook 回调接口，FacebookCallback<Sharer.Result>|分享结束时回调。需要实现回调接口的3个方法：onSuccess、onCancel、onError。请参考 Demo 代码中实现。|

3) 代码示例

```java
FacebookCallback<Sharer.Result> facebookCallback = new FacebookCallback<Sharer.Result>() { //回调函数
    @Override
    public void onSuccess(Sharer.Result result) {
        if (result.getPostId() == null) {
            Log.d("GB Demo", "user cancel: inside cancel Button");
        } else {
            Log.d("GB Demo", "success");
        }
    }

    @Override
    public void onCancel() {
        Log.d("GB Demo", "user cancel: outside close Button");
    }

    @Override
    public void onError(FacebookException error) {
        Log.d("GB Demo", "error:" + error.getMessage());
    }
};
FacebookShare fs = new FacebookShare(activity, facebookCallback);
```

#####link

1) 接口定义

```java
link(String title, String description, String imageUrl, String url)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|title|标题，String||
|description|描述，String||
|imageUrl|图片 url，String||
|url|链接 url，String||


3) 代码示例

```java
fs = new FacebookShare(activity, facebookCallback);
fs.link("Hello Facebook",
	"This is a Tester for Facebook sharing.",
	"http://cdn.gamebegin.com/resource/root/images/tmp/ttxximg.jpg",
	"http://developers.facebook.com/android");
```
#####photo

1) 接口定义

```java
public void photo(String imagePath) throws FacebookNotInstalledException
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|imagePath|图片的路径，String||

3) 异常

|异常|说明|备注|
|---|---|---|
|FacebookNotInstalledException|未安装 Facebook 异常|因为 Facebook 图片分享需要调用 Facebook 应用的支持，所以必须要验明 Android 中是否已安装|

3) 代码示例

```java
fs = new FacebookShare(activity, facebookCallback);
//Facebook图片分享需要安装Facebook才能调用。
try {
    fs.photo("/storage/sdcard0/Download/test.jpg");
} catch (FacebookNotInstalledException e) {
    AlertDialog.Builder builder = new AlertDialog.Builder(activity);
    builder.setMessage(e.getMessage());
    builder.setTitle("Tip");
    builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialog, int which) {
            dialog.dismiss();
        }
    });
    builder.create().show();
}
```

####2.8.2 微信分享

##### WXShare

1) 接口定义

```java
public WXShare(Context context, boolean checkSignature, WXCallbackListener listener)
```
2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|checkSignature|是否校验签名，boolean|是否需要开启微信官方API的签名校验，默认设置为true就可以。|
|listener|回调接口，WXCallbackListener|分享结束时回调。需要实现回调接口的call方法。`另外需要进行微信的回调方法设置`|

3) 代码示例

```java
WXShare wxShare = new WXShare(activity, true, new WXCallbackListener() {
    @Override
    public void call(final int code, final String msg) {
        String ret = "微信分享(code:" + code + ", msg:" + msg + ")";
        Log.d("wx", ret);
    }
});
```

4) 微信回调设置
微信的回调需要做额外的设置。
a. 在你的包名相应目录下新建一个wxapi目录，并在该wxapi目录下新增一个WXEntryActivity类，该类继承自Activity（例如应用程序的包名为com.gb.android.trivialdrivesample2，则新添加的类如下图所示）
![](http://ou8yjaa9w.bkt.clouddn.com/37fd59e9ddef3c79a9b9f183f8fcb507.jpg)


并在 manifest 文件里面加上 exported 属性，设置为 true，例如：

```xml
<activity
    android:name=".wxapi.WXEntryActivity"
    android:exported="true"
    android:label="@string/app_name" />
```

b. 在 WXEntryActivity 实现中调用 GB 的微信接口方法（可以参考 Demo 中的实现）：

```java
public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //请调用此方法
        WXCallback.onCreate(this);
    }

    // 第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
    @Override
    public void onResp(BaseResp resp) {
        //请调用此方法
        WXCallback.onResp(this, resp);
        finish();
    }

    @Override
    public void onReq(BaseReq arg0) {

    }
}
```

> 注意
如果需要混淆代码，为了保证 sdk 的正常使用，需要在 proguard.cfg 加上下面配置：
-keep class com.tencent.mm.sdk.** { *; }

#####sendText

分享文本

1) 接口定义

```java
public void sendText(String text)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|text|分享的文本，String||

3) 代码示例

```java
wxShare.sendText("Hello World!");
```
#####sendImage

分享图片

1) 接口定义

```java
public boolean sendImage(Bitmap bitmap)
public boolean sendImage(File file)
public boolean sendImage(String imageUrl)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|bitmap/file/imageUrl|3个重载参数||

3) 代码示例

```java
Bitmap bitmap = BitmapFactory.decodeFile(Environment.getExternalStorageDirectory().getPath() + "/DCIM/Camera/aaa.jpg");
wxShare.sendImage(bitmap);

wxShare.sendImage(new File(Environment.getExternalStorageDirectory().getPath() + "/DCIM/Camera/aaa.jpg"));

wxShare.sendImage("http://cdn.gamebegin.com/resource/attached/image/20150928/20150928172820_44508.jpg");
```

####2.8.3 系统分享

#####ShareBuilder

1) 接口定义

```java
public ShareBuilder(Context context, String shareType)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|shareType|分享到哪个应用，String|默认提供一些常量表示具体应用|

shareType

|key|说明|
|---|---|
|SHARE_TYPE_INSTAGRAM|Instagram|
|SHARE_TYPE_LINE|Line|
|SHARE_TYPE_TWITTER|Twitter|
|SHARE_TYPE_WECHAT|微信|

#####show

1)接口定义

```java
public boolean show(String subject, String text, String path)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|subject|主题，String||
|text|内容，String||
|path|图片路径，String||

3) 返回值

|类型|说明|备注|
|---|---|---|
|boolean|是否存在此应用||

代码示例

```java
ShareBuilder shareBuilder = new ShareBuilder(activity,
	ShareBuilder.SHARE_TYPE_INSTAGRAM);
shareBuilder.show("subject", "message", 
	"/storage/sdcard0/Download/test.jpg");
```

###2.9 FB邀请接口（可选）

1) 接口定义

```java
public void invite(Context context, GBListener listener)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|context|上下文，Context||
|listener|回调监听器，GBListener|使用时，需要重载 afterFBInvite(String result) 方法，<br/>result：success\|canceled\|FB Invite Error: %s"(出错时)|

3) 代码示例

```java
gameBegin.invite(activity, new GBListener() {
    @Override
    public void afterFBInvite(String result) {
        Log.d(TAG, result);
    }
});
```

###2.10 FB粉丝页点赞接口（可选）

点赞功能，直接使用了 Facebook SDK 中的控件。

1) 控件使用
Layout文件中设置：

```xml
<com.facebook.share.widget.LikeView
     android:id="@+id/like_page"
     android:layout_width="wrap_content"
     android:layout_height="wrap_content"
     android:layout_gravity="center_horizontal"
     android:layout_margin="5dp"/>
```

调用控件：

```java
//设置回调函数
GameBegin.setAfterFBLikeListener(new GBListener() {
    @Override
    public void afterFBLike(String isLiked, String userGesture) {
        Log.d(TAG, "isLiked:" + isLiked + ", userGesture:" + userGesture);
    }
});

LikeView likeView = (LikeView) findViewById(R.id.like_page);
likeView.setObjectIdAndType(GameBegin.getFBFansPage(), LikeView.ObjectType.PAGE);
```


2) 方法参数说明

GameBegin.setAfterFBLikeListener：

|参数|说明|备注|
|---|---|---|
|listener|回调监听器，GBListener|使用时，需要重载 afterFBLike(String isLiked, String userGesture) 方法。<br/>isLiked(当前FB帐户是否已点赞)：liked \| unliked \| unknow<br/>userGesture(用户此次的操作)：liked \| cancel \| unliked|

3) 代码示例

```java
gameBegin.invite(activity, new GBListener() {
    @Override
    public void afterFBInvite(String result) {
        Log.d(TAG, result);
    }
});
```

###2.11 Google play game services

Google play game services 是 Google Play 推荐的功能，类似 AppStore 的 Game Center。

####2.11.1 Achievement 成就系统

具体的成就，需要平台运营同学与CP同学商定之后设定。

解锁成就

1) 接口定义

```java
//直接解锁某项成就
public void googleUnlockAchievement(String achievementId)
//当一项成就中需要多步完成时，需要使用googleIncrementAchievement来解锁每一步，所有步数完成时，自动解锁此项成就
public void googleIncrementAchievement(String achievementId, int step)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|achievementId|成就Id，String|成就Id会放在 SDK/values 的文件下，将其放置到游戏项目中后，即可使用|
|step|完成了某项成就的步数，int|所有步数完成时，自动解锁此项成就|


3) 代码示例

```java
gameBegin.googleUnlockAchievement(getString(R.string.achievement_1));
//表示完成了某一项成就中的一步
gameBegin.googleIncrementAchievement(getString(R.string.achievement_1), 1);
```

显示成就

1) 接口定义

```java
public void googleShowAchievements(Activity activity)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|activity|活动，Activity|一般为当前调用的 Activity|

3) 代码示例

```java
gameBegin.googleShowAchievements(MainActivity.this);
```

####2.11.2 Leaderboard 排行榜

提交某个排行榜的分数

1) 接口定义

```java
public void googleSubmitScore(String leaderboardId, long score)
```
2) 参数说明

|参数|说明|备注|
|---|---|---|
|leaderboardId|排行榜id，String|排行榜Id会放在 SDK/values 的文件下，将其放置到游戏项目中后，即可使用|
|score|分数，long||

3) 代码示例

```java
gameBegin.googleSubmitScore(getString(R.string.leaderboard_total_score), 1024);
```

显示某个排行榜

1) 接口定义

```java
public void googleShowLeaderboard(Activity activity, String leaderboardId)
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|activity|活动，Activity|一般为当前调用的 Activity|
|leaderboardId|排行榜id，String|排行榜Id会放在 SDK/values 的文件下，将其放置到游戏项目中后，即可使用|

3) 代码示例

```java
gameBegin.googleShowLeaderboard(MainActivity.this, getString(R.string.leaderboard_total_score));
```


###2.12 APP 退出（可选）

1) 接口定义

```java
//初始化退出弹窗
public static void initExitDialog(
		String title, String message, 
		String positiveText, ExitDialogListener positiveListener, 
		String negativeText, ExitDialogListener negativeListener)
//显示退出弹窗，请参考 demo 中的代码
public static void showExitDialog()
```

2) 参数说明

|参数|说明|备注|
|---|---|---|
|title|标题，String||
|message|内容，String||
|positiveText|确定按键文本，String||
|positiveListener|确定按按键听器, ExitDialogListener|实现 onClick 方法|
|negativeText|取消按键文本，String||
|negativeListener|取消按键听器, ExitDialogListener|实现 onClick 方法|

3) 代码示例

```java
//初始化退出弹窗
GameBegin.initExitDialog("退出", "确定退出？", "确定", new ExitDialogListener() {
    @Override
    public void onClick() {
        Log.d("demo", "确定.. click");
    }
}, "取消", new ExitDialogListener() {
    @Override
    public void onClick() {
        Log.d("demo", "取消.. click");
    }
});
```

##三、附录

###3.1 Google Play 扩展文件

Google Play 规定如果应用包大于50M（现已改为100M），则需要使用其扩展文件形式。Google Play 提供扩展文件免费托管服务，每个扩展文件最大上限为2G。

相关资料：

1、	APK Expansion Files：
[http://developer.android.com/intl/zh-cn/google/play/expansion-files.html](http://developer.android.com/intl/zh-cn/google/play/expansion-files.html)

2、	使用和添加扩展文件：
[https://support.google.com/googleplay/android-developer/answer/2481797?hl=zh-Hans](https://support.google.com/googleplay/android-developer/answer/2481797?hl=zh-Hans)

3、	APK 扩展文件及使用：
[http://blog.csdn.net/myarrow/article/details/7760579](http://blog.csdn.net/myarrow/article/details/7760579)

4、Android APK扩展文件：
[http://zhixinliu.com/2015/03/13/2015-03-13-Androir-expansion-file/](http://zhixinliu.com/2015/03/13/2015-03-13-Androir-expansion-file/)




