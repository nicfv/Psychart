const path = require('path');

module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'docs'),
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'swc-loader' },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    },
    mode: 'production',
};