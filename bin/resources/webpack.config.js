const path = require('path');

const config = {
  entry: {
    app: ['./src/components/index.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    globalObject: 'this',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.wasm', '.mjs', '*'],
  },
  mode: 'development',
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all', // both : consider sync + async chunks for evaluation
          name: 'vendor', // имя чанк-файла
          test: /node_modules/, // test regular expression
        },
      },
    },
  },
};

module.exports = config;
