const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/cli.ts',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/migration_template.js', info: { minimized: true } },
      ],
    }),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      include: /cli\.js$/,
    }),
  ],
  module: {
    parser: {
      javascript: {
        // https://github.com/webpack/webpack/issues/4175#issuecomment-770769441
        commonjsMagicComments: true,
      },
    },
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    clean: true,
    filename: 'cli.js',
    path: path.resolve(__dirname, 'd'),
  },
};
