const path = require('path')

// some configurations are for monorepo to work, you might want to read this:
// https://medium.com/@agungsurya/create-a-monorepo-of-react-native-and-nextjs-8b93df280343
module.exports = {
    env: {
        API_HOST: process.env.API_HOST,
        APP: 'web'
    },
    webpack: (config, { defaultLoaders }) => {
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage/index.js',
                "react-native": path.join(__dirname, 'node_modules', 'react-native-web')
            },
            modules: [
                ...config.resolve.modules,
                path.resolve(__dirname, 'node_modules'),
            ],
            symlinks: false,
        }

        config.module.rules.push({
            use: defaultLoaders.babel,
            include: [path.resolve(__dirname, '..', 'shared')]
        })

        return config
    }
}
  