const fs = require('fs')
const path = require('path')
const po2json = require('po2json')
const isEmpty = require('is-blank')

function isValid (arg) {
  return !isEmpty(arg)
}

class GettextHtmlPlugin {
  constructor (options = {}) {
    const defaultOptions = {
      prefix: '{{',
      suffix: '}}',
      langsPath: null,
      injectLang: true,
      regenerateLangFile: true,
      sources: {}
    }

    this.options = {}

    Object.keys(defaultOptions).forEach(key => {
      const value = options[key]
      this.options[key] = isValid(value) ? value : defaultOptions[key]
    })
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('GettextHtmlPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('GettextHtmlPlugin', data => {
        const { langsPath, regenerateLangFile, sources, injectLang } = this.options
        const langFileName = sources[data.outputName]

        if (isValid(langFileName) && isValid(langsPath)) {
          const langFilePath = path.resolve(this.options.langsPath, `${langFileName}.po`)
          let langData = {}

          try {
            langData = po2json.parseFileSync(langFilePath)
          } catch (err) {
          }

          if (regenerateLangFile || isEmpty(langData)) {
            this.regenerate(data.html, langFilePath, langData, langFileName)
          }

          if (injectLang) {
            data.html = this.injectLang(data.html, langFileName)
          }

          data.html = this.translate(data.html, langData)
        } else {
          data.html = data.html
            .replace(new RegExp(this.options.prefix, 'g'), '')
            .replace(new RegExp(this.options.suffix, 'g'), '')
        }
      })
    })
  }

  translate (html, langData) {
    Object.keys(langData)
      .filter(key => isValid(key))
      .forEach(key => {
        const item = `${this.options.prefix}${key}${this.options.suffix}`
        const value = isValid(langData[key][1]) ? langData[key][1] : key

        while (html.includes(item)) {
          html = html.replace(item, value)
        }
      })

    return html
  }

  regenerate (html, langFilePath, langData, langFileName) {
    const { prefix, suffix } = this.options
    const regx = new RegExp(`${prefix}[^${suffix}]+${suffix}`, 'g')
    const matches = html.match(regx)

    const langList = []

    Array.from(new Set(matches)).forEach(raw => {
      const key = raw
        .replace(new RegExp(prefix, 'g'), '')
        .replace(new RegExp(suffix, 'g'), '')

      const msgid = key.replace(/"/g, '\\"')
      let msgstr = ''

      if (isValid(langData[key])) {
        msgstr = langData[key][1].replace(/"/g, '\\"')
      }

      langList.push(`msgid "${msgid}"\nmsgstr "${msgstr}"`)
    })

    const langContent = 
    `msgid ""
msgstr ""
"Plural-Forms: nplurals=1; plural=0;\\n"
"Project-Id-Version: \\n"
"POT-Creation-Date: \\n"
"PO-Revision-Date: \\n"
"Last-Translator: \\n"
"Language-Team: \\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Language: ${langFileName}\\n"
"X-Generator: Poedit 2.2.3\\n"
"X-Poedit-SourceCharset: UTF-8\\n"\n\n` + langList.join('\n\n')

    fs.writeFileSync(langFilePath, langContent)
  }

  injectLang (html, langName = 'en') {
    return html
      .replace(/<html\s?(lang=([^<>]*))>/, () => {
        return `<html lang=${langName}>`
      })
      .replace(/<body\s?(class=([^<>]*))?>/, (...args) => {
        langName = langName.replace(/_/g, '-').toLowerCase()
        const className = isValid(args[2]) ? `${args[2]} ${langName}` : langName
        return `<body class=${className}>`
      })
  }
}

module.exports = GettextHtmlPlugin
