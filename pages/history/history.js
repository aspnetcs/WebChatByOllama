// pages/history/history.js
Page({
  data: {
    conversations: []
  },

  onLoad: function (options) {
    this.loadConversations();
  },

  onShow: function () {
    // 每次显示页面时重新加载历史记录
    this.loadConversations();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp();
    
    if (!app.globalData.isLoggedIn) {
      // 未登录，跳转到登录页面
      wx.showModal({
        title: '提示',
        content: '您需要先登录才能查看历史记录，是否前往登录？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          } else {
            // 如果用户选择取消，返回首页
            wx.navigateBack();
          }
        }
      });
      
      return false;
    }
    
    return true;
  },

  // 加载历史记录列表
  loadConversations: function() {
    // 检查登录状态
    if (!this.checkLoginStatus()) {
      return;
    }
    
    const app = getApp();
    const storageKey = app.getUserStorageKey('conversations');
    
    try {
      const chatList = wx.getStorageSync(storageKey) || [];
      
      // 格式化时间并生成预览文本
      const formattedConversations = chatList.map(item => {
        const updateTime = new Date(item.updateTime);
        const updateTimeFormatted = `${updateTime.getFullYear()}-${(updateTime.getMonth() + 1).toString().padStart(2, '0')}-${updateTime.getDate().toString().padStart(2, '0')} ${updateTime.getHours().toString().padStart(2, '0')}:${updateTime.getMinutes().toString().padStart(2, '0')}`;
        
        // 生成预览文本（取第一条用户消息的前50个字符）
        let preview = '';
        if (item.messages && item.messages.length > 0) {
          const firstUserMessage = item.messages.find(msg => msg.role === 'user');
          if (firstUserMessage) {
            preview = firstUserMessage.content.substring(0, 50);
            if (firstUserMessage.content.length > 50) {
              preview += '...';
            }
          }
        }
        
        return {
          ...item,
          updateTimeFormatted,
          preview
        };
      });
      
      // 按更新时间倒序排列
      formattedConversations.sort((a, b) => {
        return new Date(b.updateTime) - new Date(a.updateTime);
      });
      
      this.setData({
        conversations: formattedConversations
      });
    } catch (e) {
      console.error('加载历史记录失败:', e);
      wx.showToast({
        title: '加载历史记录失败',
        icon: 'none'
      });
    }
  },

  // 加载特定对话
  loadConversation: function(e) {
    const conversationId = e.currentTarget.dataset.id;
    
    if (!conversationId) {
      wx.showToast({
        title: '无效的对话ID',
        icon: 'none'
      });
      return;
    }
    
    try {
      // 保存当前选择的对话ID到全局数据
      const app = getApp();
      app.globalData.selectedConversationId = conversationId;
      
      // 返回主页
      wx.navigateBack();
    } catch (e) {
      console.error('加载对话失败:', e);
      wx.showToast({
        title: '加载对话失败',
        icon: 'none'
      });
    }
  },

  // 删除对话
  deleteConversation: function(e) {
    // 检查登录状态
    if (!this.checkLoginStatus()) {
      return;
    }
    
    const conversationId = e.currentTarget.dataset.id;
    
    if (!conversationId) {
      wx.showToast({
        title: '无效的对话ID',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条对话记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            const storageKey = app.getUserStorageKey('conversations');
            
            // 获取当前对话列表
            let chatList = wx.getStorageSync(storageKey) || [];
            
            // 从列表中移除指定对话
            chatList = chatList.filter(item => item.id !== conversationId);
            
            // 更新存储
            wx.setStorageSync(storageKey, chatList);
            
            // 删除对应的对话详情
            wx.removeStorageSync(app.getUserStorageKey(`conversation_${conversationId}`));
            
            // 重新加载列表
            this.loadConversations();
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (e) {
            console.error('删除对话失败:', e);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 清空所有历史记录
  clearAllHistory: function() {
    // 检查登录状态
    if (!this.checkLoginStatus()) {
      return;
    }
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            const storageKey = app.getUserStorageKey('conversations');
            
            // 获取当前对话列表
            const chatList = wx.getStorageSync(storageKey) || [];
            
            // 获取全局应用实例，检查是否有当前选中的对话
            const selectedConversationId = app.globalData.selectedConversationId;
            
            if (selectedConversationId) {
              // 如果有当前选中的对话，只删除除此对话外的所有对话
              const filteredChatList = chatList.filter(item => item.id === selectedConversationId);
              wx.setStorageSync(storageKey, filteredChatList);
            } else {
              // 如果没有当前选中的对话，清空所有对话列表
              wx.removeStorageSync(storageKey);
            }
            
            // 获取所有存储键
            const storageInfo = wx.getStorageInfoSync();
            const allKeys = storageInfo.keys;
            
            // 删除所有对话详情，但保留当前选中的对话
            allKeys.forEach(key => {
              if (key.startsWith(app.getUserStorageKey('conversation_'))) {
                // 检查是否是当前选中对话的详情
                const conversationId = key.replace(app.getUserStorageKey('conversation_'), '');
                if (!selectedConversationId || conversationId !== selectedConversationId) {
                  wx.removeStorageSync(key);
                }
              }
            });
            
            // 重新加载列表
            this.loadConversations();
            
            wx.showToast({
              title: '清空成功',
              icon: 'success'
            });
          } catch (e) {
            console.error('清空历史记录失败:', e);
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 返回聊天页面
  goBack: function() {
    wx.navigateBack();
  }
});