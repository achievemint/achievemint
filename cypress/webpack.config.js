import webpack from "webpack";
import path from "path";

const config = {
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            '@mui': path.resolve('./node_modules/@mui'),
            '@': path.resolve('./src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['next/babel'],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env), // injects real env vars
        }),
    ],
};

export default config;