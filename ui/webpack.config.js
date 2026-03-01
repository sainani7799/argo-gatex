const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  
  // Suppress source map warnings from node_modules
  config.ignoreWarnings = [
    /Failed to parse source map/,
  ];
  
  return config;
});
