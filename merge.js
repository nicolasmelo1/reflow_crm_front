const fs = require('fs')

const args = process.argv.slice(2);

// keeps package.json in sync with the root package.json.
/*args.forEach(arg=> {
    let localPackageJson = require(`./${arg}/package.json`)
    const sharedPackageJson = require('./package.json')

    localPackageJson.dependencies = sharedPackageJson.dependencies

    fs.writeFileSync(`./${arg}/package.json`, JSON.stringify(localPackageJson, null, 2))
})*/
