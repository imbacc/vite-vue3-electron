const { eslintConfig } = require('imba-config')
eslintConfig.rules = Object.assign(eslintConfig.rules, {
  '@typescript-eslint/no-use-before-define': 'off',
})
module.exports = eslintConfig
