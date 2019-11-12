const fs = require('fs')
const crc16 = require('js-crc').crc16

/**
 * 读取 json
 * @param resPath
 * @return {object}
 */
function readJSON (resPath) {
  try {
    return JSON.parse(fs.readFileSync(resPath).toString('utf-8'))
  }
  catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * 生成缩减的 key
 * @param key
 * @return {string}
 */
function makeKey (key) {
  return key.length > 8 ? key.slice(0, 8) + '_' + crc16(key).slice(0, 3) : key
}

module.exports = {
  readJSON,
  makeKey,
}
