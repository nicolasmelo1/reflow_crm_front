import React, { useEffect, useState } from 'react'
import { View, Switch, Text, Picker } from 'react-native'
import Select from '../Utils/Select'
import { 
    NotificationConfigurationFormContainer, 
    NotificationConfigurationFormCheckboxesContainer, 
    NotificationConfigurationFormCheckboxText,
    NotificationConfigurationFormDaysDiffSelect,
    NotificationConfigurationFormErrors,
    NotificationConfigurationFormFieldLabel,
    NotificationConfigurationFormFieldLabelRequired,
    NotificationConfigurationFormFieldInput,
    NotificationConfigurationFormFieldContainer,
    NotificationConfigurationFormSelectContainer,
    NotificationConfigurationFormVariableContainer,
    NotificationConfigurationFormSaveButton
} from '../../styles/Notification'
import { errors, strings } from '../../utils/constants'

/**
 * This might be one of the biggest components of this project, yet.
 * It is just a simple formulary basically, there is a lot of code being duplicated, specially in the Render part, it can work well on a smaller component
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
 * For this we use basically regex.breadcrumb
 * 
 * On the Error part, the backend is kinda dumb on error handling, so must of the work is done on our side. We create a state with a object, with the field as keys and the message as the value.
 * We display the error for each user on each field directly. But we leave the validation most for the backend.
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
    const notificationDays =  Array.apply(null, Array(121)).map((_, i) => i-60)
    
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

    const addNewVariable = (fieldId, fieldName) => {
        return {
            field_id: fieldId,
            field_name: fieldName
        }
    }

    const onChangeForCompany = (data) => {
        notificationConfigurationData.for_company = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeNotificationName = (data) => {
        notificationConfigurationData.name = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeFormulary = (data) => {
        notificationConfigurationData.form = data.length > 0 ? data[0] : null
        notificationConfigurationData.field = null
        notificationConfigurationData.text = notificationConfigurationData.text.replace(/{{(\w+)?}}/g, '{{}}')
        notificationConfigurationData.notification_configuration_variables.forEach((_, i) => {
            notificationConfigurationData.notification_configuration_variables[i] = addNewVariable(null, null)
        })
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeField = (data) => {
        notificationConfigurationData.field = data.length > 0 ? data[0] : null
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

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

    const onChangeDaysDiff = (data) => {
        notificationConfigurationData.days_diff = data.toString()
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

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
        sourceRef.current = props.cancelToken.source()
        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
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
            <NotificationConfigurationFormContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormCheckboxesContainer>
                        <Switch value={props.notificationConfiguration.for_company} onValueChange={value => {onChangeForCompany(value)}}/>
                        <NotificationConfigurationFormCheckboxText> {strings['pt-br']['notificationConfigurationFormForCompanyLabel']}</NotificationConfigurationFormCheckboxText>
                    </NotificationConfigurationFormCheckboxesContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormNotificationNameLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    errors={formErrors.name}
                    type="text" 
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.nativeEvent.text)}}
                    />
                    {formErrors.name ? (
                        <NotificationConfigurationFormErrors>
                            {formErrors.name}
                        </NotificationConfigurationFormErrors>
                    ) : null}
                </NotificationConfigurationFormFieldContainer>
                {![null, ''].includes(props.notificationConfiguration.name) ? (
                    <View>
                        <NotificationConfigurationFormFieldContainer>
                            <NotificationConfigurationFormFieldLabel>
                                {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                                <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                            </NotificationConfigurationFormFieldLabel>
                            <NotificationConfigurationFormSelectContainer errors={formErrors.form}>
                                <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                            </NotificationConfigurationFormSelectContainer>
                            {formErrors.form ? (
                                <NotificationConfigurationFormErrors>
                                    {formErrors.form}
                                </NotificationConfigurationFormErrors>
                            ) : null}
                        </NotificationConfigurationFormFieldContainer>
                        {![null, ''].includes(props.notificationConfiguration.form) ? (
                            <View>
                                <NotificationConfigurationFormFieldContainer>
                                    <NotificationConfigurationFormFieldLabel>
                                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                    </NotificationConfigurationFormFieldLabel>
                                    <NotificationConfigurationFormSelectContainer errors={formErrors.field}>
                                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                                    </NotificationConfigurationFormSelectContainer>
                                    {formErrors.field ? (
                                        <NotificationConfigurationFormErrors>
                                            {formErrors.field}
                                        </NotificationConfigurationFormErrors>
                                    ) : null}
                                </NotificationConfigurationFormFieldContainer>
                                {![null, ''].includes(props.notificationConfiguration.field) ? (
                                    <View>
                                        <NotificationConfigurationFormFieldContainer>
                                            <NotificationConfigurationFormFieldLabel>
                                                {strings['pt-br']['notificationConfigurationFormTextLabel']}
                                                <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                            </NotificationConfigurationFormFieldLabel>
                                            <NotificationConfigurationFormFieldInput 
                                            errors={formErrors.text}
                                            multiline={true}
                                            placeholder={strings['pt-br']['notificationConfigurationFormTextPlaceholder']}
                                            value={notificationConfigurationData.text}
                                            onChange={e=> {onChangeText(e.nativeEvent.text)}}
                                            />
                                        </NotificationConfigurationFormFieldContainer>
                                        <NotificationConfigurationFormFieldContainer isVariable={true}>
                                            {occurrences.map((_, occurrenceIndex) => {
                                                const initialValues = fieldOptions.filter(fieldOption => props.notificationConfiguration.notification_configuration_variables[occurrenceIndex] && fieldOption.value === props.notificationConfiguration.notification_configuration_variables[occurrenceIndex].field_id)
                                                return (
                                                    <NotificationConfigurationFormVariableContainer key={occurrenceIndex}>
                                                        <NotificationConfigurationFormFieldLabel isVariable={true}>
                                                            {strings['pt-br']['notificationConfigurationFormVariableSelectorLabel']}
                                                            <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                                        </NotificationConfigurationFormFieldLabel>
                                                        <NotificationConfigurationFormSelectContainer errors={formErrors.variable && initialValues.length === 0}>
                                                            <Select 
                                                            key={occurrenceIndex}
                                                            options={fieldOptions}
                                                            initialValues={initialValues} 
                                                            onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                                            />
                                                        </NotificationConfigurationFormSelectContainer>
                                                        {formErrors.variable && initialValues.length === 0 ? (
                                                            <NotificationConfigurationFormErrors>
                                                                {formErrors.variable}
                                                            </NotificationConfigurationFormErrors>
                                                        ) : null}
                                                    </NotificationConfigurationFormVariableContainer>
                                                )
                                            })}
                                        </NotificationConfigurationFormFieldContainer>
                                        {![null, ''].includes(props.notificationConfiguration.text) ? (
                                            <View>
                                                <NotificationConfigurationFormFieldContainer>
                                                    <NotificationConfigurationFormFieldLabel>
                                                        {strings['pt-br']['notificationConfigurationFormDaysDiffLabel']}
                                                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                                    </NotificationConfigurationFormFieldLabel>
                                                    <NotificationConfigurationFormDaysDiffSelect selectedValue={parseInt(props.notificationConfiguration.days_diff)} onValueChange={value => {onChangeDaysDiff(value)}}>
                                                        {notificationDays.map(notificationDay => (
                                                            <Picker.Item key={notificationDay} label={getDatesSelectLabel(notificationDay)} value={notificationDay}/>
                                                        ))}
                                                    </NotificationConfigurationFormDaysDiffSelect>
                                                            
                                                </NotificationConfigurationFormFieldContainer>
                                                <NotificationConfigurationFormFieldContainer>
                                                    <NotificationConfigurationFormSaveButton onPress={e=> {onSubmit()}}>
                                                        <Text style={{ color: '#f2f2f2'}}>
                                                            {strings['pt-br']['notificationConfigurationFormSaveButtonLabel']}
                                                        </Text>
                                                    </NotificationConfigurationFormSaveButton>
                                                </NotificationConfigurationFormFieldContainer>
                                            </View>
                                        ) : null}
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                ) : null}
            </NotificationConfigurationFormContainer>
        )
    }

    const renderWeb = () => {
        return (
            <NotificationConfigurationFormContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormCheckboxesContainer>
                        <input type="checkbox" checked={props.notificationConfiguration.for_company} onChange={e => {onChangeForCompany(e.target.checked)}}/>
                        <NotificationConfigurationFormCheckboxText> {strings['pt-br']['notificationConfigurationFormForCompanyLabel']}</NotificationConfigurationFormCheckboxText>
                    </NotificationConfigurationFormCheckboxesContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormNotificationNameLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    errors={formErrors.name}
                    type="text" 
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.target.value)}}
                    />
                    {formErrors.name ? (
                        <NotificationConfigurationFormErrors>
                            {formErrors.name}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                {![null, ''].includes(props.notificationConfiguration.name) ? (
                    <div>
                        <NotificationConfigurationFormFieldContainer>
                            <NotificationConfigurationFormFieldLabel>
                                {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                                <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                            </NotificationConfigurationFormFieldLabel>
                            <NotificationConfigurationFormSelectContainer errors={formErrors.form}>
                                <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                            </NotificationConfigurationFormSelectContainer>
                            {formErrors.form ? (
                                <NotificationConfigurationFormErrors>
                                    {formErrors.form}
                                </NotificationConfigurationFormErrors>
                            ) : ''}
                        </NotificationConfigurationFormFieldContainer>
                        {![null, ''].includes(props.notificationConfiguration.form) ? (
                            <div>
                                <NotificationConfigurationFormFieldContainer>
                                    <NotificationConfigurationFormFieldLabel>
                                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                    </NotificationConfigurationFormFieldLabel>
                                    <NotificationConfigurationFormSelectContainer errors={formErrors.field}>
                                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                                    </NotificationConfigurationFormSelectContainer>
                                    {formErrors.field ? (
                                        <NotificationConfigurationFormErrors>
                                            {formErrors.field}
                                        </NotificationConfigurationFormErrors>
                                    ) : ''}
                                </NotificationConfigurationFormFieldContainer>
                                {![null, ''].includes(props.notificationConfiguration.field) ? (
                                    <div>
                                        <NotificationConfigurationFormFieldContainer>
                                            <NotificationConfigurationFormFieldLabel>
                                                {strings['pt-br']['notificationConfigurationFormTextLabel']}
                                                <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                            </NotificationConfigurationFormFieldLabel>
                                            <NotificationConfigurationFormFieldInput 
                                            errors={formErrors.text}
                                            type='text'
                                            placeholder={strings['pt-br']['notificationConfigurationFormTextPlaceholder']}
                                            value={props.notificationConfiguration.text}
                                            onChange={e=> {onChangeText(e.target.value)}}
                                            />
                                            {formErrors.text ? (
                                                <NotificationConfigurationFormErrors>
                                                    {formErrors.text}
                                                </NotificationConfigurationFormErrors>
                                            ) : ''}
                                        </NotificationConfigurationFormFieldContainer>
                                        <NotificationConfigurationFormFieldContainer isVariable={true}>
                                            {occurrences.map((_, occurrenceIndex) => {
                                                const initialValues = fieldOptions.filter(fieldOption => props.notificationConfiguration.notification_configuration_variables[occurrenceIndex] && fieldOption.value === props.notificationConfiguration.notification_configuration_variables[occurrenceIndex].field_id)
                                                return (
                                                    <NotificationConfigurationFormVariableContainer key={occurrenceIndex}>
                                                        <NotificationConfigurationFormFieldLabel isVariable={true}>
                                                            {strings['pt-br']['notificationConfigurationFormVariableSelectorLabel']}
                                                            <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                                        </NotificationConfigurationFormFieldLabel>
                                                        <NotificationConfigurationFormSelectContainer errors={formErrors.variable && initialValues.length === 0}>
                                                            <Select 
                                                            key={occurrenceIndex}
                                                            options={fieldOptions}
                                                            initialValues={initialValues} 
                                                            onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                                            />
                                                        </NotificationConfigurationFormSelectContainer>
                                                        {formErrors.variable && initialValues.length === 0 ? (
                                                            <NotificationConfigurationFormErrors>
                                                                {formErrors.variable}
                                                            </NotificationConfigurationFormErrors>
                                                        ) : ''}
                                                    </NotificationConfigurationFormVariableContainer>
                                                )
                                            })}
                                        </NotificationConfigurationFormFieldContainer>
                                        {![null, ''].includes(props.notificationConfiguration.text) ? (
                                            <div>
                                                <NotificationConfigurationFormFieldContainer>
                                                    <NotificationConfigurationFormFieldLabel>
                                                        {strings['pt-br']['notificationConfigurationFormDaysDiffLabel']}
                                                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                                    </NotificationConfigurationFormFieldLabel>
                                                    <NotificationConfigurationFormFieldInput value={props.notificationConfiguration.days_diff} as="select" onChange={e=> {onChangeDaysDiff(e.target.value)}}>
                                                        {notificationDays.map(notificationDay => (
                                                            <option key={notificationDay} value={notificationDay}>{getDatesSelectLabel(notificationDay)}</option>
                                                        ))}
                                                    </NotificationConfigurationFormFieldInput>
                                                </NotificationConfigurationFormFieldContainer>
                                                <NotificationConfigurationFormFieldContainer>
                                                    <NotificationConfigurationFormSaveButton onClick={e=> {onSubmit()}}>
                                                        {strings['pt-br']['notificationConfigurationFormSaveButtonLabel']}
                                                    </NotificationConfigurationFormSaveButton>
                                                </NotificationConfigurationFormFieldContainer>
                                            </div>
                                        ) : ''}
                                    </div>
                                ) : ''}
                            </div>
                        ) : ''}
                    </div>
                ) : ''}
            </NotificationConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfigurationForm