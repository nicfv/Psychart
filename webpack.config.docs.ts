import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'docs'),
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'swc-loader' },
            { test: /\.svg$/, type: 'asset/resource' },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    },
};

export default config;