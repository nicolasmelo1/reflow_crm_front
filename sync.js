const fs = require('fs')

const args = process.argv.slice(2);

// keeps the root package.json in sync with the directory package.json
const sharedPackageJson = require('./package.json')
sharedPackageJson.dependencies = {}
args.forEach(arg=> {
    let localPackageJson = require(`./${arg}/package.json`)
    
    Object.keys(localPackageJson.dependencies).forEach(dependency => {
        sharedPackageJson.dependencies[dependency] = localPackageJson.dependencies[dependency]
    })

    fs.writeFileSync(`./package.json`, JSON.stringify(sharedPackageJson, null, 2))
})
