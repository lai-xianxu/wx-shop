// pages/goods_detail/index.js
const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        goodsDetail: null,
        isCollect: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
     onShow: function (options) {
        // 获取当前小程序的页面栈
        let pages = getCurrentPages();
        // 数组中索引最大的页面--当前页面
        let currentPage = pages[pages.length - 1];
        console.log(currentPage);
        const id = currentPage.options.id
        this.getGoodsDetail(id);
    },
    // 获取商品详情数据
    getGoodsDetail(id){
        request({ 
            url: "/shop/goods/detail",
            data: {
                id
            }
        }).then(result => {
            console.log(result,'resultresult');
            this.GoodsInfo = result;
            // 判断是否被收藏
            let collect = wx.getStorageSync('collect') || [];
            let isCollect = collect.some(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);

            this.setData({
                goodsObj: {
                    goods_name: result.basicInfo.name,
                    goods_price: result.basicInfo.minPrice,
                    goods_introduce: result.content,
                    pics: result.pics,
                    base_info_id: result.basicInfo.id
                  },
                  isCollect,
                  goodsDetail: result.content.replace(/\<img/g,'<img style="width:100%;height:auto;display:block"')
            })
        })
    },
    // 预览图片
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pic);
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
          current,
          urls,
        });
      },
    //   添加到购物车
      handleAddCart() {
        // 1 判断缓存中有没有token 
        const token = wx.getStorageSync("token");
        AUTH.checkHasLogined().then(isLogined => {
          console.log(isLogined);
          if (!isLogined) {
              wx.showModal({
                  title: '提示',
                  content: '您还没登录，请先登录',
                  success (res) {
                    if (res.confirm) {
                      wx.getUserProfile({
                          desc: "获取用户信息",
                          success: (res) => {
                            const {
                              userInfo
                            } = res;
                            wx.setStorageSync("userinfo", userInfo);
                            AUTH.login()
                          },
                          fail: () => {
                              wx.navigateBack({
                                  delta: 1
                              })
                          },
                        })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
              })
          } else {
            let cart = wx.getStorageSync('cart') || [];
            let index = cart.findIndex(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);
            if (index === -1) {
            // 不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo)
            } else {
            // 已存在购物车数据， 当前商品的数量
            cart[index].num++;
            }
            wx.setStorageSync('cart', cart);
            wx.showToast({
            title: '加入成功',
            icon: 'success',
            });
          }
        })
      },
    
    // 跳转购物车
    handleJumpCart(){
      wx.switchTab({
        url: '/pages/cart/index',
        // 解决二次跳转tabbar页面不刷新问题
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    },
    onClickButton() {
      // 1 判断缓存中有没有token 
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.showModal({
            title: '提示',
            content: '您还没登录，请先登录',
            success (res) {
              if (res.confirm) {
                wx.getUserProfile({
                  desc: "获取用户信息",
                  success: (res) => {
                    const {
                      userInfo
                    } = res;
                    wx.setStorageSync("userinfo", userInfo);
                    AUTH.login()
                  },
                  fail: () => {
                    wx.showToast({
                      title: '获取用户信息失败',
                      icon: 'none',
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
        })
        return;
      }
      const that = this
      wx.navigateTo({
        url: '/pages/pay/index?type=1'
        // success: function (res) {
        //   //跳转pay页要执行的方法
        //   res.eventChannel.emit('fresh', { data: that.GoodsInfo })
        // }
      })
      wx.setStorageSync('goodsInfo', this.GoodsInfo)
    },

      // 点击 收藏商品
  handleCollect() {
    // 1 判断缓存中有没有token 
    const token = wx.getStorageSync("token");
    AUTH.checkHasLogined().then(isLogined => {
      console.log(isLogined);
      if (!isLogined) {
          wx.showModal({
              title: '提示',
              content: '您还没登录，请先登录',
              success (res) {
                if (res.confirm) {
                  wx.getUserProfile({
                      desc: "获取用户信息",
                      success: (res) => {
                        const {
                          userInfo
                        } = res;
                        wx.setStorageSync("userinfo", userInfo);
                        AUTH.login()
                      },
                      fail: () => {
                          wx.navigateBack({
                              delta: 1
                          })
                      },
                    })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
          })
      } else {
        let isCollect = false;
        let collect = wx.getStorageSync('collect') || [];
        let index = collect.findIndex(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);

        if (index !== -1) {
          collect.splice(index, 1);
          isCollect = false;
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
        } else {
          collect.push(this.GoodsInfo);
          isCollect = true;
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
        }
        wx.setStorageSync('collect', collect);
        this.setData({
          isCollect
        });
      }
    })
  },
})