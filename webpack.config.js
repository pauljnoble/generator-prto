import Webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'

export default {
    entry: [
        './src/js/index.js',
        './src/styles/index.styl'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: './',
        contentBase: './src/'
    },
    resolve: {
        extensions: [
            '',
            '.js',
            '.styl'
        ],
        modulesDirectories: [
            'bower_components',
            'node_modules'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015'],
                }
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
            }
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css')
    ]
}
