const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')

module.exports = function (translateConfig) {
  translateConfig.langs.map((lang) => {
    const workbook = xlsx.readFile(path.resolve(translateConfig.input, `${lang}.xlsx`))
    const jsonPath = path.resolve(translateConfig.output, `${lang}.json`)
    const json = utils.readJSON(jsonPath)
    const sheet = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheet]

    for (let i = 1; ;i++) {
      const keyIndex = `A${i}`
      const valueIndex = `B${i}`

      // 获取 key 的值
      const keyCell = worksheet[keyIndex]
      let key = keyCell ? keyCell.v : null

      if (!key) {
        break
      }

      // 获取 value 的值
      const valueCell = worksheet[valueIndex]
      const value = valueCell ? valueCell.v : null

      if (key && value) {
        key = utils.makeKey(key)
        const jsonValue = json[key]
        if (jsonValue) {
          json[key] = value
        }
      }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2))
  })
}
