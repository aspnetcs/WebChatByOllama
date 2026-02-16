// pages/login/login.js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginStatus: 'checking', // checking, logged_in, not_logged_in
    userInfo: null
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp();
    
    if (app.globalData.isLoggedIn) {
      // 已登录，跳转到首页
      wx.redirectTo({
        url: '/pages/index/index'
      });
    } else {
      // 未登录，显示登录按钮
      this.setData({
        loginStatus: 'not_logged_in'
      });
    }
  },

  // 微信登录
  wechatLogin: function() {
    const app = getApp();
    
    wx.showLoading({
      title: '登录中...'
    });

    app.doLogin((success) => {
      wx.hideLoading();
      
      if (success) {
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          // 使用 wx.navigateBack 返回到上一个页面（首页）
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack({
              delta: 1
            });
          } else {
            // 如果没有上一个页面，直接跳转到首页
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        }, 1000);
      } else {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 获取用户信息（可选）
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      const app = getApp();
      app.globalData.userInfo = e.detail.userInfo;
      
      this.setData({
        userInfo: e.detail.userInfo
      });
      
      // 可以将用户信息上传到服务器
      this.uploadUserInfo(e.detail.userInfo);
    }
  },

  // 上传用户信息到服务器（模拟）
  uploadUserInfo: function(userInfo) {
    // 这里可以将用户信息上传到后端服务器
    console.log('上传用户信息:', userInfo);
  }
});