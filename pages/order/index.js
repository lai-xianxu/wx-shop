// pages/order/index.js
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
        active: 0,
        hasRefund: false,
        orderList: [],
        logisticsMap: {},
        goodsMap: {}
        // tabClass: ["", "", "", "", ""]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            active: options ? options.type : 0
        })
        this.doneShow()
    },

    // tab值改变
    onChange(name){
        this.setData({
            active: name.detail.name
        })
    },

    // 获取订单列表
    doneShow() {
        var that = this;
        // var postData = {
        //     token: wx.getStorageSync('token')
        // };
        // postData.hasRefund = that.data.hasRefund;
        // if (!postData.hasRefund) {
        //     postData.status = that.data.active;
        // }
        // this.getOrderStatistics();
        WXAPI.orderList({
            status: 0,
            token: wx.getStorageSync('token')
        }).then(function (res) {
            if (res.code == 0) {
                const orderList = res.data.orderList
                res.data.orderList.forEach(item => {
                    const shopList = res.data.goodsMap
                    const address = res.data.logisticsMap
                    for(let k in shopList) {
                        if(k == item.id) {
                            item['goods'] = shopList[k][0]
                        }
                    }
                    for(let m in address) {
                        if(m == item.id) {
                            item['address'] = address[m]
                        }
                    }
                })
                that.setData({
                    orderList: orderList,
                    logisticsMap: res.data.logisticsMap,
                    goodsMap: res.data.goodsMap
                });
            } else {
                that.setData({
                    orderList: [],
                    logisticsMap: {},
                    goodsMap: {}
                });
            }
        })
    },

    // 订单统计
    // getOrderStatistics: function () {
    //     var that = this;
    //     WXAPI.orderStatistics(wx.getStorageSync('token')).then(function (res) {
    //     if (res.code == 0) {
    //         var tabClass = that.data.tabClass;
    //         if (res.data.count_id_no_pay > 0) {
    //             tabClass[0] = "red-dot"
    //         } else {
    //             tabClass[0] = ""
    //         }
    //         if (res.data.count_id_no_transfer > 0) {
    //             tabClass[1] = "red-dot"
    //         } else {
    //             tabClass[1] = ""
    //         }
    //         if (res.data.count_id_no_confirm > 0) {
    //             tabClass[2] = "red-dot"
    //         } else {
    //             tabClass[2] = ""
    //         }
    //         if (res.data.count_id_no_reputation > 0) {
    //             tabClass[3] = "red-dot"
    //         } else {
    //             tabClass[3] = ""
    //         }
    //         if (res.data.count_id_success > 0) {
    //             //tabClass[4] = "red-dot"
    //         } else {
    //             //tabClass[4] = ""
    //         }

    //         that.setData({
    //             tabClass: tabClass,
    //         });
    //     }
    //     })
    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
})