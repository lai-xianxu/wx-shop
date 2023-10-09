let ajaxTimes = 0
export const request = (params) => {
    ajaxTimes++
    // 加载中图标
    wx.showLoading({
        title: '加载中',
        mask: true
    })

    const baseUrl = 'https://api.it120.cc/lemo'
    return new Promise ((resolve,reject) => {
        wx.request({
            ...params,
           url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.data)
            },
            fail: (err) => {
                reject(err)
            },
            complete:() => {
                ajaxTimes--
                if(ajaxTimes == 0) {
                    // 关闭加载中图标
                    wx.hideLoading()
                }
            }
            
        });
          
    })
}