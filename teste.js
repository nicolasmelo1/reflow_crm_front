const fs = require('fs');
const util = require('util');

filesToRead = [
    'shared/utils/formatNumber.js',
    'shared/utils/charts.js'
]
const readFile = util.promisify(fs.readFile);

const getFilesToInject = async () => {
    let filesAsString = ''
    for (i=0; i<filesToRead.length; i++) {
        let fileContents = await readFile(filesToRead[i], 'utf-8')
        fileContents = fileContents.replace(/import .+ from '.+'/g, '').replace(/export default .+/g, '')
        filesAsString = filesAsString + fileContents
    }
    return filesAsString
}


/**
 * , 'utf8', function (err,data) {
            let fileContents = data.replace(/import .+ from '.+'/g, '').replace(/export default .+/g, '')
            filesAsString = filesAsString + fileContents
        }) 
 */