# Gettext Html Plugin

## Install

```
npm install gettext-html-plugin --save-dev
```

## Useage

**webpack.config.js**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GettextHtmlPlugin = require('gettext-html-plugin')

module.exports = {
  entry: {
    index: 'index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'zh-cn.html',
      template: __dirname + '/index.html',
      chunks: ['index']
    }),
    new GettextHtmlPlugin({
      langsPath: __dirname + '/langs',
      sources: {
        'zh-cn.html': 'zh_CN'
      }
    })
  ]
}
```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|prefix|`{String}`|`{{`|Prefix of package untranslated text|
|suffix|`{String}`|`}}`|Suffix of package untranslated text|
|langsPath|`{String}`|`null`|Translation text path|
|injectLang|`{Boolean}`|`true`|Modify the html lang attribute and add a language to the body class name|
|regenerateLangFile|`{Boolean}`|`true`|Automatically regenerate translated text after modifying html|
|sources|`{Object}`|`{}`|Relationships of html and translation language|