const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry:  {
    index: './js/index.js'
  },
  output: {
    filename:'js/[name].[hash].bundle.js',
    // publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    // pathinfo: false
  },
  devtool: "source-map",
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {loader: "style-loader"},
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: '[folder]__[local]--[hash:base64:5]',
              }
            }
          },
          {loader: "less-loader",
            options: {
              // modifyVars: themeVariables,
              root: path.resolve(__dirname, './')
            }
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-inline-svg'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ]
      },
      // {
      //   test: /\.html$/,
      //   include: path.resolve(__dirname, "src/html/includes"),
      //   use: ["raw-loader"]
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.[hash].bundle.css"
    }),
    new CopyWebpackPlugin([
      {
        from: "./assets",
        to: "./assets"
      },{
        from: "./css",
        to: "./css"
      },{
        from: "./js/jquery.js",
        to: "./js/jquery.js"
      },{
        from: "./js/less.js",
        to: "./js/less.js"
      },
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: true,
      production: 'production'
    }),
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
