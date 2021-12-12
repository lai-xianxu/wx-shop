const WXAPI = require('apifm-wxapi');
import regeneratorRuntime from '../lib/runtime/runtime';


async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}


async function login() {
    console.log('登录');
    const that = this
    return new Promise ((resolve,reject) => {
      wx.login({
        timeout:10000,
        success: (res) => {
          WXAPI.login_wx(res.code).then(function (res) {
            if (res.code == 10000) {
              // wx.showModal({
              //   title: '没注册',
              //   content: res.msg,
              //   showCancel: false
              // })
              // 去注册
              that.register()
              reject()
              // return;
            }
            if (res.code != 0) {
              reject()

                // 登录错误
                wx.showModal({
                    title: '无法登录',
                    content: res.msg,
                    showCancel: false
                })
                return;
            }
            wx.showToast({
              title: '登录成功',
              icon: 'success',
            });
            wx.setStorageSync('token', res.data.token)
            resolve()
              // wx.setStorageSync('uid', res.data.uid)
          })
        },
        fail: (err) => {
          console.log(err, 'errr')
          reject(err);
        }
      });
    });
    
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
    console.log('检测');
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function register() {
    console.log('注册');
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      console.log(code, '<-code->');
      // wx.getUserInfo({
      //   success: function (res) {
      //     console.log(res,'kkkkkkkkkkkkkkkkk');
      //     let iv = res.iv;
      //     let encryptedData = res.encryptedData;
          // let referrer = '' // 推荐人
          // let referrer_storge = wx.getStorageSync('referrer');
          // if (referrer_storge) {
          //   referrer = referrer_storge;
          // }
          // 下面开始调用注册接口
          WXAPI.register_simple({
            code: code
            // encryptedData: encryptedData,
            // iv: iv,
            // referrer: referrer
          }).then(function (res) {
            _this.login();
          })
      //   }
      // })
    }
  })
}

function onShow(e) {
  // 自动登录
  checkHasLogined().then(isLogined => {
    if (!isLogined) {
      login()
    }
  })
}


async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e) {
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e) {
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e) {
        console.error(e)
        reject(e)
      }
    })
  })
}


module.exports = {
  checkHasLogined: checkHasLogined,
  login: login,
  register: register,
  checkAndAuthorize: checkAndAuthorize,
}