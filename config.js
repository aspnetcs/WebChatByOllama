// config.js
const config = {
    // 接口地址 (模拟器可用 localhost，真机请换成局域网IP)
    apiUrl: 'http://192.168.1.90:11434/api/chat', 
    // apiUrl: 'http://47.98.144.171:59179/api/chat', 
    // 模型名称，需与本地 pull 的模型一致
    model: 'gemma3:12b',
    // model: 'qwen3-vl:8b',
    // 多模态模型名称，用于图片识别 (如 llava, bakllava, moondream 等)
    multimodalModel: 'gemma3:12b',
    // multimodalModel: 'qwen3-vl:8b',

    //登录接口
    // loginUrl:'http://47.98.144.171:59175/api/auth/login',
    loginUrl:'http://192.168.1.90:59179/api/auth/login',

    // 文档文件上传接口地址
    uploadUrl: 'http://192.168.1.90:59179/api/document',
    // 视频处理接口地址
    videoUrl: 'http://192.168.1.90:59179/api/video',
    // STT接口地址
    sttUrl: 'http://192.168.1.90:59177/asr',
    // STT配置
    sttConfig: {
        // 是否在STT结果前添加前缀
        addPrefix: false,
        // STT前缀内容
        prefix: '音频文件:'
    },
    // 请求超时时间（毫秒）
    timeout: 600000, // 10分钟
    // 调试模式
    debug: true,
    // accountbook: true
    accountbook: {
      // 是否打开
      enabled: false,
      // 角色与规则地址
      rule_prompt_url: 'http://192.168.1.90:59179/api/account/prompt',
      // 账本创建时间
      accountbook_url: 'http://192.168.1.90:59179/api/account'
    }
  };
  
  module.exports = config;