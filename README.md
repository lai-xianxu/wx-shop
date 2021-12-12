# 微信小程序电商平台

视频学习：[零基础玩转微信小程序](https://www.bilibili.com/video/av73342655?p=131)

跟着视频中老师敲了一遍，自己换了数据接口又折腾了一遍。

数据使用的是：[api工厂](https://www.it120.cc/) ，免费使用，有配套的[后台管理](https://admin.it120.cc/#/login?redirect=%2Fdashboard)，更详细的使用可以前去官网查看相关文档。

参考学习：[微信小程序商城](https://github.com/LaiXianXu/wx-shop.git)

***can not get openid***

需要在 api工厂的  微信设置-小程序设置-配置secret/AppId（secret、AppId如何获取百度一下就知道了）,  还有在项目里面全局搜索一下 appid  把我的替换成你的。


#### api工厂的使用：

1. 前往后台管理注册账户信息并登录
2. 登录后台，左侧菜单 “工厂设置” --> “数据克隆” --> “将别人的数据克隆给我”
3. 对方商户ID填写 951
4. 点击 “立即克隆” ，然后退出后台重新登录，然后在左侧菜单的商城管理便可以看到相关数据



进入到后台管理后，在首页可以查看自己的域名，初始域名为一串字符串，这样不好看的同时用着也不顺畅，可以修改为自己喜欢的字符。

然后使用api工厂的域名拼接自己的子域名在加上接口地址，就可以访问数据了。

比如我的轮播图：https://api.it120.cc/jump/banner/list

在浏览器中就可以打开并返回数据。




#### 已完成：

1. 首页页面
   - 轮播图
   - 分类列表，点击对应的分类模块，跳转至对应分类的商品
   - 商品列表，点击商品列表的某一项跳转至对应商品详情页
2. 分类页面
   -  对应的分类的商品
   - 点击商品列表项跳转到对应的商品详情页
   - 商品详情页面可以添加到购物车或收藏商品
3. 购物车页面
   -  无商品时显示默认提示信息
   - 有商品时可以通过点击按钮修改是商品数量
   - 自动计算商品价格
   - 点击结算跳转支付页面
   - 支付页面，当有默认地址时自动选择默认地址
   - 点击支付创建订单
4. 个人中心页面
   - 通过点击收藏商品按钮查看收藏商品
   - 地址管理，跳转到地址列表页面
   - 地址列表页面，可以点击创建地址信息
   - 订单列表页，可以根据不同的订单状态查看对应的订单信息




1. 使用[apifm-wxapi](https://github.com/gooking/apifm-wxapi) 模块来请求数据，写法比原先的request方法更简洁，注释掉之前的request请求代码，可以直观的看到代码量的减少。这样优化可以使项目体积减少一点，[apifm-wxapi接口文档](https://github.com/gooking/apifm-wxapi/blob/master/instructions.md) 。

   apifm-使用方法：[使用 “apifm-wxapi” 快速开发小程序](https://blog.csdn.net/abccba9978/article/details/102861340) 。按照链接里的使用方法就可以请求到数据了，但是想要使用自己后台管理的数据需要在 app.js里定义一个 变量 来接收自己的域名

   `globalData: {
   ​    subDomain: "kotoba"
     }` 

   然后在app.js的onLaunch方法中初始化
   
    `onLaunch: *function* (*options*) {
   ​    WXAPI.init(this.globalData.subDomain);
     },`， 具体信息在项目文件中都可以找着。
