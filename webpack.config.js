const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

const devPlugins = [
  htmlWebpackPlugin,
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
];

const prodPlugins = [
  new CompressionPlugin({
    test: /\.(js|css|svg|jpeg|png)$/,
    filename: '[path].gz[query]',
    algorithm: 'gzip',
  }),
];

const pluginList = isDevelopment ? devPlugins : [...devPlugins, ...prodPlugins];

module.exports = {
  entry: {
    index: './src/index.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: isDevelopment ? '[name].bundle.js' : '[name].bundle-[hash:6].js',
    chunkFilename: isDevelopment
      ? '[name].bundle.js'
      : '[name].bundle-[hash:6].js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: isDevelopment ? 'inline-source-map' : '',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    inline: true,
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          name: 'file-loader?name=[name].[ext]',
        },
      },
      {
        test: /\.(svg|jpe?g|png)$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[ext]',
        },
      },
      {
        test: /\.(gif)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
        ],
      },
    ],
  },

  plugins: pluginList,

  optimization: {
    splitChunks: {
      cacheGroups: {
        node_vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 1,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        cache: true,
        extractComments: 'all',
      }),
    ],
  },
};
