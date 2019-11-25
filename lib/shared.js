// 库内和业务方都可以直接用的函数
const crc16 = require('js-crc').crc16

/**
 * 通过 crc 函数，生成缩减的 key。key.length > 8 则增加 crc，小于 8 则用原文
 * @param key
 * @return {string}
 */
function makeCrcKey (key) {
  return key.length > 8 ? key.slice(0, 8) + '_' + crc16(key).slice(0, 3) : key
}

module.exports = {
  makeCrcKey,
}
