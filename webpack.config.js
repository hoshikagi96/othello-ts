const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
    mode: 'development',
    entry: {
        'bundle': './src/app.ts',
        'style.css': './src/style.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // [name]はentryで記述した名前(この例ではbundle）が入る
        publicPath: '/dist'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    devServer: {
        static: [{
                directory: path.resolve(__dirname, "dist"),
                publicPath: '/dist'
            },
            {
                directory: __dirname,
                publicPath: '/',
            }
        ]
    },
    devtool: 'eval',
    module: {
        rules: [{
                // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ]
}