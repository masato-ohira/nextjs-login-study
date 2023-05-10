module.exports = {
  globals: {
    $nuxt: false,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:import/warnings',
    'prettier',
  ],
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'no-multi-spaces': 0,
    'no-unused-vars': 1,
    'no-irregular-whitespace': 1,
    'max-len': 0,
    // 'quotes': [1, 'single', {"avoidEscape": true}],
    quotes: [1, 'single', { allowTemplateLiterals: true }],

    // セミコロン省略
    semi: ['error', 'never', { beforeStatementContinuationChars: 'never' }],
    'semi-spacing': ['error', { after: true, before: false }],
    'semi-style': ['error', 'first'],
    'no-extra-semi': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
  },
}
