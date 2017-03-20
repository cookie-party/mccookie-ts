var webpack = require('webpack');

module.exports = [
    {
        name: 'client',
        cache: true,
        entry: {
            app:  './src/client/index.tsx',
            //main: './src/server/main.ts'
        },
        output: {
            path: 'build',
            filename: '[name].js'
        },
        resolve: {
            extensions: ['','.webpack.js', '.web.js', '.ts', '.tsx','.js']
        },
        devtool: 'source-map', // if we want a source map 
        module: {
            loaders: [
                {test: /\.css$/,loader: "style-loader!css-loader" },
                {test: /\.tsx?$/,loader: 'ts-loader'}
            ]
        }
    }
];
