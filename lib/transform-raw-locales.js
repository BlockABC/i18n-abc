const fs = require('fs')
const path = require('path')
const chineseS2T = require('chinese-s2t')
const { readJSON } = require('./utils')

/**
 * 根据 rawRegex，来将未翻译的 translation 用 fallbackTranslation 代替
 * @param translation
 * @param fallbackTranslation
 * @param rawRegex
 */
function useFallback (translation, fallbackTranslation, rawRegex) {
  for (const key in translation) {
    if (Object.prototype.hasOwnProperty.call(translation, key)) {
      const value = translation[key]

      if (value.match(rawRegex)) {
        translation[key] = fallbackTranslation[key] || value
      }
    }
  }

  return translation
}

/**
 * 把未翻译的中文文本移除掉
 * @param obj
 * @param rawRegex
 * @return {*}
 */
function removeRawValue (obj, rawRegex) {
  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'object') {
      obj[key] = removeRawValue(value, rawRegex)
    }
    else if (value.match(rawRegex)) {
      delete obj[key]
    }
  }

  return obj
}

/**
 * 把简体中文自动化翻译成繁体中文
 * @param obj
 * @return {*}
 */
function zhCN2zhTW (obj) {
  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'object') {
      obj[key] = zhCN2zhTW(value)
    }
    else {
      obj[key] = chineseS2T.s2t(value)
    }
  }
  return obj
}

module.exports = function start (transformConfig) {
  const fullTranslationDir = path.resolve(process.cwd(), transformConfig.input)

  const files = fs.readdirSync(fullTranslationDir)
  const fallbackTranslation = readJSON(path.resolve(fullTranslationDir, `${transformConfig.fallbackLang}.json`))

  files.forEach(filename => {
    const translation = readJSON(path.resolve(fullTranslationDir, filename))

    let transformedTranslation = translation

    // 默认文本不做任何处理
    if (!filename.toLowerCase().includes(transformConfig.defaultLang.toLowerCase())) {
      // 对于繁体中文特殊处理下
      if (filename.match(/-hant|-tw|-hk/gi) && transformConfig.autoS2T) {
        transformedTranslation = zhCN2zhTW(translation)
      }
      // 是否使用默认语言代替未翻译文本
      else if (transformConfig.raw.useFallback) {
        transformedTranslation = useFallback(transformedTranslation, fallbackTranslation, transformConfig.raw.regex)
      }
      // 删除未翻译文本
      else if (transformConfig.raw.removeRawKeys) {
        transformedTranslation = removeRawValue(translation, transformConfig.raw.regex)
      }
    }

    fs.writeFileSync(path.resolve(process.cwd(), transformConfig.output, filename), JSON.stringify(transformedTranslation, null, 2), 'utf8')
  })

  console.log('files generated', files)
}
