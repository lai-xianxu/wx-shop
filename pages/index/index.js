//Page Object
const app = getApp()
import { request } from "../../request/index.js"
Page({
    data: {
        swiperList: [],
        categoory: [],
        goodsListLeft: [],
        goodsListright: []
    },
    //options(Object)
    onLoad: function(options){
          this.getSwiperList()
          this.getCategoryList()
          this.getGoodsList()
    },
    // 获取轮播图数据
    getSwiperList(){
        request({ 
            url: "/banner/list"
        }).then(result => {
            console.log(result,'eeeeeeeee');
          this.setData({
            swiperList: result
          })
        })
    },
    // 获取分类详情数据
    getCategoryList(){
        request({ 
            url: "/shop/goods/category/all"
        }).then(result => {
            console.log(result,'eeeeeeeee');
          this.setData({
            categoory: result
          })
        })
    },

    // 获取商品列表
    getGoodsList(){
        request({ 
            url: "/shop/goods/list"
        }).then(result => {
            console.log(result,'eeeeeeeee');
            const split = parseInt(result.length / 2) - 1
          this.setData({
            goodsListLeft: result.slice(0,split),
            goodsListright: result.slice(split,result.length - 1)
          })
          console.log(this.data.goodsListLeft);
          // 关闭下拉刷新接口
          wx.stopPullDownRefresh()
        })
    },
    // 跳转分类页对应列表
    jumpCategory(e){
      getApp().globalData.categroy = {
        id: e.currentTarget.dataset.id,
        index: e.currentTarget.dataset.index
      }
      wx.switchTab({
        url: '/pages/category/index',
        // 解决二次跳转tabbar页面不刷新问题
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    },

    onPullDownRefresh: function () {
      // 页面的数据 或者效果 重新 刷新
      this.getGoodsList()
    },
});