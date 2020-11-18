/* eslint-disable no-dupe-keys */
module.exports = {
	parser:  '@typescript-eslint/parser', //定义ESLint的解析器
	parserOptions: {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	extends: ['plugin:@typescript-eslint/recommended'], //定义文件继承的子规范
	//定义了该eslint文件所依赖的插件
	plugins: [
		'@typescript-eslint',
		'react'
	],
	env: { //指定代码的运行环境
		'browser': true,
		'commonjs': true,
		'node': true,
		'es6': true
	},
	rules: {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'@typescript-eslint/ban-ts-comment': ['warn'],
	}
}
