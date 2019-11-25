const fs = require('fs')
const path = require('path')
const chineseS2T = require('chinese-s2t')

function getFileJSON (resPath) {
  try {
    return JSON.parse(fs.readFileSync(resPath).toString('utf-8'))
  }
  catch (e) {
    console.error(e)
    return {}
  }
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

module.exports = function start (cleanConfig) {
  const fullTranslationDir = path.resolve(process.cwd(), cleanConfig.input)

  const files = fs.readdirSync(fullTranslationDir)

  files.forEach(filename => {
    const translation = getFileJSON(path.resolve(fullTranslationDir, filename))

    let cleanedTranslation = translation

    if (filename.toLowerCase().includes('zh-cn')) {
    }
    else if (filename.includes('zh-tw') && cleanConfig.autoS2T) {
      cleanedTranslation = zhCN2zhTW(translation)
    }
    else if (cleanConfig.raw.remove) {
      cleanedTranslation = removeRawValue(translation, cleanConfig.raw.regex)
    }

    fs.writeFileSync(path.resolve(process.cwd(), cleanConfig.output, filename), JSON.stringify(cleanedTranslation, null, 2), 'utf8')
  })

  console.log(files)
}