const formatNumber = (value, numberFormat) => {
    let newValue = ''

    let prefix = (numberFormat.prefix) ? numberFormat.prefix : '';
    let suffix = (numberFormat.suffix) ? numberFormat.suffix : '';
    let thousandSeparator = (numberFormat.thousand_separator) ? numberFormat.thousand_separator : '';
    let decimalSeparator = (numberFormat.decimal_separator) ? numberFormat.decimal_separator : '';
    
    // get negative symbol
    let negative = value
    // remove any suffixes and prefixes of the negative number we just want the negative signal: '-'
    if (numberFormat.suffix) {
        let regexSufix = new RegExp(`(\\${numberFormat.suffix})$`,"m");
        negative = value.replace(regexSufix,'')
    } 
    if (numberFormat.prefix){
        let regexPrefix = new RegExp(`(^\\${numberFormat.prefix})`,"m");
        negative = negative.replace(regexPrefix,'')
    }
    negative = (negative.charAt(0) == '-') ? '-': '';

    // add decimals and validate decimals
    let valueWithDecimal = value
    if (numberFormat.decimal_separator) {
        valueWithDecimal = valueWithDecimal.split(decimalSeparator)
        valueWithDecimal = valueWithDecimal.slice(0,2).map(value => value.replace(/\D/g,''))
    } else {
        valueWithDecimal = [valueWithDecimal.replace(/\D/g,'')]
    }
    // Add thousand separator
    valueWithDecimal[0] = valueWithDecimal[0].split("").reverse().join("").replace(/(.{3})/g, `$1${thousandSeparator}`).split("").reverse().join("")
    if (numberFormat.thousand_separator) {
        let regexInitWithThousandSeparator = new RegExp(`^(\\${thousandSeparator})`, 'g');
        valueWithDecimal[0] = valueWithDecimal[0].replace(regexInitWithThousandSeparator, '')
    }
    value = valueWithDecimal.join(decimalSeparator)
    newValue = prefix + negative + value + suffix

    return newValue
}

export default formatNumber