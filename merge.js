const fs = require('fs')

const args = process.argv.slice(2);

// keeps directory package.json in sync with the root package.json. The Root package JSON actually works like a 
// Single Source Of Truth of all of the packages used by this project. Please use it to keep all your packages versions in sync
args.forEach(arg=> {
    let localPackageJson = require(`./${arg}/package.json`)
    const sharedPackageJson = require('./package.json')

    Object.keys(localPackageJson.dependencies).forEach(dependency => {
        if (sharedPackageJson.dependencies[dependency]) {
            localPackageJson.dependencies[dependency] = sharedPackageJson.dependencies[dependency]
        }
    })

    fs.writeFileSync(`./${arg}/package.json`, JSON.stringify(localPackageJson, null, 2))
})
