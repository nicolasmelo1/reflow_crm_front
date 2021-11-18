import moment from 'moment'
import config from '../config'
import {
    pythonFormatToMomentJSFormat, 
    stringToJsDateFormat,
    jsDateToStringFormat,
    pythonFormatToNumberMarkerFormat
} from '../utils/dates'

class RepresentationService {
    constructor(fieldTypeName, dateFormatType, numberFormatType, formFieldAsOption, loadIds=false) {
        this.fieldTypeName = fieldTypeName
        this.dateFormatType = dateFormatType
        this.numberFormatType = numberFormatType
        this.formFieldAsOption = formFieldAsOption
        this.loadIds = loadIds
    }

    async toInternalValue(value) {
        if (value && value !== '') {
            const methodName = `_toInternalValue${this.fieldTypeName.charAt(0).toUpperCase() + this.fieldTypeName.slice(1)}`
            if (this[methodName] !== undefined) {
                return await this[methodName]()
            }
        } 
        return ''
    }

    async _toInternalValueDate(value) {
        value = moment(value, this.dateFormatType.format).format(config.DEFAULT_DATE_FIELD_FORMAT)
        if (value !== 'Invalid Date') {
            return value
        } else {
            return ''
        }
    }

    async _toInternalValueNumber(value) {
        const precision = this.numberFormatType.precision
        const base = this.numberFormatType.base
        const suffix = this.numberFormatType.suffix
        const prefix = this.numberFormatType.prefix
        const decimalSeparator = this.numberFormatType.decimalSeparator
    
        if (suffix) {
            const regexToSubstitute = new RegExp(`(\\${suffix})$`, 'm')
            value = value.replace(regexToSubstitute, '')
        } 
        if (prefix) {
            const regexToSubstitute = new RegExp(`^(\\${prefix})$`, 'm')
            value = value.replace(regexToSubstitute, '')
        }

        if (decimalSeparator) {
            const precisionAsInteger = precision.toString().length - 1
            let valueAsArrayDividedByDecimalSeparator = value.split(decimalSeparator)
            
            if (valueAsArrayDividedByDecimalSeparator.length >= 2) {
                // clean the value, for some reason we can have more than one decimal separator
                // like 123.2.3.59. This is difficult but can happen so we need to be extra careful.
                let [valueInteger, valueDecimal] = [valueAsArrayDividedByDecimalSeparator[0], valueAsArrayDividedByDecimalSeparator[1]]
                
                const cleanedDecimal = valueDecimal.replace('\D', '')
                // we handle the format of the decimal as it was an integer to format it nicely.
                const decimals = parseInt(cleanedDecimal)/parseInt('1' + '0'.repeat(cleanedDecimal.length))
                // Forces the precision of the value decimal to be exactly as what we want.
                valueDecimal = decimals.toFixed(precisionAsInteger).split('.')[1]

                valueAsArrayDividedByDecimalSeparator = [valueInteger, valueDecimal]
            } else {
                valueAsArrayDividedByDecimalSeparator.push('0'.repeat(precisionAsInteger))
            }

            // We transform everything to a big integer number without decimals.
            value = valueAsArrayDividedByDecimalSeparator.join('')
        }
        
        const isNegative = value.charAt(0) === '-'
        value = (isNegative ? '-' : '') + value.replace('\D', '')
        // if before all that the value is an empty strting then it's 0
        value = value === '' ? '0' : value
        return (parseInt(value) * parseInt(config.DEFAULT_BASE_NUMBER_FIELD_FORMAT/(precision * base))).toString()
    } 

    async representation(value) {
        if (value !== undefined && value !== null && value !== '') {
            const methodName = `_representation${this.fieldTypeName.charAt(0).toUpperCase() + this.fieldTypeName.slice(1)}`
            if (this[methodName] !== undefined) {
                return this[methodName](value)
            }
        }
        return (value !== undefined && value !== null) ? value : ''
    }

    async _representationDate(value) {
        if (value instanceof Date) {
            value = moment(value).format(pythonFormatToMomentJSFormat(this.dateFormatType.format))
        } else {
            value = moment(value, config.DEFAULT_DATE_FIELD_FORMAT).format(pythonFormatToMomentJSFormat(this.dateFormatType.format))
        }
        if (value !== 'Invalid Date') {
            return value
        } else {
            return ''
        }
    }

    async _representationNumber(value) {
        value = value.toString()
        const isNegative = value.charAt(0) === '-'
        const precision = this.numberFormatType.precision
        const base = this.numberFormatType.base
        const suffix = (this.numberFormatType.suffix !== null) ? this.numberFormatType.suffix : ''
        const prefix = (this.numberFormatType.prefix !== null) ? this.numberFormatType.prefix : ''
        const thousandSeparator = (this.numberFormatType.thousandSeparator !== null) ? this.numberFormatType.thousandSeparator : ''
        const decimalSeparator = this.numberFormatType.decimalSeparator
        const hasToEnforceDecimal = this.numberFormatType.hasToEnforceDecimal

        value = ((parseInt(value) * parseInt(base))/parseInt(config.DEFAULT_BASE_NUMBER_FIELD_FORMAT)).toString()
        // remove any suffixes and prefixes of the number.
        if (suffix !== '') {
            const regexSufix = new RegExp(`(\\${this.numberFormatType.suffix})$`,'m');
            value = value.replace(regexSufix,'')
        } 

        if (prefix !== ''){
            const regexPrefix = new RegExp(`(^\\${this.numberFormatType.prefix})`,'m');
            value = value.replace(regexPrefix,'')
        }

        let valueAsArrayDividedByDecimalSeparator = []
        if (decimalSeparator) {
            valueAsArrayDividedByDecimalSeparator = value.split('.')
            valueAsArrayDividedByDecimalSeparator = valueAsArrayDividedByDecimalSeparator.slice(0,2).map(value => value.replace(/\D/g,''))
        } else {
            valueAsArrayDividedByDecimalSeparator = [value.replace(/\D/g,'')]
        }

        let [integerPartOfNumber, decimalPartOfNumber] = valueAsArrayDividedByDecimalSeparator
        if (decimalPartOfNumber === undefined) decimalPartOfNumber = ''
        // Add thousand separator
        if (thousandSeparator !== null && thousandSeparator !== '') {
            integerPartOfNumber = integerPartOfNumber.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, thousandSeparator)
        }
        if (decimalPartOfNumber !== undefined) {
            decimalPartOfNumber = decimalPartOfNumber.slice(0, precision.toString().length - 1)
            if (hasToEnforceDecimal === true) {
                value = ['0', decimalPartOfNumber].join('.')
                decimalPartOfNumber = parseFloat(value).toFixed(precision.toString().length - 1).split('.')[1]
                if (!['', undefined].includes(decimalPartOfNumber)) {
                    value = [integerPartOfNumber, decimalPartOfNumber].join(decimalSeparator)
                } else {
                    value = integerPartOfNumber
                }
            } else {
                if (![undefined, null, ''].includes(decimalPartOfNumber)) {
                    value = [integerPartOfNumber, decimalPartOfNumber].join(decimalSeparator)
                } else {
                    value = integerPartOfNumber
                }
            }
        } else {
            value = integerPartOfNumber
        }
       
        return prefix + ((isNegative) ? '-' : '') + value + suffix
    }
}

export default RepresentationService