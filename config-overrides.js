const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add the following resolve configuration
  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  };

  // Add the necessary polyfill packages
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  );

  return config;
};
