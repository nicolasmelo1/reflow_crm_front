import React, { useEffect, useState } from 'react'
import { View, Switch } from 'react-native'
import Select from '../Utils/Select'
import { 
    NotificationConfigurationFormContainer, 
    NotificationConfigurationFormCheckboxesContainer, 
    NotificationConfigurationFormCheckboxText,
    NotificationConfigurationFormCheckbox,
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

const NotificationConfigurationForm = (props) => {
    const sourceRef = React.useRef()
    const [notificationFieldOptions, setNotificationFieldOptions]= useState([])
    const [errors, setErrors] = useState({})
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
            text = [1].includes(day) ? strings['pt-br']['notificationConfigurationFormDayDiffAfterDaysSelectOptionLabel'].replace('{}',day) :
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
        notificationConfigurationData.notification_configuration_variables = notificationConfigurationData.notification_configuration_variables.filter(variable => [...occurrences, null, ''].includes(variable.field_name))
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
            // is removing a variable
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
                    setErrors({variable: errors('pt-br', 'invalid_variable')})
                } else if (Object.keys(response.data.error).every(error=> Object.keys(props.notificationConfiguration).includes(error))) {
                    // its a error with one of the fields
                    const error = JSON.parse(JSON.stringify(response.data.error))
                    Object.keys(response.data.error).forEach(errorKey => {
                        // might need to add new cases in the future, this only chacks blank fields
                        error[errorKey] = (error[errorKey][0] === 'blank') ? errors('pt-br', 'blank_field') : errors('pt-br', 'unknown_field')
                    })
                    setErrors(error)
                }
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
                return `{{${props.notificationConfiguration.notification_configuration_variables[counter-1].field_name}}}`
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
                <NotificationConfigurationFormFieldContainer errors={errors.form}>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormNotificationNameLabel']}<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    type="text" 
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.nativeEvent.text)}}
                    />
                    {errors.name ? (
                        <NotificationConfigurationFormErrors>
                            {errors.name}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer>
                        <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                    </NotificationConfigurationFormSelectContainer>
                    {errors.form ? (
                        <NotificationConfigurationFormErrors>
                            {errors.form}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer>
                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                    </NotificationConfigurationFormSelectContainer>
                    {errors.field ? (
                        <NotificationConfigurationFormErrors>
                            {errors.field}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormTextLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
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
                                <NotificationConfigurationFormSelectContainer errors={errors.variable && initialValues.length === 0}>
                                    <Select 
                                    key={occurrenceIndex}
                                    options={fieldOptions}
                                    initialValues={initialValues} 
                                    onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                    />
                                </NotificationConfigurationFormSelectContainer>
                                {errors.variable && initialValues.length === 0 ? (
                                    <NotificationConfigurationFormErrors>
                                        {errors.variable}
                                    </NotificationConfigurationFormErrors>
                                ) : ''}
                            </NotificationConfigurationFormVariableContainer>
                        )
                    })}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormDaysDiffLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormSaveButton onClick={e=> {onSubmit()}}>
                        {strings['pt-br']['notificationConfigurationFormSaveButtonLabel']}
                    </NotificationConfigurationFormSaveButton>
                </NotificationConfigurationFormFieldContainer>
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
                    errors={errors.name}
                    type="text" 
                    placeholder={strings['pt-br']['notificationConfigurationFormNotificationNameInputPlaceholder']}
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.target.value)}}
                    />
                    {errors.name ? (
                        <NotificationConfigurationFormErrors>
                            {errors.name}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormFormularySelectorLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer errors={errors.form}>
                        <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                    </NotificationConfigurationFormSelectContainer>
                    {errors.form ? (
                        <NotificationConfigurationFormErrors>
                            {errors.form}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormFieldSelectorLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer errors={errors.field}>
                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                    </NotificationConfigurationFormSelectContainer>
                    {errors.field ? (
                        <NotificationConfigurationFormErrors>
                            {errors.field}
                        </NotificationConfigurationFormErrors>
                    ) : ''}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        {strings['pt-br']['notificationConfigurationFormTextLabel']}
                        <NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    errors={errors.text}
                    type='text'
                    placeholder={strings['pt-br']['notificationConfigurationFormTextPlaceholder']}
                    value={props.notificationConfiguration.text}
                    onChange={e=> {onChangeText(e.target.value)}}
                    />
                    {errors.text ? (
                        <NotificationConfigurationFormErrors>
                            {errors.text}
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
                                <NotificationConfigurationFormSelectContainer errors={errors.variable && initialValues.length === 0}>
                                    <Select 
                                    key={occurrenceIndex}
                                    options={fieldOptions}
                                    initialValues={initialValues} 
                                    onChange={(data) => onChangeVariable(occurrenceIndex, data)}
                                    />
                                </NotificationConfigurationFormSelectContainer>
                                {errors.variable && initialValues.length === 0 ? (
                                    <NotificationConfigurationFormErrors>
                                        {errors.variable}
                                    </NotificationConfigurationFormErrors>
                                ) : ''}
                            </NotificationConfigurationFormVariableContainer>
                        )
                    })}
                </NotificationConfigurationFormFieldContainer>
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
            </NotificationConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfigurationForm