//app.js
const WXAPI = require('apifm-wxapi');
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function(options){
    // 给api设置专属域名
    WXAPI.init(this.globalData.subDomain);
  },
  handleDestruction(res) {
    const {
      data = []
    } = res; // 设默认值为 [] 以免获取数据失败时发生错误
    return data;
  },
  onShow: function(options){

  },
  onHide: function(){

  },
  onError: function(msg){

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options){

  },
  globalData: {
    subDomain: "lemo"
  }
});