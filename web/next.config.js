const path = require('path')
const withOffline = require('next-offline')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// some configurations are for monorepo to work, you might want to read this:
// https://medium.com/@agungsurya/create-a-monorepo-of-react-native-and-nextjs-8b93df280343
module.exports = withOffline({
    // until `env` it is just withOffline configuration. We use it to build a serviceworker from Google Workbox, from our needs we just inject
    // with InjectManifest. you can check the lib here for reference: https://github.com/hanford/next-offline
    // check the official next.js example here: https://github.com/zeit/next.js/tree/canary/examples/with-next-offline, notice they are generating
    // the SW, not Injecting. If you find a way to add push notification with GenerateSW you can change it here.
    // we are aware of InjectManifest errors in development, you can disable by setting `generateInDevMode` to false
    // useful links: 
    // - https://github.com/hanford/next-offline/issues/229#issuecomment-606102727
    // - https://github.com/hanford/next-offline/issues/35
    // - (For workbox options) - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW
    // - (For workbox options) - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest
    generateInDevMode: true,
    dontAutoRegisterSw: true,
    generateSw: false,
    workboxOpts: {
        maximumFileSizeToCacheInBytes: 60000000,
        swSrc: path.join(process.cwd(), '/public/service-worker.js'),
        swDest: process.env.NEXT_EXPORT
            ? 'service-worker.js'
            : 'static/service-worker.js',
    },
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
                '@fortawesome/react-native-fontawesome': '@fortawesome/react-fontawesome',
                "react-native": path.join(__dirname, 'node_modules', 'react-native-web')
            },
            modules: [
                ...config.resolve.modules,
                path.resolve(__dirname, 'node_modules'),
            ],
            symlinks: false,
        }
        config.plugins.push(new CopyWebpackPlugin([path.join(process.cwd(), 'public/push.js')]));
        config.module.rules.push({
            use: defaultLoaders.babel,
            include: [path.resolve(__dirname, '..', 'shared')]
        })

        return config
    }
})
  