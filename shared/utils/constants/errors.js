import strings from './strings'

const errors = (lang, key) => {
    return {
        incorrect_pass_or_user: strings[lang]['incorrectPassOrUserError'],
        required_field: strings[lang]['formularyRequiredFieldError'],
        invalid_file: strings[lang]['formularyInvalidFileError'],
        already_exists: strings[lang]['formularyUniqueFieldError'],
        invalid_variable: strings[lang]['notificationConfigurationFormInvalidVariableError'],
        blank_field: strings[lang]['notificationConfigurationFormFieldBlankError'],
        unknown_field: strings[lang]['notificationConfigurationFormFieldUnknownError'],
        existing_user: strings[lang]['onboardingExistingUserError'],
        invalid_data: strings[lang]['onboardingUnknownError']
    }[key]
}


export default errors