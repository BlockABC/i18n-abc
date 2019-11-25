# Auto extract translation keys/values from your code, and generate shortened key.

## 功能
1. 自动提取待翻译的 key/value，生成缩短过后的 key（用 MD5）
2. 删除未翻译的多语言文本
3. 未翻译的多语言文本用默认语言代替
4. 自动进行简单的简繁转换

## 安装
```bash
npm install i18n-abc
```

## 使用
在项目根目录下创建 `i18n-abc.config.js` 文件：

```js
module.exports = {
  scan: {
    input: [
      './src/**/*.{js,ts,vue}',
      '!./src/static/**',
    ],
    output: './src/locales/raw',
  },
  transform: {
    input: './src/locales/raw',
    output: './src/locales',
  }
}
```
### 扫描
开始扫描并生成 i18n 文件:
```bash
i18n-abc scan
```

### 处理
处理 i18n 文件，比如简体中文转繁体中文，清理没有翻译的文本

```bash
i18n-abc transform
```