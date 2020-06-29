# Auto extract translation keys/values from your code, and generate shortened key.

## 功能
1. 自动提取待翻译的 key/value，生成缩短过后的 key（用 CRC16）
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

更多配置项，请参考 [i18n-abc.config.js](/i18n-abc.config.js)。

### 扫描
开始扫描并生成 i18n 文件:

```bash
i18n-abc scan
```

### 处理
处理 i18n 文件，比如简体中文转繁体中文，清理没有翻译的文本。

```bash
i18n-abc transform
```

### 提取未翻译文本
提取未翻译的文本，并生成对应语言的 csv 文件。

```bash
i18n-abc diff
```

### 翻译
将已翻译好的 excel 文件应用到 json 文件中。
注意：excel 文件名需和语言代码对应，表格第一列为待翻译文本，第二列为翻译好的文本。

```shell script
i18n-abc translate
```

## todo
1. 增加一个 root path，所有配置都相对于该 root path
```json
{
  "root": "./web/",
  "scan": {}
}
```
