const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const pkg = require('./package.json');
var coreCSS="/*not generated yet*/"


const env = process.env.NODE_ENV;


module.exports = function (env, argv) {

  let builddir = argv.mode== 'production' ? 'dist' : 'test';

  return {
    watch: argv.mode != 'production',
    target: 'web',
    optimization: {


    },


    mode: argv.mode,
    entry: {
      "imp": './src/editor_launcher.js',
      "hatcher" : './src/hatcher.js',
      "helpers" : './src/helpers.js' 
    },
    devtool: argv.mode != "production" ? 'inline-source-map' : false, 

    output: {
    //   filename: '[name].js',
      path: path.resolve(__dirname, builddir, "")
    },

    module: {
      rules: [

        {
          test: /\.svg$/,
          resourceQuery: /raw/,
          type: 'asset/source'
        },

        {
          test: /\.svg$/,
          resourceQuery: { not: [/raw/] },
          type: 'asset/inline'
        },

        {
          test: /\.(less|css|scss)$/,
          use: [
            'style-loader' ,
            'css-loader',
            'sass-loader'
          ],
        },
        {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
        {
          test: /\.(woff|ttf)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
          ],
        }
      ]

    },
    plugins: [
      new webpack.DefinePlugin({
        // Definitions...
        'VERSION': JSON.stringify(pkg.version)
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebpackPlugin({

        chunks: ["editor"],
        filename: 'index.html',
        minify: false,
        inject: false,
        css: coreCSS,
        // scriptLoading: 'defer',
        template: path.join(__dirname, "src/templates/index.ejs"),
      }
      ),

      new HtmlWebpackPlugin({

        chunks: ["hatcher"],
        filename: 'hatcher.html',
        minify: false,
        inject: "body",
        template: path.join(__dirname, "src/templates/hatcher.ejs"),
      }
      ),
    ],
  };
}
