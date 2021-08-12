const path = require('path')
const withOffline = require('next-offline')


// some configurations are for monorepo to work, you might want to read this:
// https://medium.com/@agungsurya/create-a-monorepo-of-react-native-and-nextjs-8b93df280343
module.exports = withOffline({
    // until `env` it is just withOffline configuration. We use it to build a serviceworker from Google Workbox, from our needs we just inject
    // with GenerateSw. you can check the lib here for reference: https://github.com/hanford/next-offline
    // check the official next.js example here: https://github.com/zeit/next.js/tree/canary/examples/with-next-offline.
    // we are aware of GenerateSw errors in development, you can disable by setting `generateInDevMode` to false
    // useful links: 
    // - https://github.com/hanford/next-offline/issues/229#issuecomment-606102727
    // - https://github.com/hanford/next-offline/issues/35#issuecomment-415367268
    // - https://github.com/hanford/next-offline/issues/35
    // - (For workbox options) - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW
    // - (For workbox options) - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest
    generateInDevMode: false,
    dontAutoRegisterSw: true,
    //generateSw: false,
    workboxOpts: {
        maximumFileSizeToCacheInBytes: 60000000,
        swDest: '../public/service-worker.js',
        importScripts: ['push.js'],
        runtimeCaching: [
            {
                urlPattern: new RegExp(`^${process.env.FRONT_END_HOST ? process.env.FRONT_END_HOST : 'http://localhost:3000/'}?.*`, 'g'),
                handler: "NetworkFirst",
                options: {
                    cacheName: "https-calls",
                    networkTimeoutSeconds: 15,
                    expiration: {
                        maxEntries: 150,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }
        ]
    },
    env: {
        // This is defined in the reflow_tracking application to trach users before they become users of reflow, so make a
        // double check there to see if it's set up correctly.
        REFLOW_VISITOR_ID_COOKIE_KEY: 'reflow_visitor_id',
        REGISTER_SW_IN_DEV_MODE: false,
        VINDI_PUBLIC_API: process.env.VINDI_PUBLIC_API ? process.env.VINDI_PUBLIC_API : 'https://sandbox-app.vindi.com.br/api/v1/public/payment_profiles',
        VINDI_PUBLIC_API_KEY: process.env.VINDI_PUBLIC_API_KEY ? process.env.VINDI_PUBLIC_API_KEY :  'uNZqO8kJbVRIRSiBEsbyWRGtpTGLd432AxXHYltw_Ow',
        FRONT_END_HOST: process.env.FRONT_END_HOST ? process.env.FRONT_END_HOST : 'http://localhost:3000/',
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
                './dynamicImport.mobile': './dynamicImport.web',
                "react-native": path.join(__dirname, 'node_modules', 'react-native-web'),
                "expo": path.join(__dirname, 'node_modules', 'react-native-web')
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

        config.module.exprContextCritical = false
        
        return config
    }
})
  