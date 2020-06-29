#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const vfs = require('vinyl-fs')
const sort = require('gulp-sort')
const scanner = require('i18next-scanner/lib')
const pkg = require('./package.json')
const _ = require('lodash')
const generateI18nextScannerConfig = require('./lib/i18next-scanner.config')
const transformRawLocales = require('./lib/transform-raw-locales')
const translateExcel = require('./lib/translate-excel')
const diff = require('./lib/diff-increment')
const defaultConfig = require('./i18n-abc.config.js')

function getConfig (configPath = 'i18n-abc.config.js') {
  const config = require(path.resolve(configPath))

  if (!config) {
    throw new Error('未找到 i18n-abc.config.js 文件')
  }

  return _.merge(defaultConfig, config)
}

program
  .command('scan')
  .option('-c <config>', '指定配置信息，默认为 ./i18n-abc.config.js')
  .description('扫描文件内容，生成 i18n 的多语言文件')
  .action(function (option) {
    console.log('start to scan')
    console.log(option)
    const i18nextScannerConfig = generateI18nextScannerConfig(getConfig(option.C).scan)

    vfs.src(i18nextScannerConfig.input)
      .pipe(sort()) // Sort files in stream by path
      .pipe(scanner(i18nextScannerConfig.options, i18nextScannerConfig.transform, i18nextScannerConfig.flush))
      .pipe(vfs.dest(i18nextScannerConfig.output))
  })

program
  .command('transform')
  .option('-c <config>', '指定配置信息，默认为 ./i18n-abc.config.js')
  .description('转化多语言文件，生成新的，生产环境使用的多语言文件')
  .action(function (option) {
    console.log('start to transform')
    const transformConfig = getConfig(option.C).transform

    transformRawLocales(transformConfig)
  })

program
  .command('translate')
  .option('-c <config>', '指定配置信息，默认为 ./i18n-abc.config.js')
  .description('从 Excel 中提取翻译并应用于同名的 json 文件')
  .action(function (config) {
    console.log('start to translate')
    const translateConfig = getConfig(config.config).translate

    translateExcel(translateConfig)
  })

program
  .command('diff')
  .option('-c <config>', '指定配置信息，默认为 ./i18n-abc.config.js')
  .description('从 json 文件中提取未翻译的内容，并生成 excel 文件')
  .action(function (config) {
    console.log('start to translate')
    const translateConfig = getConfig(config.config).diff

    diff(translateConfig, config)
  })

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('--config <config>', 'Path to the config file (default: i18next-scanner.config.js)', 'i18next-scanner.config.js')
  .option('--output <path>', 'Path to the output directory (default: .)')

program.parse(process.argv) // 解析命令行参数
