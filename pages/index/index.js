const config = require('../../config.js');

const app = getApp();

Page({
  data: {
    inputValue: '',
    chatList: [], // 聊天记录列表
    isLoading: false, // 是否正在等待回复
    scrollTop: 0, // 滚动条位置
    scrollIntoView: '', // 滚动锚点
    messages: [], // Ollama API使用的消息数组，用于多轮对话
    selectedImages: [], // 当前选择的图片列表
    selectedFiles: [], // 当前选择的文件列表
    conversationId: null, // 当前对话ID
    conversationTitle: null, // 当前对话标题
    showPopupMenu: false, // 是否显示弹出菜单
    showLanguageModal: false, // 是否显示语言选择弹窗
    selectedLanguage: '', // 默认不指定语言
    showAllLanguages: false, // 是否显示全部语言列表
    commonLanguages: [
      { code: '', name: '不指定' },
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' }
    ],
    allLanguages: [
      { code: '', name: '不指定' },
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'am', name: 'Amharic' },
      { code: 'ar', name: 'Arabic' },
      { code: 'as', name: 'Assamese' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'ba', name: 'Bashkir' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'bn', name: 'Bengali' },
      { code: 'bo', name: 'Tibetan' },
      { code: 'br', name: 'Breton' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'ca', name: 'Catalan' },
      { code: 'cs', name: 'Czech' },
      { code: 'cy', name: 'Welsh' },
      { code: 'da', name: 'Danish' },
      { code: 'de', name: 'German' },
      { code: 'el', name: 'Greek' },
      { code: 'es', name: 'Spanish' },
      { code: 'et', name: 'Estonian' },
      { code: 'eu', name: 'Basque' },
      { code: 'fa', name: 'Persian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fo', name: 'Faroese' },
      { code: 'fr', name: 'French' },
      { code: 'gl', name: 'Galician' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'ha', name: 'Hausa' },
      { code: 'haw', name: 'Hawaiian' },
      { code: 'he', name: 'Hebrew' },
      { code: 'hi', name: 'Hindi' },
      { code: 'hr', name: 'Croatian' },
      { code: 'ht', name: 'Haitian Creole' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'id', name: 'Indonesian' },
      { code: 'is', name: 'Icelandic' },
      { code: 'it', name: 'Italian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'jw', name: 'Javanese' },
      { code: 'ka', name: 'Georgian' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'km', name: 'Khmer' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ko', name: 'Korean' },
      { code: 'la', name: 'Latin' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'ln', name: 'Lingala' },
      { code: 'lo', name: 'Lao' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lv', name: 'Latvian' },
      { code: 'mg', name: 'Malagasy' },
      { code: 'mi', name: 'Maori' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'mr', name: 'Marathi' },
      { code: 'ms', name: 'Malay' },
      { code: 'mt', name: 'Maltese' },
      { code: 'my', name: 'Myanmar (Burmese)' },
      { code: 'ne', name: 'Nepali' },
      { code: 'nl', name: 'Dutch' },
      { code: 'nn', name: 'Nynorsk' },
      { code: 'no', name: 'Norwegian' },
      { code: 'oc', name: 'Occitan' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'pl', name: 'Polish' },
      { code: 'ps', name: 'Pashto' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'sa', name: 'Sanskrit' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'si', name: 'Sinhala' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'sn', name: 'Shona' },
      { code: 'so', name: 'Somali' },
      { code: 'sq', name: 'Albanian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'su', name: 'Sundanese' },
      { code: 'sv', name: 'Swedish' },
      { code: 'sw', name: 'Swahili' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'tg', name: 'Tajik' },
      { code: 'th', name: 'Thai' },
      { code: 'tk', name: 'Turkmen' },
      { code: 'tl', name: 'Tagalog' },
      { code: 'tr', name: 'Turkish' },
      { code: 'tt', name: 'Tatar' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'ur', name: 'Urdu' },
      { code: 'uz', name: 'Uzbek' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'yi', name: 'Yiddish' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'yue', name: 'Cantonese' }
    ],
    loginCheckExecuted: false
  },

  onLoad() {
    // 检查登录状态，只执行一次
    if (!this.data.loginCheckExecuted) {
      this.setData({
        loginCheckExecuted: true
      });
      
      if (!this.checkLoginStatus()) {
        return; // 如果未登录，则不执行后续逻辑
      }
    }
    
    // 初始化消息数组
    this.setData({
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的AI助手。'
        }
      ]
    });
    
    // 生成新的对话ID
    this.generateNewConversationId();
    
    // 检查是否启用accountbook功能
    if (config.accountbook.enabled === 'true') {
      // 从服务器获取prompt并自动发送
      wx.request({
        url: config.accountbook.rule_prompt_url,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 获取到prompt后自动发送
            const prompt = res.data;
            
            // 添加隐藏的用户消息到列表
            this.addHiddenMessage('user', prompt);
            
            // 更新消息数组（包括隐藏的消息）
            const updatedMessages = [...this.data.messages, {
              role: 'user',
              content: prompt
            }];
            
            this.setData({
              messages: updatedMessages
            });
            
            // 调用API获取AI回复
            this.callOllamaApiForAccountBook(prompt);
          } else {
            // 添加普通欢迎语（作为备选方案）
            this.addWelcomeMessage();
          }
        },
        fail: (err) => {
          console.error('获取prompt失败:', err);
          // 添加普通欢迎语（作为备选方案）
          this.addWelcomeMessage();
        }
      });
    } else {
      // 添加普通欢迎语（普通模式）
      this.addWelcomeMessage();
    }
  },

  onShow: function () {
    // 检查登录状态 - 只在未登录时跳转，避免重复弹窗
    const app = getApp();
    if (!app.globalData.isLoggedIn) {
      // 只有在当前页面不是登录页时才跳转，避免重复跳转
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage.route !== 'pages/login/login') {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
      return;
    }
    
    // 检查是否有选中的对话ID
    if (app.globalData.selectedConversationId) {
      this.loadConversation(app.globalData.selectedConversationId);
      // 重置全局选中的对话ID
      app.globalData.selectedConversationId = null;
    } else {
      // 如果没有选中的对话ID且聊天列表为空，添加欢迎消息
      if (this.data.chatList.length === 0) {
        this.addWelcomeMessage();
      }
    }
  },

  // 检查登录状态，未登录则跳转到登录页，登录成功则显示欢迎语
  checkLoginStatus: function() {
    const app = getApp();
    
    if (!app.globalData.isLoggedIn) {
      // 未登录，跳转到登录页面
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return false; // 返回false表示未登录
    }
    return true; // 返回true表示已登录
  },

  // 添加欢迎消息，显示用户昵称
  addWelcomeMessage: function() {
    const app = getApp();
    let welcomeText = '你好！我是你的 AI 助手。有什么我可以帮你的吗？';
    
    // 如果有用户信息，显示个性化欢迎语
    if (app.globalData.userInfo && app.globalData.userInfo.nickName) {
      welcomeText = `欢迎你，${app.globalData.userInfo.nickName}！有什么我可以帮你的吗？`;
    }
    
    // 确保只有在聊天列表为空时才添加欢迎消息，避免重复添加
    if (this.data.chatList.length === 0) {
      this.addMessage('assistant', welcomeText);
    }
  },

  // 获取输入框内容
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  sendMessage() {
    const app = getApp();
    
    // 检查登录状态
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '您需要先登录才能发送消息，是否前往登录？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
        }
      });
      return;
    }
    
    const content = this.data.inputValue.trim();
    const hasImages = this.data.selectedImages.length > 0;
    const hasFiles = this.data.selectedFiles.length > 0;
    
    if (!content && !hasImages && !hasFiles) {
      wx.showToast({
        title: '请输入内容或选择文件',
        icon: 'none'
      });
      return;
    }

    if (this.data.isLoading) return;

    // 1. 添加用户消息到列表（包含当前选择的图片和文件）
    this.addMessage('user', content, this.data.selectedImages, this.data.selectedFiles);

    // 2. 清空输入框并设置加载状态，但保留selectedImages和selectedFiles给API调用使用
    this.setData({
      inputValue: '',
      isLoading: true
    });

    // 3. 请求 Ollama 接口
    this.callOllamaApi(content);
    
    // 4. 立即清空已选择的图片和文件，避免在等待响应期间显示预览
    this.setData({
      selectedImages: [],
      selectedFiles: []
    });
  },

  // 调用 API
  callOllamaApi(prompt) {
    const that = this;
    
    // 构建用户消息
    let userMessage = {
      role: 'user',
      content: prompt
    };
    
    // 如果有图片，添加到消息中
    if (this.data.selectedImages.length > 0) {
      userMessage.images = this.data.selectedImages;
      
      // 如果是PDF转换的图片，添加特殊说明
      if (prompt) {
        userMessage.content = prompt;
      }
      
      // 在消息内容中添加PDF相关信息（供AI参考）
      if (this.data.selectedImages.length > 0) {
        // 这里我们假设来自PDF的图片会在特定情况下添加描述
        // 实际应用中可能需要更复杂的判断机制
      }
    }
    
    // 如果有文件，将文件内容添加到消息内容中
    if (this.data.selectedFiles.length > 0) {
      let fileContent = '';
      this.data.selectedFiles.forEach(file => {
        fileContent += `

--- 文件: ${file.name} ---
${file.content}
--- 文件结束 ---`;
      });
      
      // 如果已有输入内容，将文件内容附加到后面
      if (prompt) {
        userMessage.content = prompt + fileContent;
      } else {
        // 如果没有输入内容，只使用文件内容
        userMessage.content = fileContent;
      }
    }
    
    // 更新消息数组
    const updatedMessages = [...this.data.messages, userMessage];
    this.setData({
      messages: updatedMessages
    });
    
    // 确定使用的模型（有图片时使用多模态模型）
    const modelToUse = this.data.selectedImages.length > 0 ? config.multimodalModel : config.model;
    
    wx.request({
      url: config.apiUrl,
      method: 'POST',
      timeout: config.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        model: modelToUse,
        messages: updatedMessages,
        stream: false,
        options: {
          temperature: 0.7
        }
      },
      success(res) {
        if (config.debug) console.log('Ollama Response:', res.data);

        if (res.statusCode === 200 && res.data && res.data.message) {
          const responseText = res.data.message.content;
          const assistantMessage = {
            role: 'assistant',
            content: responseText
          };

          // 更新消息数组
          that.setData({
            messages: [...updatedMessages, assistantMessage]
          });

          // 添加 AI 回复到列表
          that.addMessage('assistant', responseText);
        } else {
          that.addMessage('system', '服务器响应异常，请检查 Ollama 是否运行。');
        }
      },
      fail(err) {
        console.error(err);
        that.addMessage('system', '网络请求失败，请检查 config.js 配置或网络连接。');
      },
      complete() {
        that.setData({
          isLoading: false,
          selectedImages: [], // 清空已选择的图片
          selectedFiles: [] // 清空已选择的文件
        });
        
        // 自动保存对话
        that.saveConversation();
      }
    });
  },

  // 添加消息辅助函数
  addMessage(role, content, images, files) {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let messageData = {
      id: 'msg_' + new Date().getTime(),
      role: role, // 'user', 'assistant', 'system'
      content: content,
      time: timeString,
      images: images || [], // 添加图片字段
      files: files || [] // 添加文件字段
    };

    // 如果是AI回复，使用towxml转换markdown为towxml格式
    if (role === 'assistant') {
      const app = getApp();
      // 使用towxml将markdown转换为towxml数据
      messageData.towxmlData = app.towxml(content, 'markdown', {
        theme: 'light',
        events: {
          tap: (e) => {
            if (e.currentTarget.dataset.data && e.currentTarget.dataset.data.src) {
              wx.previewImage({
                current: e.currentTarget.dataset.data.src,
                urls: [e.currentTarget.dataset.data.src]
              });
            }
          }
        }
      });
    }

    const list = this.data.chatList;
    list.push(messageData);

    this.setData({
      chatList: list,
      // 设置 scrollIntoView 实现自动滚动到底部
      scrollIntoView: messageData.id
    });
  },

  // 选择图片
  chooseImage() {
    // 关闭弹出菜单
    this.setData({
      showPopupMenu: false
    });
    
    const that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['compressed'], // 选择压缩图片
      sourceType: ['album', 'camera'], // 从相册选择或拍照
      success(res) {
        // 获取图片临时路径
        const tempFilePaths = res.tempFilePaths;
        
        // 将图片转换为Base64
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0],
          encoding: 'base64',
          success(res) {
            const base64Data = res.data;
            
            // 添加到已选择的图片列表
            const selectedImages = that.data.selectedImages;
            selectedImages.push(base64Data);
            
            that.setData({
              selectedImages: selectedImages
            });
            
            wx.showToast({
              title: '图片已添加',
              icon: 'success'
            });
          },
          fail(err) {
            console.error('读取图片失败:', err);
            wx.showToast({
              title: '图片处理失败',
              icon: 'none'
            });
          }
        });
      },
      fail(err) {
        console.error('选择图片失败:', err);
      }
    });
  },

  // 移除已选择的图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const selectedImages = this.data.selectedImages;
    selectedImages.splice(index, 1);
    
    this.setData({
      selectedImages: selectedImages
    });
  },

  // 预览图片
  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    });
  },

  // 选择文件
  chooseFile() {
    // 关闭弹出菜单
    this.setData({
      showPopupMenu: false
    });
    
    const that = this;
    wx.chooseMessageFile({
      count: 5, // 最多可以选择5个文件
      type: 'file', // 选择所有类型的文件
      success(res) {
        const tempFiles = res.tempFiles;
        
        // 处理每个选中的文件
        tempFiles.forEach(tempFile => {
          // 检查文件类型是否为支持的文本文件
          const fileName = tempFile.name;
          const fileExt = fileName.split('.').pop().toLowerCase();
          const supportedTypes = ['txt', 'json', 'js', 'py', 'java', 'c', 'cpp', 'h', 'css', 'html', 'xml', 'yml', 'yaml', 'md', 'log', 'sql', 'sh', 'bat'];
          
          if (!supportedTypes.includes(fileExt)) {
            wx.showToast({
              title: `不支持的文件类型: ${fileExt}`,
              icon: 'none'
            });
            return;
          }
          
          // 读取文件内容
          wx.getFileSystemManager().readFile({
            filePath: tempFile.path,
            encoding: 'utf8',
            success(fileRes) {
              const fileContent = fileRes.data;
              
              // 格式化文件大小
              let fileSize = tempFile.size;
              let fileSizeStr = '';
              if (fileSize < 1024) {
                fileSizeStr = fileSize + 'B';
              } else if (fileSize < 1024 * 1024) {
                fileSizeStr = (fileSize / 1024).toFixed(2) + 'KB';
              } else {
                fileSizeStr = (fileSize / (1024 * 1024)).toFixed(2) + 'MB';
              }
              
              // 添加到已选择的文件列表
              const selectedFiles = that.data.selectedFiles;
              selectedFiles.push({
                name: fileName,
                content: fileContent,
                size: fileSizeStr,
                path: tempFile.path
              });
              
              that.setData({
                selectedFiles: selectedFiles
              });
              
              wx.showToast({
                title: '文件已添加',
                icon: 'success'
              });
            },
            fail(err) {
              console.error('读取文件失败:', err);
              wx.showToast({
                title: '文件读取失败',
                icon: 'none'
              });
            }
          });
        });
      },
      fail(err) {
        console.error('选择文件失败:', err);
      }
    });
  },

  // 选择任意文件
  chooseAnyFile() {
    // 关闭弹出菜单
    this.setData({
      showPopupMenu: false
    });
    
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const tempFile = res.tempFiles[0];
        const fileName = tempFile.name;
        
        // 显示处理提示
        wx.showLoading({
          title: '处理文件中...',
        });
        
        // 创建FormData对象并发送到后端
        const uploadTask = wx.uploadFile({
          url: config.uploadUrl, // 后端接口地址
          filePath: tempFile.path,
          name: 'file',
          success(uploadRes) {
            wx.hideLoading();
            
            try {
              const data = JSON.parse(uploadRes.data);
              
              if (uploadRes.statusCode === 200 && Array.isArray(data)) {
                // 将返回的Base64图片添加到selectedImages中
                const selectedImages = that.data.selectedImages;
                
                // 处理每一页的图片数据
                data.forEach((base64Image, index) => {
                  // 移除data:image/png;base64,前缀（如果存在）
                  let cleanBase64 = base64Image;
                  if (base64Image.startsWith('data:image/png;base64,')) {
                    cleanBase64 = base64Image.substring(22);
                  }
                  
                  selectedImages.push(cleanBase64);
                });
                
                that.setData({
                  selectedImages: selectedImages
                });
                
                wx.showToast({
                  title: `文件处理完成，共${data.length}页`,
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: '文件处理失败',
                  icon: 'none'
                });
                console.error('文件处理失败:', data);
              }
            } catch (parseError) {
              wx.hideLoading();
              wx.showToast({
                title: '解析响应失败',
                icon: 'none'
              });
              console.error('解析响应失败:', parseError);
            }
          },
          fail(err) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
            console.error('上传文件失败:', err);
          }
        });
      },
      fail(err) {
        console.error('选择文件失败:', err);
        if (err.errMsg && !err.errMsg.includes('cancel')) {
          wx.showToast({
            title: '选择文件失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // 移除已选择的文件
  removeFile(e) {
    const index = e.currentTarget.dataset.index;
    const selectedFiles = this.data.selectedFiles;
    selectedFiles.splice(index, 1);
    
    this.setData({
      selectedFiles: selectedFiles
    });
  },

  // 生成新的对话ID
  generateNewConversationId() {
    const conversationId = 'conv_' + new Date().getTime();
    this.setData({
      conversationId: conversationId,
      conversationTitle: '新对话 ' + new Date().toLocaleString()
    });
  },

  // 开始新对话
  newChat() {
    const that = this;
    
    // 如果当前对话有内容，先保存
    if (this.data.chatList.length > 1) {
      this.saveConversation();
    }
    
    // 清空当前对话
    this.setData({
      chatList: [],
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的AI助手。'
        }
      ],
      inputValue: '',
      selectedImages: [],
      selectedFiles: []
    });
    
    // 生成新的对话ID
    this.generateNewConversationId();
    
    // 检查是否启用accountbook功能
    if (config.accountbook.enabled) {
      // 从服务器获取prompt并自动发送
      wx.request({
        url: config.accountbook.rule_prompt_url,
        method: 'GET',
        success(res) {
          if (res.statusCode === 200 && res.data) {
            // 获取到prompt后自动发送
            const prompt = res.data;
            
            // 添加隐藏的用户消息到列表
            that.addHiddenMessage('user', prompt);
            
            // 更新消息数组（包括隐藏的消息）
            const updatedMessages = [...that.data.messages, {
              role: 'user',
              content: prompt
            }];
            
            that.setData({
              messages: updatedMessages
            });
            
            // 调用API获取AI回复
            that.callOllamaApiForAccountBook(prompt);
          } else {
            // 添加普通欢迎语（作为备选方案）
            that.addWelcomeMessage();
            wx.showToast({
              title: '已开启新对话',
              icon: 'success'
            });
          }
        },
        fail(err) {
          console.error('获取prompt失败:', err);
          // 添加普通欢迎语（作为备选方案）
          that.addWelcomeMessage();
          wx.showToast({
              title: '已开启新对话',
              icon: 'success'
          });
        }
      });
    } else {
      // 添加普通欢迎语（普通模式）
      that.addWelcomeMessage();  // 修改这里，使用统一的欢迎消息方法
      
      wx.showToast({
        title: '已开启新对话',
        icon: 'success'
      });
    }
  },

  // 查看历史记录
  viewHistory() {
    // 先保存当前对话
    if (this.data.chatList.length > 1) {
      this.saveConversation();
    }
    
    // 跳转到历史记录页面
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 保存对话到本地存储
  saveConversation() {
    const app = getApp();
    const storageKey = app.getUserStorageKey('conversations');
    
    try {
      // 获取已保存的对话列表
      let conversations = wx.getStorageSync(storageKey) || [];
      
      // 检查当前对话是否已存在
      const existingIndex = conversations.findIndex(conv => conv.id === this.data.conversationId);
      
      // 准备对话数据，但不存储完整的图片数据以节省空间
      // 创建一个轻量级的聊天记录副本，去除大图片数据
      const lightChatList = this.data.chatList.map(msg => {
        // 只保存图片数量信息，而不保存完整的base64数据
        if (msg.images && msg.images.length > 0) {
          return {
            ...msg,
            images: [], // 不保存图片数据
            imageCount: msg.images.length // 仅保存图片数量
          };
        }
        return msg;
      });
      
      const conversationData = {
        id: this.data.conversationId,
        title: this.data.conversationTitle,
        // 对于messages，我们也需要处理图片数据
        messages: this.data.messages.map(msg => {
          if (msg.images) {
            return {
              ...msg,
              images: [] // 不保存图片数据到历史记录
            };
          }
          return msg;
        }),
        chatList: lightChatList,
        updateTime: new Date().toISOString()
      };
      
      // 如果对话已存在，更新它；否则添加新对话
      if (existingIndex !== -1) {
        conversations[existingIndex] = conversationData;
      } else {
        conversations.unshift(conversationData); // 添加到开头
      }
      
      // 限制历史记录数量，最多保存20条以减少存储压力
      if (conversations.length > 20) {
        conversations = conversations.slice(0, 20);
      }
      
      // 保存到本地存储
      wx.setStorageSync(storageKey, conversations);
      
      console.log('对话已保存:', this.data.conversationId);
    } catch (e) {
      console.error('保存对话失败:', e);
      // 添加用户提示
      wx.showToast({
        title: '保存对话失败，存储空间不足',
        icon: 'none'
      });
    }
  },

  // 加载指定对话
  loadConversation(conversationId) {
    const app = getApp();
    const storageKey = app.getUserStorageKey('conversations');
    
    try {
      const conversations = wx.getStorageSync(storageKey) || [];
      const conversation = conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        this.setData({
          conversationId: conversation.id,
          conversationTitle: conversation.title,
          messages: conversation.messages,
          chatList: conversation.chatList,
          inputValue: '',
          selectedImages: [],
          selectedFiles: []
        });
        
        // 滚动到底部
        if (this.data.chatList.length > 0) {
          const lastMessageId = this.data.chatList[this.data.chatList.length - 1].id;
          this.setData({
            scrollIntoView: lastMessageId
          });
        }
        
        wx.showToast({
          title: '对话已加载',
          icon: 'success'
        });
      }
    } catch (e) {
      console.error('加载对话失败:', e);
      wx.showToast({
        title: '加载对话失败',
        icon: 'none'
      });
    }
  },

  // 切换弹出菜单显示状态
  togglePopupMenu() {
    this.setData({
      showPopupMenu: !this.data.showPopupMenu
    });
  },

  // 选择音频文件
  chooseAudioFile() {
    // 关闭弹出菜单
    this.setData({
      showPopupMenu: false
    });

    // 显示语言选择弹窗
    this.setData({
      showLanguageModal: true,
      showAllLanguages: false,
      selectedLanguage: ''
    });
  },

  // 选择视频文件
  chooseVideo() {
    // 关闭弹出菜单
    this.setData({
      showPopupMenu: false
    });
    
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success(res) {
        // 检查文件大小（限制为300MB）
        const maxSize = 300 * 1024 * 1024; // 300MB
        if (res.size > maxSize) {
          wx.showToast({
            title: '视频文件过大，请选择小于300MB的视频',
            icon: 'none'
          });
          return;
        }
        
        // 显示处理提示
        wx.showLoading({
          title: '视频上传中...',
        });
        
        // 上传视频文件到后端进行分片处理
        const uploadTask = wx.uploadFile({
          url: config.videoUrl, // 后端视频处理接口地址
          filePath: res.tempFilePath,
          name: 'file', // 注意：后端参数名为"file"而不是"video_file"
          timeout: 300000, // 设置5分钟超时时间
          success(uploadRes) {
            wx.hideLoading();
            
            // 检查响应是否为空
            if (!uploadRes.data) {
              wx.showToast({
                title: '服务器无响应',
                icon: 'none'
              });
              return;
            }
            
            try {
              // 检查响应状态码
              if (uploadRes.statusCode !== 200) {
                let errorMsg = '视频处理失败';
                if (uploadRes.statusCode === 400) {
                  errorMsg = '请选择一个视频文件';
                } else if (uploadRes.statusCode === 500) {
                  errorMsg = '服务器处理错误';
                }
                
                wx.showToast({
                  title: errorMsg,
                  icon: 'none'
                });
                console.error('服务器错误响应:', uploadRes.data);
                return;
              }
              
              const data = JSON.parse(uploadRes.data);
              
              // 检查返回数据是否为数组
              if (!Array.isArray(data)) {
                wx.showToast({
                  title: '服务器响应格式错误',
                  icon: 'none'
                });
                console.error('服务器响应格式错误:', data);
                return;
              }
              
              // 检查是否有返回数据
              if (data.length === 0) {
                wx.showToast({
                  title: '视频未生成有效帧',
                  icon: 'none'
                });
                return;
              }
              
              // 将返回的Base64图片添加到selectedImages中
              const selectedImages = [...that.data.selectedImages];
              
              // 处理每一帧图片数据
              data.forEach((base64Image, index) => {
                // 确保base64Image是字符串
                if (typeof base64Image === 'string') {
                  // 移除data:image/png;base64,前缀（如果存在）
                  let cleanBase64 = base64Image;
                  if (base64Image.startsWith('data:image/png;base64,')) {
                    cleanBase64 = base64Image.substring(22);
                  } else if (base64Image.startsWith('data:image/jpeg;base64,')) {
                    cleanBase64 = base64Image.substring(23);
                  }
                  
                  selectedImages.push(cleanBase64);
                }
              });
              
              that.setData({
                selectedImages: selectedImages
              });
              
              wx.showToast({
                title: `视频处理完成，共${data.length}帧`,
                icon: 'success'
              });
            } catch (parseError) {
              wx.hideLoading();
              wx.showToast({
                title: '解析响应失败: ' + parseError.message,
                icon: 'none'
              });
              console.error('解析响应失败:', parseError);
              console.error('原始响应:', uploadRes.data);
            }
          },
          fail(err) {
            wx.hideLoading();
            console.error('上传视频文件失败:', err);
            if (err.errMsg && err.errMsg.includes('timeout')) {
              wx.showToast({
                title: '上传超时，请检查网络或选择更小的视频',
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              });
            }
          }
        });
        
        // 监听上传进度
        uploadTask.onProgressUpdate((res) => {
          if (res.progress % 25 === 0) { // 每25%更新一次提示
            wx.showLoading({
              title: `上传中...${res.progress}%`,
            });
          }
        });
      },
      fail(err) {
        console.error('选择视频失败:', err);
        if (err.errMsg && !err.errMsg.includes('cancel')) {
          wx.showToast({
            title: '选择视频失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // 关闭语言选择弹窗
  closeLanguageModal() {
    this.setData({
      showLanguageModal: false
    });
  },

  // 确认选择的语言
  confirmLanguage() {
    this.setData({
      showLanguageModal: false
    });
    
    // 继续处理音频文件
    this.processAudioFile();
  },

  // 切换显示全部语言
  toggleAllLanguages() {
    this.setData({
      showAllLanguages: !this.data.showAllLanguages
    });
  },

  // 选择语言
  selectLanguage(e) {
    const language = e.currentTarget.dataset.language;
    this.setData({
      selectedLanguage: language
    });
  },

  // 处理音频文件
  processAudioFile() {
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'audio', // 选择音频文件
      extension: ['mp3', 'm4a'], // 限制只能选择mp3和m4a格式
      success(res) {
        const tempFile = res.tempFiles[0];
        const fileName = tempFile.name;

        // 显示处理提示
        wx.showLoading({
          title: '音频处理中...',
        });

        // 准备表单数据
        let formData = {
          encode: true,
          task: 'transcribe'
        };
        
        // 如果选择了语言，则添加到表单数据中
        if (that.data.selectedLanguage) {
          formData.language = that.data.selectedLanguage;
        }

        // 上传音频文件到STT接口
        const uploadTask = wx.uploadFile({
          url: config.sttUrl,
          filePath: tempFile.path,
          name: 'audio_file',
          formData: formData,
          success(sttRes) {
            wx.hideLoading();

            if (sttRes.statusCode === 200) {
              // 获取STT结果（纯文本）
              let sttResult = sttRes.data;
              
              // 根据配置决定是否添加前缀
              if (config.sttConfig.addPrefix) {
                sttResult = config.sttConfig.prefix + sttResult;
              }

              // 将STT结果填入输入框
              that.setData({
                inputValue: sttResult
              });

              wx.showToast({
                title: '音频识别成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: '音频识别失败',
                icon: 'none'
              });
              console.error('STT处理失败:', sttRes);
            }
          },
          fail(err) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
            console.error('上传音频文件失败:', err);
          }
        });
      },
      fail(err) {
        console.error('选择音频文件失败:', err);
        if (err.errMsg && !err.errMsg.includes('cancel')) {
          wx.showToast({
            title: '选择音频文件失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // 添加隐藏消息辅助函数
  addHiddenMessage(role, content) {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let messageData = {
      id: 'msg_' + new Date().getTime(),
      role: role,
      content: content,
      time: timeString,
      hidden: true // 标记为隐藏消息
    };

    // 如果是AI回复，使用towxml转换markdown为towxml格式
    if (role === 'assistant') {
      const app = getApp();
      // 使用towxml将markdown转换为towxml数据
      messageData.towxmlData = app.towxml(content, 'markdown', {
        theme: 'light',
        events: {
          tap: (e) => {
            if (e.currentTarget.dataset.data && e.currentTarget.dataset.data.src) {
              wx.previewImage({
                current: e.currentTarget.dataset.data.src,
                urls: [e.currentTarget.dataset.data.src]
              });
            }
          }
        }
      });
    }

    const list = this.data.chatList;
    list.push(messageData);

    // 过滤掉隐藏消息后再设置到data中，确保用户看不到隐藏消息
    const visibleMessages = list.filter(msg => !msg.hidden);
    
    this.setData({
      chatList: list, // 保留完整列表用于保存历史记录
      // 设置 scrollIntoView 实现自动滚动到底部
      scrollIntoView: messageData.id
    });
  },

  // 为accountbook专门调用API的方法
  callOllamaApiForAccountBook(prompt) {
    const that = this;
    
    // 构建用户消息
    let userMessage = {
      role: 'user',
      content: prompt
    };
    
    // 更新消息数组
    const updatedMessages = [...this.data.messages, userMessage];
    this.setData({
      messages: updatedMessages
    });
    
    // 确定使用的模型
    const modelToUse = config.model;
    
    wx.request({
      url: config.apiUrl,
      method: 'POST',
      timeout: config.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        model: modelToUse,
        messages: updatedMessages,
        stream: false,
        options: {
          temperature: 0.7
        }
      },
      success(res) {
        if (config.debug) console.log('Ollama Response:', res.data);

        if (res.statusCode === 200 && res.data && res.data.message) {
          const responseText = res.data.message.content;
          const assistantMessage = {
            role: 'assistant',
            content: responseText
          };

          // 更新消息数组
          that.setData({
            messages: [...updatedMessages, assistantMessage]
          });

          // 添加 AI 回复到列表（作为欢迎语显示给用户）
          that.addMessage('assistant', responseText);
        } else {
          that.addWelcomeMessage(); // 修改这里，使用统一的欢迎消息方法
        }
      },
      fail(err) {
        console.error(err);
        that.addWelcomeMessage(); // 修改这里，使用统一的欢迎消息方法
      },
      complete() {
        // 自动保存对话
        that.saveConversation();
        
        // 显示新建对话成功的提示
        wx.showToast({
          title: '已开启新对话',
          icon: 'success'
        });
      }
    });
  }
})
