var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var autoprefixer = require('autoprefixer');

loaders.push({
	test: /\.scss?$/,
	loader: 'style-loader!css-loader!postcss-loader!sass-loader',
	include: path.join(__dirname, 'src', 'styles')
});

module.exports = {
	entry: [
		'./lib/index.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'Richie.js',
		publicPath: '/'
	},

	module: {
		loaders
	},
	//postcss: [ autoprefixer ],
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.LoaderOptionsPlugin({
			options: {
				context: __dirname,
				postcss: [
					autoprefixer
				]
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
};
