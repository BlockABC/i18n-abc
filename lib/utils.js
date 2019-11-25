const fs = require('fs')
const crc16 = require('js-crc').crc16

/**
 * 读取 json
 * @param resPath
 * @param emitError {Boolean} 是否把错误暴露出去
 * @return {object}
 */
function readJSON (resPath, emitError = false) {
  try {
    return JSON.parse(fs.readFileSync(resPath).toString('utf-8'))
  }
  catch (err) {
    if (emitError) {
      throw err
    }

    console.error(err)
    return {}
  }
}

/**
 * 生成缩减的 key
 * @param key
 * @return {string}
 */
function makeCrcKey (key) {
  return key.length > 8 ? key.slice(0, 8) + '_' + crc16(key).slice(0, 3) : key
}

module.exports = {
  readJSON,
  makeCrcKey,
}
