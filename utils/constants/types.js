import strings from './strings'

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