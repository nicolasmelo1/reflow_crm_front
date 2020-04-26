import React, { useEffect, useState } from 'react'
import { View, Switch } from 'react-native'
import Select from '../Utils/Select'
import { 
    NotificationConfigurationFormContainer, 
    NotificationConfigurationFormCheckboxesContainer, 
    NotificationConfigurationFormCheckboxText,
    NotificationConfigurationFormCheckbox,
    NotificationConfigurationFormFieldLabel,
    NotificationConfigurationFormFieldLabelRequired,
    NotificationConfigurationFormFieldInput,
    NotificationConfigurationFormFieldContainer,
    NotificationConfigurationFormSelectContainer,
    NotificationConfigurationFormVariableContainer
} from '../../styles/Notification'

const NotificationConfigurationForm = (props) => {
    const sourceRef = React.useRef()
    const [notificationFieldOptions, setNotificationFieldOptions]= useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const formulariesOptions = [].concat(...props.formularies.map(group=> group.form_group.map(form=> ({ value: form.id, label: form.label_name }))))
    const initialFormularyOptions = formulariesOptions.filter(formularyOption=> formularyOption.value === props.notificationConfiguration.form)
    const initialNotificationFieldOptions = notificationFieldOptions.filter(notificationFieldOption => notificationFieldOption.value === props.notificationConfiguration.field)
    const occurrences = props.notificationConfiguration.text.match(/{{(\w+)?}}/g) || []
    const notificationConfigurationData = JSON.parse(JSON.stringify(props.notificationConfiguration))
    
    
    const onChangeVariable = (index, data) => {
        const formattedText = props.notificationConfiguration.text.replace(/{{(\w+)?}}/g, '{{}}')
        let splittedText = formattedText.split(/{(.*?)}(?!})/g)
        let counter = 0
        let fieldName = []

        if (data.length > 0) {
            fieldName = fieldOptions.filter(fieldOption => fieldOption.value === data[0])
        }
        const newSplittedText = splittedText.map(textSentence => {
            if (textSentence === '{}') {
                if (counter === index) {
                    return fieldName.length > 0 ? `{{${fieldName[0].field_name}}}` : ''
                } else {
                    counter ++
                    return `{{${occurrences[counter-1].replace('{{','').replace('}}','')}}}`
                }
            } else {
                return textSentence
            }
        })
        notificationConfigurationData.text = newSplittedText.join('')
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeNotificationName = (data) => {
        notificationConfigurationData.name = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeField = (data) => {
        notificationConfigurationData.field = data.length > 0 ? data[0] : null
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeFormulary = (data) => {
        notificationConfigurationData.form = data.length > 0 ? data[0] : null
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeText = (data) => {
        notificationConfigurationData.text = data
        props.updateNotification(props.notificationConfigurationIndex, notificationConfigurationData)
    }

    const onChangeSizeOfText = (e) => {
        console.log(e)
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
        //console.log(props.notificationConfigurationFields.notification_fields)
        setNotificationFieldOptions(props.notificationConfigurationFields.notification_fields.map(field=> ({ value: field.id, label: field.label_name })))
    }, [props.notificationConfigurationFields.notification_fields])

    useEffect(() => {
        setFieldOptions(props.notificationConfigurationFields.variable_fields.map(field=> ({ value: field.id, label: field.label_name, field_name: field.name })))
    }, [props.notificationConfigurationFields.variable_fields])

    useEffect(() => {
        if (props.notificationConfiguration.form) {
            props.onGetNotificationConfigurationFields(sourceRef.current, props.notificationConfiguration.form)
        } else {
            setNotificationFieldOptions([])
            setFieldOptions([])
        }
    }, [props.notificationConfiguration.form])

    const renderMobile = () => {
        return (
            <NotificationConfigurationFormContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormCheckboxesContainer>
                        <NotificationConfigurationFormCheckbox/><NotificationConfigurationFormCheckboxText> Para toda a companhia</NotificationConfigurationFormCheckboxText>
                    </NotificationConfigurationFormCheckboxesContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
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
                    value={props.notificationConfiguration.text}
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
            </NotificationConfigurationFormContainer>
        )
    }

    const renderWeb = () => {
        return (
            <NotificationConfigurationFormContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormCheckboxesContainer>
                        <input type="checkbox"/>
                        <NotificationConfigurationFormCheckboxText> Para toda a companhia</NotificationConfigurationFormCheckboxText>
                    </NotificationConfigurationFormCheckboxesContainer>
                </NotificationConfigurationFormFieldContainer>
                <NotificationConfigurationFormFieldContainer>
                    <NotificationConfigurationFormFieldLabel>
                        Nome da notificação<NotificationConfigurationFormFieldLabelRequired>*</NotificationConfigurationFormFieldLabelRequired>
                    </NotificationConfigurationFormFieldLabel>
                    <NotificationConfigurationFormFieldInput 
                    type="text" 
                    placeholder="Dê um nome a sua notificação" 
                    value={props.notificationConfiguration.name} 
                    onChange={e => {onChangeNotificationName(e.target.value)}}
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
                    type='text'
                    placeholder="Dê um nome a sua notificação" 
                    value={props.notificationConfiguration.text}
                    onChange={e=> {onChangeText(e.target.value)}}
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
                <input type="submit" value="Salvar"/>
            </NotificationConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfigurationForm