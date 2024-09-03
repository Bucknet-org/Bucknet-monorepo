const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"), //can be polyfilled here if needed
    stream: require.resolve("stream-browserify"), //can be polyfilled here if needed
    assert: require.resolve("assert"), //can be polyfilled here if needed
    http: require.resolve("stream-http"), //can be polyfilled here if needed
    https: require.resolve("https-browserify"), //can be polyfilled here if needed
    os: require.resolve("os-browserify"), //can be polyfilled here if needed
    url: require.resolve("url"), //can be polyfilled here if needed
    zlib: require.resolve("browserify-zlib"), //can be polyfilled here if needed
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};
