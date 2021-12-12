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
        allChecked: false,
        cart: [],
        totalPrices: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    
    /**
     * 生命周期函数--监听页面显示
     */
     onShow: function () {
        // 1 获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        const cartT = wx.getStorageSync("cart") || [];
        const cart = JSON.parse(JSON.stringify(cartT))

        this.setData({
            address,
        })
        // 判断商品是否全选
        this.setCart(cart)
    },
     // 商品的选中
    handeItemChange(e) {
        // 1 获取被修改的商品的id
        const goods_id = e.currentTarget.dataset.id;
        // 2 获取购物车数组 
        let { cart } = this.data;
        // 3 找到被修改的商品对象
        let index = cart.findIndex(v => v.basicInfo.id === goods_id);
        // 4 选中状态取反
        cart[index].checked = !cart[index].checked;

        this.setCart(cart);

    },

    // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        let allChecked = true
        let totalPrices = 0
        let totalNum = 0
        cart.forEach(p => {
            if(p.checked) {
                totalPrices += p.basicInfo.minPrice * p.num
                totalNum += p.num
            } else {
                allChecked = false
            }
        })
        allChecked = cart.length ? allChecked : false
        this.setData({
            cart,
            totalPrices,
            totalNum, 
            allChecked
        });
        wx.setStorageSync("cart", cart);
    },

     // 商品全选功能
    handleItemAllCheck() {
        // 1 获取data中的数据
        let { cart, allChecked } = this.data;
        // 2 修改值
        allChecked = !allChecked;
        // 3 循环修改cart数组 中的商品选中状态
        cart.forEach(v => v.checked = allChecked);
        // 4 把修改后的值 填充回data或者缓存中
        this.setCart(cart);
    },

      // 商品数量的编辑功能
    handleItemNumEdit(e) {
        // 1 获取传递过来的参数 
        const { id } = e.currentTarget.dataset;
        const newNum = e.detail
        // 2 获取购物车数组
        let { cart } = this.data;
        // 3 找到需要修改的商品的索引
        const index = cart.findIndex(v => v.basicInfo.id === id);
        // 4  进行修改数量
        cart[index].num = newNum;
        // 5 设置回缓存和data中
        this.setCart(cart);
    },

    // 删除单个购物车商品
    delItemShop(e){
        const that = this
        wx.showModal({
            title: '提示',
            content: '确定删除购物车此商品吗？',
            success (res) {
              if (res.confirm) {
                const { id } = e.currentTarget.dataset;
                // 2 获取购物车数组
                let { cart } = that.data;
                // 3 找到需要修改的商品的索引
                const index = cart.findIndex(v => v.basicInfo.id === id);
                // 删除商品
                cart.splice(index,1)
                // 5 设置回缓存和data中
                that.setCart(cart);
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
    },

    // 去往首页
    goHome(){
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

     // 点击 结算 
    handlePay(){
        // 1 判断缓存中有没有token 
        const token = wx.getStorageSync("token");
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                // wx.showModal({
                //     title: '提示',
                //     content: '您还没登录，请先登录',
                //     success (res) {
                //       if (res.confirm) {
                //         AUTH.login()
                //       } else if (res.cancel) {
                //         console.log('用户点击取消')
                //       }
                //     }
                // })
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
            }else {
                // 1 判断收货地址
                const {totalNum}=this.data;
                // if(!address.userName){
                //     await showToast({title:"您还没有选择收货地址"});
                //     return;
                // }
                // 2 判断用户有没有选购商品
                if(totalNum == 0){
                    wx.showToast({
                        title: '您还没有选择宝贝哦！',
                        icon: 'none',
                        duration: 2000
                    })
                    return ;
                }
                // 3 跳转到 支付页面
                wx.navigateTo({
                    url: '/pages/pay/index'
                });
            }
        })
        
    },

    // 获取收货地址
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
})