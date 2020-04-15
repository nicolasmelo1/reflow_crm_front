import moment from 'moment'

const momentJSDateFormat = {
    '%Y': 'YYYY',
    '%m': 'MM',
    '%d': 'DD',
    '%H': 'H',
    '%M': 'mm',
    '%S': 'ss'
}

const pythonFormatToMomentJSFormat = (pythonFormat) => {
    let format = pythonFormat
    for (var key in momentJSDateFormat) {
        if (momentJSDateFormat.hasOwnProperty(key)) {
            format = format.replace(key, momentJSDateFormat[key])
        }
    }
    return format
}


const stringToJsDateFormat = (date, format) => {
    date = moment(date, format);
    return date.toDate()
}

const jsDateToStringFormat = (date, format) => {
    let newValue = format
    if (typeof newValue === 'string') {
        Object.keys(momentJSDateFormat).forEach(possibleFormat => {
            switch(momentJSDateFormat[possibleFormat]) {
                case 'YYYY':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], date.getFullYear().toString())
                    break;
                case 'MM':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], (date.getMonth()+1 < 10 ) ? '0' + (date.getMonth()+1).toString(): (date.getMonth()+1).toString())
                    break;
                case 'DD':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], (date.getDate() < 10 ) ? '0' + date.getDate().toString(): date.getDate().toString())
                    break;
                case 'H':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], (date.getHours() < 10 ) ? '0' + date.getHours().toString(): date.getHours().toString())
                    break;
                case 'mm':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], (date.getMinutes() < 10 ) ? '0' + date.getMinutes().toString(): date.getMinutes().toString())
                    break;
                case 'ss':
                    newValue = newValue.replace(momentJSDateFormat[possibleFormat], (date.getSeconds() < 10 ) ? '0' + date.getSeconds().toString(): date.getSeconds().toString())
                    break;
                default:
                    newValue
            }
        })
    }
    return newValue
}

export {pythonFormatToMomentJSFormat}
export {stringToJsDateFormat}
export {jsDateToStringFormat}