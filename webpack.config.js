const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const webpack = require('webpack');
const pkg = require('./package.json');
const fs = require('fs');
var coreCSS="/*not generated yet*/"
try{
coreCSS = fs.readFileSync("./src/scss/core.css");
}catch{
 console.log("Generate CSS first")
}





const env = process.env.NODE_ENV;

const econfig = {
  mode: env || 'development'
}



module.exports = function (env, argv) {

  let builddir = 'dist';

  return {
    //externals: ["fs"],
    watch: argv.mode != 'production',
    target: 'web',
    optimization: {


    },


    mode: argv.mode,
    entry: {
      "imp": './src/editor.js',
      "loader": './src/loader.js'
    },
    devtool: argv.mode != "production" ? 'inline-source-map' : false, 
    // devServer: argv.mode != "production" ? {contentBase: 'dist'} : {contentBase: 'dist'},

    output: {
    //   filename: '[name].js',
      path: path.resolve(__dirname, builddir, "")
    },

    module: {
      rules: [

        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
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

        chunks: ["loader"],
        filename: 'index.html',
        minify: false,
        inject: false,
        css: coreCSS,
        // scriptLoading: 'defer',
        template: path.join(__dirname, "src/templates/index.ejs"),
      }
      ),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/loader/]),
      // new HTMLInlineCSSWebpackPlugin(

      //   {
      //     filter: (n)=>{console.log("NAME" , n) ; return n!=="editor.css"},
      //     leaveCSSFile: true,
      //     replace:
      //     {target: '<style id="customCSS">' , 
      //       position: "before",
      //       removeTarget: false,
      //     },
      //     styleTagFactory({ style }){ return `<style id="coreCSS">${ style }</style>`
      //     },
      //   }
      // ),


    ],
  };
}
