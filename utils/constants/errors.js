import { strings } from 'utils/constants'

const errors = (lang, key) => {
    return {
        incorrect_pass_or_user: strings[lang]['incorrectPassOrUserError']
    }[key]
}


export default errors