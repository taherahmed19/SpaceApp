const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		main: ['/src/css/main.scss', '/src/js/main.js'],
		app: ['/src/js/app.js',],
		earth: ['/src/js/earth.js'],
		asteroid: ['/src/js/asteroid.js'],
	},
	output: {
		path: path.resolve(__dirname + "/dist"),
		filename: 'js/[name].js',
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '/css/main.css',
						}
					},
					{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
						}
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'

					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new copyPlugin({
			patterns: [
				{ from: "./src/models/", to: "./models" },
			],
		}),
	],
};