const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
    // Allow imports from outside src/
    config.resolve.modules = [
        ...config.resolve.modules,
        path.resolve(__dirname, 'node_modules')
    ];

    // Disable ModuleScopePlugin to allow imports from node_modules
    config.resolve.plugins = config.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin'
    );

    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
    };

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ];

    return config;
};