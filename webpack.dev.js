const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GoogleFontsPlugin = require('google-fonts-plugin');

module.exports = {
	mode: 'development',
	entry: './src/client/index.js',
	devtool: 'source-map',
	output: {
		libraryTarget: 'var',
		library: 'Client',
		filename: 'min.bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: '/.js$/',
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new Dotenv({
			path: path.resolve(__dirname, './.env'),
			safe: false,
		}),
		new HtmlWebPackPlugin({
			template: './src/client/views/index.html',
			filename: './index.html',
			favicon: './favicon.png',
		}),
		new CleanWebpackPlugin({
			// Simulate the removal of files
			dry: true,
			// Write Logs to Console
			verbose: true,
			// Automatically remove all unused webpack assets on rebuild
			cleanStaleWebpackAssets: false,
			protectWebpackAssets: false,
		}),
	],
};
