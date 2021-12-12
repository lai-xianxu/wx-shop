// pages/cart/index.js
// pages/cart/index.js
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
        address: {},
        cart: [],
        totalPrices: 0,
        totalNum: 0,
    },

    
    /**
     * 生命周期函数--监听页面显示
     */
     onLoad: function (options) {
        // 1 获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        this.setData({
            address
        })
        //  判断是否从详情页跳转
        let goodsObj = []
        console.log(options.type == 1,'optionsoptions');
        if (options.type == 1) {
            goodsObj.push(wx.getStorageSync('goodsInfo'))
            this.setData({
                cart: goodsObj,
                totalPrices: goodsObj[0].basicInfo.minPrice,
                totalNum: 1
            });
        } else {
            // 1 获取缓存中的购物车数据
            let cart = wx.getStorageSync("cart") || [];
            // 过滤后的购物车数组
            cart = cart.filter(v => v.checked);
            this.setGoods(cart)
         }
        // const eventChannel = this.getOpenerEventChannel()
        // // 监听fresh事件，获取上一页面通过eventChannel传送到当前页面的数据
        // eventChannel.on('fresh', function (data) {
        //     goodsObj.push(data.data)
        // })

    },
    // 处理地址、商品、总价等
    setGoods(shop){
        // 1 总价格 总数量
        let totalPrices = 0;
        let totalNum = 0;
        shop.forEach(v => {
            totalPrices += v.num * v.basicInfo.minPrice;
            totalNum += v.num;
        })
        this.setData({
            cart: shop,
            totalPrices,
            totalNum,
        });
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

    // 支付
    async handleOrderPay() {
        // 1 判断缓存中有没有token 
        const token = wx.getStorageSync("token");
        // 2 判断
        if (!token) {
          AUTH.login();
          return;
        }
        // 判断有没有收货地址
        let addressL = Object.keys(this.data.address).length
        if (!addressL) {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none',
              });
          return;
        }
        const order_price = this.data.totalPrice;
        const address = this.data.address;
        const cart = this.data.cart;
        let goods = [];
        cart.forEach(v => goods.push({
          goodsId: v.basicInfo.id,
          number: v.num || 1,
          propertyChildIds: "",
          logisticsType: 0
        }))
    
        // 创建订单参数
        let postData = {
          token: token,
          goodsJsonStr: JSON.stringify(goods),
          address: address.all,
          linkMan: address.userName,
          mobile: address.telNumber,
          provinceId: '110000000000',
        //   provinceId: address.nationalCode,
          cityId: '110100000000',
        //   cityId: address.postalCode,
          code: '322000'
        //   code: address.postalCode
        };
        await this.CreateOrder(postData);
        wx.navigateTo({
          url: '/pages/order/index?type=0'
        });
    },

    // 创建订单
    async CreateOrder(params) {
        await WXAPI.orderCreate(params).then(function (res) {
            console.log(res,'resresres');
            if (res.code != 0) {
                wx.showModal({
                    title: '错误',
                    content: res.msg,
                    showCancel: false
                })
            return;
            }
            // wx.requestPayment({
            //     timeStamp: '',
            //     nonceStr: '',
            //     package: '',
            //     signType: '',
            //     paySign: '',
            //     success: (result) => {
                    
            //     },
            //     fail: () => {},
            //     complete: () => {}
            // });
              
        })
        // wx.removeStorageSync('single');
        this.clearPayProduct();

          
    },

    // 清除购物车已支付缓存
    clearPayProduct() {
        let cartTotal = wx.getStorageSync('cart') || [];
        let newCart = cartTotal.filter(val => val.checked === false)
        wx.setStorageSync('cart', newCart);
    },
})