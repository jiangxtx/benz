/* eslint-disable no-dupe-keys */
module.exports = {
  parser: '@typescript-eslint/parser', //定义ESLint的解析器
  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  //定义文件继承的子规范
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  //定义了该eslint文件所依赖的插件
  plugins: ['@typescript-eslint', 'react'],
  env: {
    //指定代码的运行环境
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  //自动发现React的版本，从而进行规范react代码
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  rules: {
    // indent: ['error', 'space'], // conflict with prettier, so ignore it.
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/ban-ts-comment': ['warn'],
  },
}
