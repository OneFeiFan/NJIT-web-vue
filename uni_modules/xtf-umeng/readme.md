# xtf-umeng
### 导入例子
~~~
import {
initUM,UMonKillProcess,
UMonProfileSignIn,UMonProfileSignIns,UMonPageStart,UMonPageEnd,UMuserProfileMobile,
UMonEventObject,UMonProfileSignOff,UMuserProfileEMail,UMuserProfile
,UMsubmitPolicyGrantResult,UMenableImsiCollection,UMenableIccidCollection,
UMenableImeiCollection,UMenableWiFiMacCollection,onUMgetOaid,
getUMIDString
} from "@/uni_modules/xtf-umeng"
~~~



### SDK初始化
#### initUM
~~~
initUM("您的appkey","您的渠道");
~~~

### 程序退出时，用于保存统计数据的API。
如果开发者调用kill或者exit之类的方法杀死进程，或者双击back键会杀死进程
~~~
UMonKillProcess();
~~~

### 账号统计
集成账号统计
用户登录
用户账号ID，长度小于64字节

~~~
UMonProfileSignIn("123")// 用户账号ID，长度小于64字节
~~~

~~~
UMonProfileSignIns("123","weixin")// 参数1 用户账号ID，长度小于64字节   参数2 账号来源
~~~

### 用户登出

账号登出时需调用此接口，调用之后不再发送账号相关内容。
#### UMonProfileSignOff
~~~
UMonProfileSignOff();
~~~

### 设置预置用户属性(电话号码)
####  UMuserProfileMobile
~~~
UMuserProfileMobile("123xxxxxx");
~~~


### 设置预置用户属性(邮箱)
####  UMuserProfileEMail

~~~
UMuserProfileEMail("123@qq.com");
~~~

### 设置用户自定义属性
#### UMuserProfile
~~~
UMuserProfile("key","value")
~~~

### 定义页面进入
#### UMonPageStart
~~~
UMonPageStart("main")
~~~

### 定义页面退出
#### UMonPageEnd
~~~
UMonPageEnd("main")
~~~

### 自定义事件
埋点接口
自定义事件可以用于追踪用户行为，记录行为发生的具体细节。
UMonEventObject

uniapp
~~~
UMonEventObject("test",["key1","key2"],["value1","value2"])
~~~
uniappx
~~~
UMonEventObject("test",["key1","key2"] as string[],["value1","value2"] as string[])
~~~

### 采集开关接口

#### ICCID采集开关接口
##### UMenableIccidCollection
 ~~~
 UMenableIccidCollection(true);
 ~~~

#### IMSI采集开关接口
##### UMenableImsiCollection
 ~~~
 UMenableImsiCollection(true);
 ~~~


### 获取友盟id
#### getUMIDString
~~~
var id=getUMIDString();
~~~

### 获取oaid
#### onUMgetOaid
uniapp 
~~~
onUMgetOaid(function(id){
	
})
~~~

uniappx 
~~~
onUMgetOaid(function(id:string){
	
})
~~~







### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)