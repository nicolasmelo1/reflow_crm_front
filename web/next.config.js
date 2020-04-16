const path = require('path')

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
  