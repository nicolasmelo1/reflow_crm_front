import strings from './strings'

const types = (lang, type, key) => {
    return {
        form_type: {
            multi_form: strings[lang]['formTypeMultiple'],
            form: strings[lang]['formTypeSingle'],
        }
    }[type][key]
}

export default types