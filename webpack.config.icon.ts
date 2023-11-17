import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/igen.ts',
    output: {
        filename: 'igen.js',
        path: path.resolve(__dirname, 'temp'),
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
    target: 'node',
};

export default config;
