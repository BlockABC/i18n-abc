const _ = require('lodash')
const eol = require('eol')
const path = require('path')
const sortobject = require('sortobject')
const VirtualFile = require('vinyl')
const flattenObjectKeys = require('i18next-scanner/lib/flatten-object-keys').default
const omitEmptyObject = require('i18next-scanner/lib/omit-empty-object').default
const utils = require('./utils')
// options 里面获取不到 output，只能这样搞一个了
module.exports = function generateI18nextScannerConfig (config) {
  return {
    input: config.input,
    output: config.output,
    options: {
      debug: false, // 会在控制台输出一堆 log
      removeUnusedKeys: config.removeUnusedKeys,
      sort: true,
      // attr: {}
      // trans: {
      // component: 'i18n',
      // i18nKey: 'path',
      // extensions: ['.vue'],
      // fallbackKey:
      // },
      func: {
        // i18next-scanner 的 bug，一定要写 \\\$
        // https://github.com/i18next/i18next-scanner/issues/80
        // eslint-disable-next-line no-useless-escape
        list: config.functions, // 翻译函数的名字
        extensions: config.extensions
      },
      lngs: config.langs,
      defaultLng: 'en',
      // ns: [],
      // defaultNs: '',
      defaultValue: function (lang, ns, key) {
        return key
      },
      resource: {
        loadPath: '{{lng}}.json',
        savePath: '{{lng}}.json',
        jsonIndent: 2,
        lineEnding: '\n',
      },
      // context: true, // 高级功能，暂时不需要
      nsSeparator: false,
      keySeparator: '||', // 通过 $tt('parent||child') 的形式来区分
      interpolation: {
        prefix: '{{',
        suffix: '}}'
      },
    },
    flush: function (done) {
      const { parser } = this
      const { options } = parser

      // Flush to resource store
      const resStore = parser.get({ sort: options.sort })
      const { jsonIndent } = options.resource
      const lineEnding = String(options.resource.lineEnding).toLowerCase()

      Object.keys(resStore).forEach(lang => {
        const namespaces = resStore[lang]

        Object.keys(namespaces).forEach(ns => {
          let translations = namespaces[ns]

          const oldTranslationPath = parser.formatResourceSavePath(lang, ns)

          let oldTranslations = {}

          try {
            oldTranslations = utils.readJSON(path.resolve(config.output, oldTranslationPath), true)
          }
          catch (err) {
            console.log(`Previous locales ${oldTranslationPath} doesn't exist, new file is generated`)
          }

          // 如果有 key 生成函数，则用 key 生成函数重新生成配置
          if (config.generateKey) {
            translations = Object.keys(translations).reduce((reduced, key) => {
              const shortKey = config.generateKey(key)
              reduced[shortKey] = translations[key]

              return reduced
            }, {})
          }

          if (options.removeUnusedKeys) {
            const namespaceKeys = flattenObjectKeys(translations)
            const oldTranslationKeys = flattenObjectKeys(oldTranslations)
            const unusedKeys = _.differenceWith(
              oldTranslationKeys,
              namespaceKeys,
              _.isEqual
            )

            for (let i = 0; i < unusedKeys.length; ++i) {
              _.unset(oldTranslations, unusedKeys[i])
            }

            oldTranslations = omitEmptyObject(oldTranslations)
          }

          translations = sortobject({ ...translations, ...oldTranslations })

          let text = `${JSON.stringify(translations, null, jsonIndent)}\n`

          if (lineEnding === 'auto') {
            text = eol.auto(text)
          }
          else if (lineEnding === '\r\n' || lineEnding === 'crlf') {
            text = eol.crlf(text)
          }
          else if (lineEnding === '\n' || lineEnding === 'lf') {
            text = eol.lf(text)
          }
          else if (lineEnding === '\r' || lineEnding === 'cr') {
            text = eol.cr(text)
          }
          else {
            // Defaults to LF
            text = eol.lf(text)
          }

          this.push(
            new VirtualFile({
              path: oldTranslationPath,
              contents: Buffer.from(text),
            })
          )
        })
      })

      done()
    }
  }
}
