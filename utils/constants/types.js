import strings from './strings'

/** 
 * Our system has some types, Types are particular kind of data in our system that is critical to
 * for it to work, since most of them must be displayed for the user to select we need to be able to
 * translate it to a certain language.
 * 
 * @param {String} lang - the language to translate to
 * @param {String} type - must follow the types object from the backend, 
 * you can check all of the types on the response of `/types/` path
 * @param {String} key - the types usually have a slug, or a simple name
 * you can use it to find the translation for it.
 */
const types = (lang, type, key) => {
    return {
        form_type: {
            multi_form: strings[lang]['formTypeMultiple'],
            form: strings[lang]['formTypeSingle'],
        },
        conditional_type: {
            equal: strings[lang]['conditionalTypeEqual']
        },
        field_type: {
            number: strings[lang]['fieldTypeNumber'],
            text: strings[lang]['fieldTypeText'],
            date: strings[lang]['fieldTypeDate'],
            option: strings[lang]['fieldTypeOption'],
            form: strings[lang]['fieldTypeForm'],
            attachment: strings[lang]['fieldTypeAttachment'],
            long_text: strings[lang]['fieldTypeLongText'],
            email: strings[lang]['fieldTypeEmail'],
            multi_option: strings[lang]['fieldTypeMultiOption'],
            id: strings[lang]['fieldTypeId'],
            user: strings[lang]['fieldTypeUser'],
            period: strings[lang]['fieldTypePeriod']
        },
        number_configuration_number_format_type: {
            number: strings[lang]['numberFormatTypeNumber'],
            currency: strings[lang]['numberFormatTypeCurrency'],
            percentage: strings[lang]['numberFormatTypePercentage'],
        }
    }[type][key]
}

export default types