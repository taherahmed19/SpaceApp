const path = require('path');

module.exports = {
	entry: ['/src/css/main.scss', '/src/js/main.js'],
	output: {
		path: path.resolve(__dirname + "/dist"),
		filename: 'js/main.js',
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
	}
};