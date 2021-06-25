const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  module: {
    rules: [
      { 
        test: /\.handlebars$/, 
        loader: "handlebars-loader",
        options: {
          precompileOptions: {
            knownHelpersOnly: false,
          },
          helperDirs: path.join(__dirname, './src/views/helpers'),
        } 
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: true } }],
      },
      {
        test: /\.(png|jpe?g|jpg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: './img/[name].[ext]',
              limit: 10000,
            },
          },
          {
            loader: 'img-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'webfonts/'
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'js/config.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new MinifyHtmlWebpackPlugin({
      beforeCompile: true,
      dest: './src/assets/minified',
      rules: {
        collapseWhitespace: true,
        removeComments: true,
      },
      src: './src/assets/unminified',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
      chunkFilename: 'css/styles.css',
    }),
    new HtmlWebPackPlugin({
      template: 'src/views/pages/index.handlebars',
      templateParameters: require('./src/_data/strings.json'),
      minify: true,
      filename: 'index.html',
    }),
    new HtmlWebPackPlugin({
      template: 'src/views/pages/release.handlebars',
      templateParameters: require('./src/_data/strings.json'),
      minify: true,
      filename: 'release.html',
    }),
    new HtmlWebPackPlugin({
      template: 'src/views/pages/item.handlebars',
      templateParameters: require('./src/_data/strings.json'),
      minify: true,
      filename: 'item.html',
    }),
    new ManifestPlugin({
      fileName: '../manifesto.json',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: './src/assets/minified',
          to: 'assets' 
        },
      ]
    }),
  ],
};
