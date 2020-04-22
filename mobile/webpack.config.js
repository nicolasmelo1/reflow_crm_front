const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

// this is basically for the web version of our mobile app to work, actually most of this webpack config was copied from `next.config.js`
// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function(env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            "react-native": path.join(__dirname, 'node_modules', 'react-native-web'),
            "@react-native-community/async-storage": "react-native-web/dist/exports/AsyncStorage/index.js"
        },
        modules: [
            path.resolve(__dirname, 'node_modules')
        ],
        symlinks: false,
    }

    config.module.rules.push({
        use: 'babel-loader',
        include: [path.resolve(__dirname, '../shared')]
    })

    return config
};
