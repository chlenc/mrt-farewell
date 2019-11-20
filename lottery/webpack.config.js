const webpack = require('webpack');
const copy = require('copy-webpack-plugin');
const path = require('path');

const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


module.exports = (env, argv) => {

    const outputPath = path.resolve(__dirname, 'dist');

    return {
        entry: {
            app: './src/index.tsx'
        },
        mode: argv.mode,
        output: {
            filename:'[name].[hash].bundle.js',
            // chunkFilename: '[name].[chunkhash].bundle.js',
            publicPath: '/',
            path: outputPath,
            pathinfo: false
        },
        plugins: [
            new copy([
                {from: 'src/assets', to: 'assets'}
            ]),
            new HtmlWebpackPlugin({
                template: 'template.html',
                hash: true,
                production: argv.mode === 'production'
            }),
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
        ],

        //Enable sourcemaps for debugging webpack's output.
        devtool: argv.mode === 'development' ? 'eval' : undefined,

        resolve: {
            //Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.css']
        },
        optimization: {
            minimize: true,
            minimizer: [

            ]
        },

        module: {
            rules: [
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    loader: "url-loader?limit=1000&name=assets/img/[name].[ext]",
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        {loader: "style-loader"},
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                localIdentName: '[folder]__[local]--[hash:base64:5]',
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
                    ],
                },
            ]
        },
        externals: {

        },
        devServer: {
            hot: true,
            historyApiFallback: true,
        }
    }
};
