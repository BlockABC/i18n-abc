const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')

module.exports = function (translateConfig) {
  translateConfig.langs.forEach((lang) => {
    const workbook = xlsx.readFile(path.resolve(translateConfig.input, `${lang}.xlsx`))
    const jsonPath = path.resolve(translateConfig.output, `${lang}.json`)
    const json = utils.readJSON(jsonPath)
    const sheet = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheet]

    for (let i = 1; i < Object.keys(worksheet).length; i++) {
      const keyIndex = `A${i}`
      const valueIndex = `B${i}`

      // 获取 key 的值
      const keyCell = worksheet[keyIndex]
      let key = keyCell ? keyCell.v : null

      if (!key) {
        continue
      }

      // 获取 value 的值
      const valueCell = worksheet[valueIndex]
      const value = valueCell ? valueCell.v : null

      if (key && value) {
        key = key.replace(/\u00A0/g, ' ') // 由于未知原因，给过来的翻译文件里面会出现 charCode===160 的空格，因此要把这种空格换成正常的空格
        const shortenKey = translateConfig.generateKey(key)
        const jsonValue = json[shortenKey]
        if (jsonValue) {
          json[shortenKey] = value
        }
      }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2))
  })
}
