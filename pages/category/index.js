// pages/category/index.js
import { request } from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        activeIndex: 0,
        activeId: '',
        rightMenuList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {categroy} = getApp().globalData
        this.getCategoryList(categroy)
    },
    // 获取分类详情数据
    getCategoryList(categroy){
        request({ 
            url: "/shop/goods/category/all"
        }).then(result => {
            const list = []
            result.forEach(item => {
                list.push({
                    id: item.id,
                    name: item.name
                })
            })
          this.setData({
            leftMenuList: list,
            activeId: categroy ? categroy.id : list[0].id,
            activeIndex: categroy ? categroy.index : 0
          })
          this.getGoodsList()
        })
    },
     // 获取对应分类商品列表
     getGoodsList(){
        request({ 
            url: "/shop/goods/list"
        }).then(result => {
            const list = result.filter(e => e.categoryId == this.data.activeId)
          this.setData({
            rightMenuList: list
          })
        })
    },

    // 左侧菜单点击事件
    hanleItemTap(e){
        console.log(e);
        this.setData({
            activeIndex: e.currentTarget.dataset.index,
            activeId: e.currentTarget.dataset.item
        })
        this.getGoodsList()
    }
})