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
    filename: isDevelopment
      ? '[name].bundle.js'
      : '[name].bundle-[hash:6].js',
    chunkFilename: isDevelopment
      ? '[name].bundle.js'
      : '[name].bundle-[hash:6].js',
    },

  // Enable sourcemaps for debugging webpack's output.
  devtool: isDevelopment
    ? 'source-map'
    : '',

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
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      constants: path.resolve(__dirname, 'src/constants'),
      containers: path.resolve(__dirname, 'src/containers'),
      routing: path.resolve(__dirname, 'src/routing'),
    },
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
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
          name: "file-loader?name=[name].[ext]",
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

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },

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
