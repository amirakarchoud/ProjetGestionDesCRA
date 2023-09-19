// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = function (config) {
  return {
    entry: ['./src/main.ts'],
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: 'development',
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '.env*'),
            to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'dist.js',
    },
  };
};
