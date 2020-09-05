module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['@expo/next-adapter/babel', "babel-preset-expo", "@babel/preset-react", ],
        plugins: [
            [
                "module-resolver", 
                {
                    extensions: [".ios.js", ".android.js", ".js", ".json"],
                    alias: {
                        "@shared": "../shared",
                    }
                }
            ], [
                "babel-plugin-transform-inline-environment-variables"
            ]
        ]
    };
};