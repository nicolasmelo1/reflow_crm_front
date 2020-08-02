/**
 * Masks a number, differently from formatNumber, this is used to format the numbers to
 * a specified length. So it is used for phones, zip_codes, and other documents that the user might
 * need.
 * @param {String} number - The actual number as string.
 * @param {String} format - This is the formating, use the number as '0', so for example for phone numbers,
 * the formating would be something like: (00) 00000-0000, for cpf the formatting would be something like:
 * 000.000.000-00 and so on, notice that every 0 is where we will insert the numbers
 */
const numberMasker = (number, format) => {
    number = (number) ? number : ''
    const numberOfDigits = (format.match(/0/g) || []).length
    const formatedNumber = number.replace(/\D/g,'').substring(0, numberOfDigits)
    let formatedNumberIndex = 0
    let result = ''

    for(let formatIndex = 0; formatIndex<format.length; formatIndex++) {
        if (formatedNumber.charAt(formatedNumberIndex) !== '') {
            if (format.charAt(formatIndex) === '0') {
                result = result + formatedNumber.charAt(formatedNumberIndex)
                formatedNumberIndex++
            } else {
                result = result + format.charAt(formatIndex)
            }
        } else {
            break
        }
    }    
    return result
}

const numberUnmasker = (number, format) => number.replace(/\D/g,'').substring(0, (format.match(/0/g) || []).length)

export { numberUnmasker }
export { numberMasker }