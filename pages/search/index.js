// pages/search/index.js
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
        goods: [],
        isFocus: false,
        value: ''
    },
    goodsList: [],

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getGoodsList()
    },
    bindChange(e){
        this.setData({
            value: e.detail
        })
    },
    handleInput(e) {
        const value = this.data.value
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false,
            })
            return;
        }
        this.setData({
            isFocus: true,
        })
        let goodsArr = [];
        if (this.goodsList.length > 0) {
            this.goodsList.map(v => {
                if (v.name) {
                    let arr = v.name.indexOf(value) >= 0 ? v : false;
                    if (arr) {
                        goodsArr.push(arr);
                    }
                }
            })
        }
        this.setData({
            goods: goodsArr,
        });
    },
    async getGoodsList() {
        await WXAPI.goods().then(res => app.handleDestruction(res))
            .then((data) => {
            this.goodsList = data;
        });
    },
    clearInput(){
        this.setData({
            isFocus: false
        });
        setTimeout(() => {
            this.setData({
                goods: []
            })
        },600)
    }
})