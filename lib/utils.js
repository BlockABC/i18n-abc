const fs = require('fs')

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

module.exports = {
  readJSON,
}
