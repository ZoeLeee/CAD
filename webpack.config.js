const webpack = require('webpack');
var path = require('path');

var HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: __dirname+"/src/index.tsx",
  output: {
      filename: "bundle.js",
      path: __dirname + "/dist"
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "eval-source-map",

  resolve: {
    alias: {
        Components: path.join(__dirname, '..', 'src', 'scripts', 'components')
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
      rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
          {
              test: /\.css$/,
              use: [
                  {
                      loader: "style-loader"
                  }, {
                      loader: "css-loader"
                  }
              ]
          }
      ]
  },
  devServer: {
    contentBase: "./dist/",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    port:"9527"
  } ,
  plugins: [
    
    new HtmlWebPackPlugin({ title: "webCAD" ,template:"./index.html"})
  ],
};