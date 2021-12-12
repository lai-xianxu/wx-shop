// pages/collect/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        collect: []
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onLoad(options) {
        console.log(options,'ooooooooooo');
        const collect = wx.getStorageSync('collect');
        this.setData({
          collect,
          active: options ? options.type : 0
        })
    },
    // tab值改变
    onChange(name){
        this.setData({
            active: name.detail.name
        })
    },
})