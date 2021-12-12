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
        userinfo: {},
        collectNums: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
     onShow(options) {
         const pages = getCurrentPages()
         console.log(pages[pages.length - 1].route, 'abcd')
        this.login()
    },

    // 登录
    login(){
        // 1 判断缓存中有没有token 
        let that = this
        const token = wx.getStorageSync("token");
        AUTH.checkHasLogined().then(isLogined => {
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
                              console.log(userInfo, 'userInfo')
                              wx.setStorageSync("userinfo", userInfo);
                              AUTH.login().then(res => {
                                console.log(res, 'resss11111')
                                that.setData({
                                    userinfo: userInfo
                                })
                              }).catch(err => {})
                            },
                            fail: () => {
                            },
                          })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                })
            } else {
                this.setData({
                    userinfo: wx.getStorageSync('userinfo')
                })
                // 获取缓存商品数列
                const collect = wx.getStorageSync("collect") || [];
                console.log(collect,'collectcollect');
                this.setData({
                    collectNums: collect.length,
                })
            }
        })
    },
    // 点击 收货地址
    handleChooseAddress() {
        // wx.chooseAddress
        wx.chooseAddress({
            success: (result) => {
                let address = result
                address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
                this.setData({
                    address
                })
                // 5 存入到缓存中
                wx.setStorageSync("address", address);
            },
        });
    },
    // 意见反馈
    feedback(){
    }
})