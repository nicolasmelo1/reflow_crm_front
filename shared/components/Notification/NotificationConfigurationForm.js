import React, { useEffect, useState } from 'react'
import { View, Switch, Text, Picker } from 'react-native'
import Select from '../Utils/Select'
import Styled from './styles'
import { errors, strings } from '../../utils/constants'
import isAdmin from '../../utils/isAdmin'

/**
 * This might be one of the biggest components of this project, yet.
 * It is just a simple formulary basically, there is a lot of code being duplicated, specially in the Render part. So you might find ways
 * to split it in smaller components.
 * 
 * Different from most formularies, this component is SO long because we display each field while the user fills each information.
 * So if he doesn't set a name to the notification, he can't select the formulary to use, if he doesn't select the formulary, he can't fill
 * the notification text, and so on. This way we minimize errors when submitting.
 * 
 * Most of the logic here resides on the variables. On our platform the user can write his own notification texts, he doesn't need to rely on our provided texts.
 * But for this to work simply for our user there are lots of works on our side. 
 * 
 * For example, a simple notification text: 
 * '{{username}}, you must call {{contact}} today. Use the following number: {{contactphonenumber}}'
 * 
 * On this example {{username}}, {{contact}} and {{contactphonenumber}} are variables inside of the text. Every notification is bound to a specific formulary, so
 * as you might already been thinking these variables are fields inside of this formulary. The names inside of the `{{}}` are the field_names, that works like id for us, programmers.
 * and are more readable than ids. So when the user types {{}} on the text field, we need to create a select field IN THE EXACT ORDER it was inserted for the user to select the variables.
 * The same works when the user deletes the {{}} or just remove the option. 
 * 
 * For this we use basically regex.
 * 
 * On the Error part, the backend is kinda dumb on error handling, so must of the work is done on our side. We create a state with a object, with the field as keys and the message as the value.
 * We display the error for each user on each field directly. But we leave the validation most for the backend.
 * 
 * @param {Array<Object>} formularies - These are the formularies loaded from the sidebar, if the sidebar hasn't been loaded, we load when we open the notification configuration component
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before the data be retrieved
 * @param {Boolean} setFormIsOpen - The configuration is loaded right below the card, this is a state function that can be true or false, defining if this component is opened or not
 * @param {Function} updateNotification - Function to update the notification configuration state
 * @param {Function} createOrUpdateNotification - action for redux, used for saving the notification configuration data.
 * @param {Function} onGetNotificationConfigurationFields - action from redux used for retrieving the fields the user can select as variables and the `date` field_type fields of the form
 * @param {BigInteger} notificationConfigurationIndex - Index of this notification configuration, we use this to update the state at a specific index.
 * @param {Object} notificationConfiguration - The notification configuration data
 */
const NotificationConfigurationForm = (props) => {
    const sourceRef = React.useRef()
    const [notificationFieldOptions, setNotificationFieldOptions]= useState([])
    const [formErrors, setFormErrors] = useState({})
    const [fieldOptions, setFieldOptions] = useState([])
    const formulariesOptions = [].concat(...props.formularies.map(group=> group.form_group.map(form=> ({ value: form.id, label: form.label_name }))))
    const initialFormularyOptions = formulariesOptions.filter(formularyOption=> formularyOption.value === props.notificationConfiguration.form)
    const initialNotificationFieldOptions = notificationFieldOptions.filter(notificationFieldOption => notificationFieldOption.value === props.notificationConfiguration.field)
    const occurrences = props.notificationConfiguration.text.match(/{{(\w+)?}}/g) || []
    const notificationConfigurationData = JSON.parse(JSON.stringify(props.notificationConfiguration))
    const notificationDays = Array.apply(null, Array(121)).map((_, i) => i-60)
    
    /**
     * This is a handy function to get the date label. The user usually can select to be notified as much as
     * 60 before or 60 days after the duedate. So let's explain:
     * 
     * If we have a field of `date` type called `closing forecast`, and use this field for reminders, the user can set if he
     * wants to be reminded N days after or before the date set on the formulary.
     * 
     * @param {BigInteger} day - Just a number, must represent a number of days. So 2 days, 10 Days, 15 days and so on.
     */
    const getDatesSelectLabel = (day) => {
        let text = strings['pt-br']['notificationConfigurationFormDaysDiffSameDaySelectOptionLabel']
        if (day < 0) {
            text = [-1].includes(day) ? strings['pt-br']['notificationConfigurationFormDaysDiffBeforeDaySelectOptionLabel'].replace('{}', day*(-1)) : 
                                        strings['pt-br']['notificationConfigurationFormDaysDiffBeforeDaysSelectOptionLabel'].replace('{}',day*(-1))
        } else if (day > 0) {
            text = [1].includes(day) ? strings['pt-br']['notificationConfigurationFormDaysDiffAfterDaySelectOptionLabel'].replace('{}',day) :
                                       strings['pt-br']['notificationConfigurationFormDaysDiffAfterDaysSelectOptionLabel'].replace('{}',day) 
        }
        return text
    }

    /**
     * Only a handy function to be used when you want to create a new variable. You just need to 
     * send the fieldId and the fieldName
     * 
     * @param {BigInteger} fieldId - The id of the field to be used as variable
     * @param {String} fieldName - The name of the field (remember that names works like ids), we need this so we can display the name and not
     * the id to the user on the text.
     */
    const addNewVariable = (fieldId, fieldName) => {
        return {
            field_id: fieldId,
            field_name: fieldName
        }
    }

    /**
     * Changes the notification `for_company` attribute. This attribute defines if all of the users of this company must recieve this notification
     * or if it is just for you.
     * 
     * @param {Boolean} data - True or false wheather if the notification is for the hole company or not
     */
    const onChangeForCompany = (data) => {
        notificationConfigurationData.for_company = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * Changes the name of the notification. it is the `name` attribute. We set a name to this notification so a user can have a quick
     * understanding on what this notification means. But we leave this open for the user to set.
     * 
     * @param {String} data - The name of the notification. 
     */
    const onChangeNotificationName = (data) => {
        notificationConfigurationData.name = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * This might not be really straight forward. Like everything inside of our software, notifications are always bound to a specific
     * formulary. When the user changes the formulary_id we set the formulary id to bound this notification to. But also, we delete all 
     * variables and the field options. 
     * 
     * Don't remove the text, we just remove THE VARIABLES of the text.
     * 
     * @param {Array<BigInteger>} data - An array containing integers, these integers are the id of the formulary. Usually it's just
     * an array with one value that is recieved from the `Select` component
     */
    const onChangeFormulary = (data) => {
        notificationConfigurationData.form = data.length > 0 ? data[0] : null
        notificationConfigurationData.field = null
        // when the user changes the formulary we reset all the variables.
        notificationConfigurationData.text = notificationConfigurationData.text.replace(/{{(\w+)?}}/g, '{{}}')
        notificationConfigurationData.notification_configuration_variables.forEach((_, i) => {
            notificationConfigurationData.notification_configuration_variables[i] = addNewVariable(null, null)
        })
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * Notifications are bound to a specific formulary, as always. But they are also bound to a specific field of this formulary.
     * That's what we define here. 
     * 
     * If we have a field of `date` type called `closing forecast`, and use this field for reminders
     * 
     * @param {Array<BigInteger>} data - An array containing integers, these integers are ids of fields. Usually it's just
     * an array with one value that is recieved from the `Select` component
     */
    const onChangeField = (data) => {
        notificationConfigurationData.field = data.length > 0 ? data[0] : null
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * Just changes the text of a notification, but the variables is where comes the hard part. If the user types a '{{}}' this means
     * he wants to add a new variable. So we need to count these occurrences. After we have occurrence we substitute each {{}} with the
     * `field_name` of the `notification_configuration_variables` that's why it's really important for both of them be orderded exacly.
     * So '{{}}' will become {{field_name_of_this_variable}}. 
     * 
     * For newly created '{{}}' we just bound an empty new variable (with both the fieldId and fieldName as null).
     *
     * It's really important that you keep both in sync and ordered. 
     * If we have a text like `Remember that {{}}, is about to close on {{duedate}}` the `notification_configuration_variables` must be like the following:
     * [{ field_id: null, field_name: null }, {field_id: 1234, field_name: 'duedate' }]
     * 
     * @param {String} data - The text of the notification.
     */
    const onChangeText = (data) => {
        notificationConfigurationData.text = data
        const occurrences = (data.match(/{{(\w+)?}}/g) || []).map(occurrence => occurrence.replace('{{','').replace('}}',''))
        notificationConfigurationData.notification_configuration_variables = notificationConfigurationData.notification_configuration_variables.filter(variable => [...occurrences].includes(variable.field_name))
        // we removed every occurrence that doesn't exist in the text also nulls and emptys, 
        // then we add them again as null preserving the order of each occurrence
        occurrences.forEach((occurrence, i) => {
            if (notificationConfigurationData.notification_configuration_variables[i] && notificationConfigurationData.notification_configuration_variables[i].field_name !== occurrence) {
                notificationConfigurationData.notification_configuration_variables.splice(i, 0, addNewVariable(null, null))
            }
        })
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * Probably the most difficult function of this hole component. This function is responsible to set variables only.
     * I will go by an example that it is easier to explain so let's use the following notification text: `Remember that {{}}, is about to close on {{duedate}}`
     * 
     * 1 - We get all of the variable occurrences as an array, in this case we will get [`{{}}`, `{{duedate}}`]
     * 2 - We replace everything between '{{' and  '}}' from the text to an empty '{{}}'. So `{{duedate}}` will become `{{}}` in the text.
     * 3 - Then we split everything from just the inner '{}', so we end up with an array like: [ "Remember that ", "{}", ", is about to close on ", "{}", "" ]
     * 4 - Then, if we data.length > 0  or, if we are setting a new variable for this notification we filter it from the fieldOptions array and append a new
     * variable on `notification_configuration_variables` in the specific index.
     * 5 - If data is null we are actually removing a variable, so we need to remove from the text. On this example, on this specific index
     * we add a variable with null values.
     * 6 - Last but not least, we loop through the splitted text in number 3, if you see clearly you will see that everytime we have '{}' we need
     * to insert a new variable. If the index of this variable selector is 1 this means that we are updating `{{duedate}}` on the array [`{{}}`, `{{duedate}}`]
     * defined in the task 1. So the first `{{}}` needs to remain unchanged.
     *  
     * Then we define the text and that's it. Seems crazy enough but it is actually kinda easy once you get it, it's just a tricky algorithm to master and learn.
     * 
     * @param {BigInteger} index - The index of the variable you are trying to change. See item 6 on the explanation. We recieve this from the render function.
     * @param {Array<BigInteger>} data -  An array containing integers, these integers are ids of fields. Usually it's just
     * an array with one value that is recieved from the `Select` component. Could also be Null if the user is removing it from the selector.
     */
    const onChangeVariable = (index, data) => {
        const occurrences = props.notificationConfiguration.text.match(/{{(\w+)?}}/g) || []
        const formattedText = props.notificationConfiguration.text.replace(/{{(\w+)?}}/g, '{{}}')
        let splittedText = formattedText.split(/{(.*?)}(?!})/g)
        let counter = 0
        let field = []

        if (data.length > 0) {
            field = fieldOptions.filter(fieldOption => fieldOption.value === data[0])
            if (field.length > 0) {
                notificationConfigurationData.notification_configuration_variables[index] = addNewVariable(field[0].value, field[0].field_name)
            }
        } else {
            // is removing a variable just assigning it to null
            notificationConfigurationData.notification_configuration_variables[index] = addNewVariable(null, null)
        }

        const newSplittedText = splittedText.map(textSentence => {
            if (textSentence === '{}') {
                counter ++
                if (counter-1 === index) {
                    return field.length > 0 && field[0].field_name ? `{{${field[0].field_name}}}` : '{{}}'
                } else {
                    return `{{${occurrences[counter-1].replace('{{','').replace('}}','')}}}`
                }
            } else {
                return textSentence
            }
        })
        notificationConfigurationData.text = newSplittedText.join('')

        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * See `getDatesSelectLabel` function for further details. This is responsible to set the days after or before the date.
     * Can be 60 days after the date set on the formulary or 60 days before the date on the formulary.
     * 
     * @param {BigInteger} data - The day from the select component actually. Since we recive this date as an integer we convert
     * it to a string.
     */
    const onChangeDaysDiff = (data) => {
        notificationConfigurationData.days_diff = data.toString()
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    /**
     * Submits the formulary and sets errors if there are any. The errors on the backend are really dumb actually, so we need to always
     * treat it here on the front end.
     */
    const onSubmit = () => {
        props.createOrUpdateNotification(props.notificationConfiguration).then(response=> {
            if (response && response.status === 400) {
                if (response.data.error.non_field_errors && response.data.error.non_field_errors.includes('invalid_variable')) {
                    setFormErrors({variable: errors('pt-br', 'invalid_variable')})
                } else if (Object.keys(response.data.error).every(error=> Object.keys(props.notificationConfiguration).includes(error))) {
                    // its a error with one of the fields
                    const error = JSON.parse(JSON.stringify(response.data.error))
                    Object.keys(response.data.error).forEach(errorKey => {
                        // might need to add new cases in the future, this only chacks blank fields
                        error[errorKey] = (error[errorKey][0] === 'blank') ? errors('pt-br', 'blank_field') : errors('pt-br', 'unknown_field')
                    })
                    setFormErrors(error)
                }
            } else {
                setFormErrors({})
                props.setFormIsOpen(false)
            }
        })
        
    }

    useEffect(() => {
        // You will see this everywhere on our front end code.
        sourceRef.current = props.cancelToken.source()
        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        // when the user changes a formulary_id to be bound to this notification we need to get the fields that we can use as variables
        // and that we can bound the notification to. That's what we are doing here. Retriving the field options from the backend.
        if (props.notificationConfiguration.form) {
            props.onGetNotificationConfigurationFields(sourceRef.current, props.notificationConfiguration.form).then(response=> {
                if (response && response.status === 200) {
                    setFieldOptions(response.data.data.variable_fields.map(field=> ({ value: field.id, label: field.label_name, field_name: field.name })))
                    setNotificationFieldOptions(response.data.data.notification_fields.map(field=> ({ value: field.id, label: field.label_name })))
                }
            })
        } else {
            setNotificationFieldOptions([])
            setFieldOptions([])
        }
    }, [props.notificationConfiguration.form])

    useEffect(() => {
        // sometimes the text can come unformatted with empty tags {{}}, so the first time we render we fix this issue with 
        // this hook
        const formattedText = props.notificationConfiguration.text.replace(/{{(\w+)?}}/g, '{{}}')
        let splittedText = formattedText.split(/{(.*?)}(?!})/g)
        let counter = 0
        const newSplittedText = splittedText.map(textSentence => {
            if (textSentence === '{}') {
                counter ++
                return `{{${props.notificationConfiguration.notification_configuration_variables[counter-1] && !['', null].includes(props.notificationConfiguration.notification_configuration_variables[counter-1].field_name) ? 
                            props.notificationConfiguration.notification_configuration_variables[counter-1].field_name : ''}}}`
            } else {
                return textSentence
            }
        })
        notificationConfigurationData.text = newSplittedText.join('')
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }, [])

    const renderMobile = () => {
        return (
            <Styled.NotificationConfigurationFormContainer>
                {isAdmin(props.types.defaults?.profile_type, props.user) ? (
                    <Styled.NotificationConfigurationFormFieldContainer>
                        <Styled.NotificationConfigurationFormCheckboxesContainer>
                            <Switch value={props.notificationConfiguration.for_company} onValueChange={value => {onChangeForCompany(value)}}/>
                            <Styled.NotificationConfigurationFormCheckboxText> 
                                {` ${strings['pt-br']['notificationConfigurationFormForCompanyLabel']}`}
                            </Styled.NotificationConfigurationFormCheckboxText>
                            <Styled.NotificationConfigurationFormForCompanyExplanation>
                                {strings['pt-br']['notificationConfigurationFormForCompanyExplanation']}
                            </Styled.NotificationConfigurationFormForCompanyExplanation>
                        </Styled.NotificationConfigurationFormCheckboxesContainer>
                    </Styled.NotificationConfigurationFormFieldContainer>
                ) : null}
                <Styled.NotificationConfigurationFormFieldContainer>
                    <Styled.NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormNotificationNameLabel']}
                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                    </Styled.NotificationConfigurationFormFieldLabel>
                    <Styled.NotificationConfigurationFormFieldInput 
                    errors={formErrors.name}
                    type="text" 
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.nativeEvent.text)}}
                    />
                    {formErrors.name ? (
                        <Styled.NotificationConfigurationFormErrors>
                            {formErrors.name}
                        </Styled.NotificationConfigurationFormErrors>
                    ) : null}
                </Styled.NotificationConfigurationFormFieldContainer>
                {![null, ''].includes(props.notificationConfiguration.name) ? (
                    <View>
                        <Styled.NotificationConfigurationFormFieldContainer>
                            <Styled.NotificationConfigurationFormFieldLabel>
                                {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                                <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                            </Styled.NotificationConfigurationFormFieldLabel>
                            <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.form}>
                                <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                            </Styled.NotificationConfigurationFormSelectContainer>
                            {formErrors.form ? (
                                <Styled.NotificationConfigurationFormErrors>
                                    {formErrors.form}
                                </Styled.NotificationConfigurationFormErrors>
                            ) : null}
                        </Styled.NotificationConfigurationFormFieldContainer>
                        {![null, ''].includes(props.notificationConfiguration.form) ? (
                            <View>
                                <Styled.NotificationConfigurationFormFieldContainer>
                                    <Styled.NotificationConfigurationFormFieldLabel>
                                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                    </Styled.NotificationConfigurationFormFieldLabel>
                                    <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.field}>
                                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                                    </Styled.NotificationConfigurationFormSelectContainer>
                                    {formErrors.field ? (
                                        <Styled.NotificationConfigurationFormErrors>
                                            {formErrors.field}
                                        </Styled.NotificationConfigurationFormErrors>
                                    ) : null}
                                </Styled.NotificationConfigurationFormFieldContainer>
                                {![null, ''].includes(props.notificationConfiguration.field) ? (
                                    <View>
                                        <Styled.NotificationConfigurationFormFieldContainer>
                                            <Styled.NotificationConfigurationFormFieldLabel>
                                                {strings['pt-br']['notificationConfigurationFormTextLabel']}
                                                <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                            </Styled.NotificationConfigurationFormFieldLabel>
                                            <Styled.NotificationConfigurationFormFieldInput 
                                            errors={formErrors.text}
                                            multiline={true}
                                            placeholder={strings['pt-br']['notificationConfigurationFormTextPlaceholder']}
                                            value={notificationConfigurationData.text}
                                            onChange={e=> {onChangeText(e.nativeEvent.text)}}
                                            />
                                        </Styled.NotificationConfigurationFormFieldContainer>
                                        <Styled.NotificationConfigurationFormFieldContainer isVariable={true}>
                                            {occurrences.map((_, occurrenceIndex) => {
                                                const initialValues = fieldOptions.filter(fieldOption => props.notificationConfiguration.notification_configuration_variables[occurrenceIndex] && fieldOption.value === props.notificationConfiguration.notification_configuration_variables[occurrenceIndex].field_id)
                                                return (
                                                    <Styled.NotificationConfigurationFormVariableContainer key={occurrenceIndex}>
                                                        <Styled.NotificationConfigurationFormFieldLabel isVariable={true}>
                                                            {strings['pt-br']['notificationConfigurationFormVariableSelectorLabel']}
                                                            <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                                        </Styled.NotificationConfigurationFormFieldLabel>
                                                        <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.variable && initialValues.length === 0}>
                                                            <Select 
                                                            key={occurrenceIndex}
                                                            options={fieldOptions}
                                                            initialValues={initialValues} 
                                                            onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                                            />
                                                        </Styled.NotificationConfigurationFormSelectContainer>
                                                        {formErrors.variable && initialValues.length === 0 ? (
                                                            <Styled.NotificationConfigurationFormErrors>
                                                                {formErrors.variable}
                                                            </Styled.NotificationConfigurationFormErrors>
                                                        ) : null}
                                                    </Styled.NotificationConfigurationFormVariableContainer>
                                                )
                                            })}
                                        </Styled.NotificationConfigurationFormFieldContainer>
                                        {![null, ''].includes(props.notificationConfiguration.text) ? (
                                            <View>
                                                <Styled.NotificationConfigurationFormFieldContainer>
                                                    <Styled.NotificationConfigurationFormFieldLabel>
                                                        {strings['pt-br']['notificationConfigurationFormDaysDiffLabel']}
                                                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                                    </Styled.NotificationConfigurationFormFieldLabel>
                                                    <Styled.NotificationConfigurationFormDaysDiffSelect selectedValue={parseInt(props.notificationConfiguration.days_diff)} onValueChange={value => {onChangeDaysDiff(value)}}>
                                                        {notificationDays.map(notificationDay => (
                                                            <Picker.Item key={notificationDay} label={getDatesSelectLabel(notificationDay)} value={notificationDay}/>
                                                        ))}
                                                    </Styled.NotificationConfigurationFormDaysDiffSelect>
                                                            
                                                </Styled.NotificationConfigurationFormFieldContainer>
                                                <Styled.NotificationConfigurationFormFieldContainer>
                                                    <Styled.NotificationConfigurationFormSaveButton onPress={e=> {onSubmit()}}>
                                                        <Text style={{ color: '#f2f2f2'}}>
                                                            {strings['pt-br']['Styled.NotificationConfigurationFormSaveButtonLabel']}
                                                        </Text>
                                                    </Styled.NotificationConfigurationFormSaveButton>
                                                </Styled.NotificationConfigurationFormFieldContainer>
                                            </View>
                                        ) : null}
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                ) : null}
            </Styled.NotificationConfigurationFormContainer>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.NotificationConfigurationFormContainer>
                {isAdmin(props.types.defaults?.profile_type, props.user) ? (
                    <Styled.NotificationConfigurationFormFieldContainer>
                        <Styled.NotificationConfigurationFormCheckboxesContainer>
                            <input type="checkbox" checked={props.notificationConfiguration.for_company} onChange={e => {onChangeForCompany(e.target.checked)}}/>
                            <Styled.NotificationConfigurationFormCheckboxText> {strings['pt-br']['notificationConfigurationFormForCompanyLabel']}</Styled.NotificationConfigurationFormCheckboxText>
                            <Styled.NotificationConfigurationFormForCompanyExplanation>
                                {strings['pt-br']['notificationConfigurationFormForCompanyExplanation']}
                            </Styled.NotificationConfigurationFormForCompanyExplanation>
                        </Styled.NotificationConfigurationFormCheckboxesContainer>
                    </Styled.NotificationConfigurationFormFieldContainer>
                ) : null}
                <Styled.NotificationConfigurationFormFieldContainer>
                    <Styled.NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormNotificationNameLabel']}
                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                    </Styled.NotificationConfigurationFormFieldLabel>
                    <Styled.NotificationConfigurationFormFieldInput 
                    errors={formErrors.name}
                    type="text" 
                    autoComplete={'whathever'}
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.target.value)}}
                    />
                    {formErrors.name ? (
                        <Styled.NotificationConfigurationFormErrors>
                            {formErrors.name}
                        </Styled.NotificationConfigurationFormErrors>
                    ) : ''}
                </Styled.NotificationConfigurationFormFieldContainer>
                {![null, ''].includes(props.notificationConfiguration.name) ? (
                    <div>
                        <Styled.NotificationConfigurationFormFieldContainer>
                            <Styled.NotificationConfigurationFormFieldLabel>
                                {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                                <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                            </Styled.NotificationConfigurationFormFieldLabel>
                            <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.form}>
                                <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                            </Styled.NotificationConfigurationFormSelectContainer>
                            {formErrors.form ? (
                                <Styled.NotificationConfigurationFormErrors>
                                    {formErrors.form}
                                </Styled.NotificationConfigurationFormErrors>
                            ) : ''}
                        </Styled.NotificationConfigurationFormFieldContainer>
                        {![null, ''].includes(props.notificationConfiguration.form) ? (
                            <div>
                                <Styled.NotificationConfigurationFormFieldContainer>
                                    <Styled.NotificationConfigurationFormFieldLabel>
                                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                    </Styled.NotificationConfigurationFormFieldLabel>
                                    <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.field}>
                                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                                    </Styled.NotificationConfigurationFormSelectContainer>
                                    {formErrors.field ? (
                                        <Styled.NotificationConfigurationFormErrors>
                                            {formErrors.field}
                                        </Styled.NotificationConfigurationFormErrors>
                                    ) : ''}
                                </Styled.NotificationConfigurationFormFieldContainer>
                                {![null, ''].includes(props.notificationConfiguration.field) ? (
                                    <div>
                                        <Styled.NotificationConfigurationFormFieldContainer>
                                            <Styled.NotificationConfigurationFormFieldLabel>
                                                {strings['pt-br']['notificationConfigurationFormTextLabel']}
                                                <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                            </Styled.NotificationConfigurationFormFieldLabel>
                                            <Styled.NotificationConfigurationFormFieldInput 
                                            errors={formErrors.text}
                                            type='text'
                                            autoComplete={'whathever'}
                                            placeholder={strings['pt-br']['notificationConfigurationFormTextPlaceholder']}
                                            value={props.notificationConfiguration.text}
                                            onChange={e=> {onChangeText(e.target.value)}}
                                            />
                                            {formErrors.text ? (
                                                <Styled.NotificationConfigurationFormErrors>
                                                    {formErrors.text}
                                                </Styled.NotificationConfigurationFormErrors>
                                            ) : ''}
                                        </Styled.NotificationConfigurationFormFieldContainer>
                                        <Styled.NotificationConfigurationFormFieldContainer isVariable={true}>
                                            {occurrences.map((_, occurrenceIndex) => {
                                                const initialValues = fieldOptions.filter(fieldOption => props.notificationConfiguration.notification_configuration_variables[occurrenceIndex] && fieldOption.value === props.notificationConfiguration.notification_configuration_variables[occurrenceIndex].field_id)
                                                return (
                                                    <Styled.NotificationConfigurationFormVariableContainer key={occurrenceIndex}>
                                                        <Styled.NotificationConfigurationFormFieldLabel isVariable={true}>
                                                            {strings['pt-br']['notificationConfigurationFormVariableSelectorLabel']}
                                                            <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                                        </Styled.NotificationConfigurationFormFieldLabel>
                                                        <Styled.NotificationConfigurationFormSelectContainer errors={formErrors.variable && initialValues.length === 0}>
                                                            <Select 
                                                            key={occurrenceIndex}
                                                            options={fieldOptions}
                                                            initialValues={initialValues} 
                                                            onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                                            />
                                                        </Styled.NotificationConfigurationFormSelectContainer>
                                                        {formErrors.variable && initialValues.length === 0 ? (
                                                            <Styled.NotificationConfigurationFormErrors>
                                                                {formErrors.variable}
                                                            </Styled.NotificationConfigurationFormErrors>
                                                        ) : ''}
                                                    </Styled.NotificationConfigurationFormVariableContainer>
                                                )
                                            })}
                                        </Styled.NotificationConfigurationFormFieldContainer>
                                        {![null, ''].includes(props.notificationConfiguration.text) ? (
                                            <div>
                                                <Styled.NotificationConfigurationFormFieldContainer>
                                                    <Styled.NotificationConfigurationFormFieldLabel>
                                                        {strings['pt-br']['notificationConfigurationFormDaysDiffLabel']}
                                                        <Styled.NotificationConfigurationFormFieldLabelRequired>*</Styled.NotificationConfigurationFormFieldLabelRequired>
                                                    </Styled.NotificationConfigurationFormFieldLabel>
                                                    <Styled.NotificationConfigurationFormFieldInput value={props.notificationConfiguration.days_diff} as="select" onChange={e=> {onChangeDaysDiff(e.target.value)}}>
                                                        {notificationDays.map(notificationDay => (
                                                            <option key={notificationDay} value={notificationDay}>{getDatesSelectLabel(notificationDay)}</option>
                                                        ))}
                                                    </Styled.NotificationConfigurationFormFieldInput>
                                                </Styled.NotificationConfigurationFormFieldContainer>
                                                <Styled.NotificationConfigurationFormFieldContainer>
                                                    <Styled.NotificationConfigurationFormSaveButton onClick={e=> {onSubmit()}}>
                                                        {strings['pt-br']['Styled.NotificationConfigurationFormSaveButtonLabel']}
                                                    </Styled.NotificationConfigurationFormSaveButton>
                                                </Styled.NotificationConfigurationFormFieldContainer>
                                            </div>
                                        ) : ''}
                                    </div>
                                ) : ''}
                            </div>
                        ) : ''}
                    </div>
                ) : ''}
            </Styled.NotificationConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfigurationForm