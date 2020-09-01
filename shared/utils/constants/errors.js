import strings from './strings'

const errors = (lang, key) => {
    return {
        incorrect_pass_or_user: strings[lang]['loginIncorrectPassOrUserError'],
        required_field: strings[lang]['formularyRequiredFieldError'],
        could_not_upload: strings[lang]['formularyCouldNotUploadFieldError'],
        invalid_file: strings[lang]['formularyInvalidFileError'],
        already_exists: strings[lang]['formularyUniqueFieldError'],
        invalid_variable: strings[lang]['notificationConfigurationFormInvalidVariableError'],
        blank_field: strings[lang]['notificationConfigurationFormFieldBlankError'],
        unknown_field: strings[lang]['notificationConfigurationFormFieldUnknownError'],
        existing_user: strings[lang]['onboardingExistingUserError'],
        invalid_data: strings[lang]['onboardingUnknownError'],
        free_trial_ended: strings[lang]['permissionFreeTrialEndedError'],
        invalid_billing: strings[lang]['permissionInvalidBillingError'],
        not_permitted: strings[lang]['permissionNotPermittedError']
    }[key]
}


export default errors