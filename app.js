// app.js
const config = require('./config.js');
const towxml = require('./towxml/index');

App({
    onLaunch() {
      // 小程序启动逻辑
      this.checkLoginStatus();
    },
    globalData: {
      userInfo: null,
      // 添加用户登录相关状态
      openid: null, // 用户唯一标识
      sessionKey: null, // 会话密钥
      isLoggedIn: false, // 登录状态
      loginCallback: null // 登录回调函数
    },
    towxml: towxml,
    
    // 检查登录状态
    checkLoginStatus: function() {
      const openid = wx.getStorageSync('openid');
      const sessionKey = wx.getStorageSync('sessionKey');
      
      if (openid && sessionKey) {
        // 检查会话是否过期（这里简单检查是否存在，实际应用中应检查时间戳）
        this.globalData.openid = openid;
        this.globalData.sessionKey = sessionKey;
        this.globalData.isLoggedIn = true;
      } else {
        // 未登录状态
        this.globalData.isLoggedIn = false;
      }
    },
    
    // 执行登录
    doLogin: function(callback) {
      const that = this;
      
      wx.login({
        success: function(res) {
          if (res.code) {
            // 这里应该调用后端接口获取openid和session_key
            // 模拟调用后端接口
            that.requestLogin(res.code, callback);
          } else {
            console.error('获取用户登录态失败！' + res.errMsg);
            if (callback) callback(false);
          }
        },
        fail: function(err) {
          console.error('微信登录失败！', err);
          if (callback) callback(false);
        }
      });
    },
    
    // 请求后端登录接口
    requestLogin: function(code, callback) {
      const that = this;
      
      // 使用config.js中的登录URL
      wx.request({
        url: config.loginUrl, // 使用config.js中定义的登录URL
        method: 'POST',
        data: {
          code: code
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.success) {
            // 登录成功，保存用户信息
            const openid = res.data.openid;
            const sessionKey = res.data.session_key;
            
            // 保存到本地存储
            wx.setStorageSync('openid', openid);
            wx.setStorageSync('sessionKey', sessionKey);
            
            // 更新全局状态
            that.globalData.openid = openid;
            that.globalData.sessionKey = sessionKey;
            that.globalData.isLoggedIn = true;
            
            // 获取用户信息（如果需要）
            wx.getUserProfile({
              desc: '用于完善用户资料',
              success: (profileRes) => {
                that.globalData.userInfo = profileRes.userInfo;
              },
              fail: (err) => {
                console.log('获取用户信息失败，使用默认信息');
                // 即使获取失败也继续登录流程
              }
            });
            
            if (callback) callback(true);
          } else {
            console.error('后端登录失败：', res.data.message);
            if (callback) callback(false);
          }
        },
        fail: function(err) {
          console.error('请求后端登录接口失败：', err);
          if (callback) callback(false);
        }
      });
    },
    
    // 获取用户数据存储键
    getUserStorageKey: function(baseKey) {
      if (this.globalData.isLoggedIn && this.globalData.openid) {
        return `${baseKey}_${this.globalData.openid}`;
      }
      return baseKey; // 未登录时使用原键名（兼容模式）
    },
    
    // 退出登录
    logout: function() {
      wx.removeStorageSync('openid');
      wx.removeStorageSync('sessionKey');
      
      this.globalData.openid = null;
      this.globalData.sessionKey = null;
      this.globalData.isLoggedIn = false;
    }
  })