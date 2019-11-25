const fs = require('fs')
const path = require('path')
const utils = require('./utils')

module.exports = function (diffConfig, allConfig) {
  diffConfig.langs.forEach(lang => {
    const raw = utils.readJSON(path.resolve(diffConfig.input, `${lang}.json`))

    const output = []

    Object.keys(raw).forEach(key => {
      const value = raw[key]
      if (value.match(diffConfig.raw.regex)) {
        output.push(value)
      }
    })

    const csv = output.reduce((ret, value) => {
      return ret + value + '\n'
    }, '')

    fs.writeFileSync(path.resolve(diffConfig.output, `${lang}.diff.csv`), csv, 'utf8')
  })
}
