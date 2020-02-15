import React, { useState, useEffect } from 'react'
import Text from './Text'
import Number from './Number'
import Datetime from './Datetime'
import Email from './Email'
import Option from './Option'
import MultiOption from './MultiOption'
import Attachment from './Attachment'
import Id from './Id'
import LongText from './LongText'
import Form from './Form'
import { Field } from 'styles/Formulary'
import { errors, strings } from 'utils/constants'

const Fields = (props) => {
    const [values, setValues] = useState([])

    const getFieldType = () => {
        switch (props.field.field_type) {
            case "id":
                return Id
            case "text":
                return Text
            case "number":
                return Number
            case "date":
                return Datetime
            case "email": 
                return Email
            case "option":
                return Option
            case "multi_option":
                return MultiOption
            case "attachment":
                return Attachment
            case "long_text":
                return LongText
            case "form":
                return Form
        }
    }

    // Fields that accept multiple values usually have the same logic,
    // so we use this function to don't repeat code in each component
    const multipleValueFieldHelper = (values) => {
        const formValues = props.fieldFormValues
        values.forEach(value => {
            if (formValues.find(formValue => formValue.value === value && formValue.field_name === props.field.name) === undefined) {
                props.addFieldFormValue(props.field.name, value)
            } 
        }) 
        formValues.forEach(formValue => {
            if (!values.includes(formValue.value)) {
                props.removeFieldFormValue(props.field.name, formValue.value)
            }
        })
        return props.getFieldFormValues(props.field.name)
    }

    // Fields that accept a single value usually have the same logic,
    // so we use this function to don't repeat code in components
    const singleValueFieldsHelper = (value) => {
        if (props.fieldFormValues.length === 0) {
            props.addFieldFormValue(props.field.name, value)
        } else if (value === '') {
            props.removeFieldFormValue(props.field.name, props.fieldFormValues[0].value)
        } else {
            props.updateFieldFormValue(props.field.name, props.fieldFormValues[0].value, value)
        }
        return props.getFieldFormValues(props.field.name)
    }

    const renderFieldType = () => {
        const Component = getFieldType()
        if (Component) {
            return (<Component values={values} setValues={setValues} singleValueFieldsHelper={singleValueFieldsHelper} multipleValueFieldHelper={multipleValueFieldHelper} {...props}/>)
        } else {
            return ''
        }
    }

    const checkErrors = () => {
        if (Object.keys(props.errors).length !== 0 && props.errors.detail.includes(props.field.name)) {
            switch (props.errors.reason[0]) {
                case 'required_field':
                    return values.length === 0 || values.filter(value => value.value === '').length !== 0
                case 'already_exists':
                    return values.filter(value => props.errors.data.includes(value.value)) !== 0
                case 'invalid_file':
                    return values.filter(value => props.errors.data.includes(value.value)) !== 0
                default:
                    return false
            }
        }
        return false
    }


    const formFieldLabelButtonText = () => {
        if (values.length === 0) {
            return strings['pt-br']['formularyFormFieldAddNewButtonLabel']
        } else {
            return strings['pt-br']['formularyFormFieldEditButtonLabel']
        }
    }

    useEffect(()=> {
        setValues(props.fieldFormValues)
        if (props.fieldFormValues.length === 0 && props.field.field_is_hidden) {
            props.addFieldFormValue(props.field.name, '')
        }
    }, [props.fieldFormValues])

    return (
        <Field.Container invalid={checkErrors()}>
            {(props.field_is_hidden) ? '' : (
                <div>
                    {(props.field.label_is_hidden) ? '' : (
                        <Field.FieldTitle.Label>
                            { props.field.label_name }
                            <Field.FieldTitle.Required>{(props.field.required) ? '*': ''}</Field.FieldTitle.Required>
                            {(props.field.field_type === 'form') ? (
                                <Field.FieldTitle.FormButton 
                                onClick={e => {props.onChangeFormulary(props.field.form_field_as_option.form_name, (values.length > 0) ? values[0].value: null)}}
                                >
                                    {formFieldLabelButtonText()}
                                </Field.FieldTitle.FormButton>
                            ) : ''}
                        </Field.FieldTitle.Label>
                    )}
                    {renderFieldType()}
                </div>
            )}
            {(checkErrors()) ? (
                <Field.Errors>{errors('pt-br', props.errors.reason[0])}</Field.Errors>
            ) : ''}
        </Field.Container>
    )
}

export default Fields