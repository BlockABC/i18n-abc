// default config
const utils = require('./lib/utils')

module.exports = {
  // i18next-scanner 的配置
  scan: {
    input: [
      './src/**/*.*', // 会被扫描的文件，glob
      '!./src/locales',
    ],
    output: './src/locales/raw',
    // i18next-scanner 的配置经过拉平
    // eslint-disable-next-line no-useless-escape
    functions: ['\\\$t', '\\\$tt', '\\\$ttt'], // 翻译函数的名字
    extensions: ['.js', '.ts', '.vue', '.jsx', '.tsx'], // 会被解析的文件扩展
    langs: ['en', 'zh-cn', 'zh-tw', 'jp', 'ko'], // 生成的多语言文件
    removeUnusedKeys: true, // 是否移除没有用的文本
    // 自定义参数
    generateKey: utils.makeCrcKey,
  },

  clean: {
    input: './src/locales/raw',
    output: './src/locales',
    autoS2T: true,
    raw: {
      regex: /[\u4e00-\u9fa5]/,
      remove: true,
      // useDefault: true // todo: 暂时还没做
    }
  },

  translate: {
    input: './src/locales/raw',
    output: './src/locales/raw',
    langs: ['en'],
  },

  diff: {
    input: './src/locales/raw',
    output: './src/locales/diff',
    langs: ['en'],
    raw: {
      regex: /[\u4e00-\u9fa5]/,
    }
  }
}
