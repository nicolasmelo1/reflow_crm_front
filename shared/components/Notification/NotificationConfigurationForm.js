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

const NotificationConfigurationForm = (props) => {
    const sourceRef = React.useRef()
    const textRef = React.useRef(props.notificationConfiguration.text)
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
        let text = 'No mesmo dia'
        if (day < 0) {
            text = [-1].includes(day) ? day*(-1) + ' dia antes' : day*(-1) + ' dias antes'
        } else if (day > 0) {
            text = [1].includes(day) ? day + ' dia depois' : day + ' dias depois'
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
        console.log(occurrences)
        console.log(notificationConfigurationData.notification_configuration_variables)
        notificationConfigurationData.notification_configuration_variables = notificationConfigurationData.notification_configuration_variables.filter(variable => [...occurrences, null, ''].includes(variable.field_name))
        console.log( notificationConfigurationData.notification_configuration_variables)
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
                    setErrors({variable: 'Certifique-se que a variável é um campo válido'})
                } else if (Object.keys(response.data.error).every(error=> Object.keys(props.notificationConfiguration).includes(error))) {
                    // its a error with one of the fields
                    const error = JSON.parse(JSON.stringify(response.data.error))
                    Object.keys(response.data.error).forEach(errorKey => {
                        error[errorKey] = (error[errorKey][0] === 'blank') ? 'O campo não pode ser vazio' : 'Aconteceu algum erro com esse campo'
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
                        Nome da notificação<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    type="text" 
                    placeholder="Dê um nome a sua notificação" 
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.nativeEvent.text)}}
                    />
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        Formulário<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer>
                        <Select options={formulariesOptions} initialValues={initialFormularyOptions} onChange={onChangeFormulary}/>
                    </NotificationConfigurationFormSelectContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        O campo de data a ser considerado<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormSelectContainer>
                        <Select options={notificationFieldOptions} initialValues={initialNotificationFieldOptions} onChange={onChangeField}/>
                    </NotificationConfigurationFormSelectContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        Texto<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    multiline={true}
                    placeholder="Dê um nome a sua notificação" 
                    value={notificationConfigurationData.text}
                    onChange={e=> {onChangeText(e.nativeEvent.text)}}
                    />
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer isVariable={true}>
                    {occurrences.map((occurrence, occurrenceIndex) => {
                        occurrence = occurrence.replace('{{','').replace('}}','')
                        const initialFieldOption = fieldOptions.filter(fieldOption => fieldOption.field_name === occurrence)
                        return (
                            <NotificationConfigurationFormVariableContainer key={occurrenceIndex}>
                                <NotificationConfigurationFormFieldLabel isVariable={true}>
                                    Variável<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                                </NotificationConfigurationFormFieldLabel>
                                <NotificationConfigurationFormSelectContainer>
                                    <Select options={fieldOptions} initialValues={initialFieldOption} onChange={(data) => onChangeVariable(occurrenceIndex, data)}/>
                                </NotificationConfigurationFormSelectContainer>
                            </NotificationConfigurationFormVariableContainer>
                        )
                    })}
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                            Nome da notificação<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
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
                        <NotificationConfigurationFormCheckboxText> Para toda a companhia</NotificationConfigurationFormCheckboxText>
                    </NotificationConfigurationFormCheckboxesContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        Nome da notificação<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    errors={errors.name}
                    type="text" 
                    placeholder="Dê um nome a sua notificação" 
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
                        Formulário<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
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
                        O campo de data a ser considerado<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
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
                        Texto<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    errors={errors.text}
                    type='text'
                    placeholder="Dê um nome a sua notificação" 
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
                                    Variável<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
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
                        Notificar<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput value={props.notificationConfiguration.days_diff} as="select" onChange={e=> {onChangeDaysDiff(e.target.value)}}>
                        {notificationDays.map(notificationDay => (
                            <option key={notificationDay} value={notificationDay}>{getDatesSelectLabel(notificationDay)}</option>
                        ))}
                    </NotificationConfigurationFormFieldInput>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormSaveButton onClick={e=> {onSubmit()}}>
                        Salvar
                    </NotificationConfigurationFormSaveButton>
                </NotificationConfigurationFormFieldContainer>
            </NotificationConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfigurationForm