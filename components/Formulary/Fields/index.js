import React, { useState, useEffect } from 'react'
import Text from './Text'
import Number from './Number'
import Date from './Date'
import Email from './Email'
import Option from './Option'
import MultiOption from './MultiOption'
import Attachment from './Attachment'
import Id from './Id'
import LongText from './LongText'
import Form from './Form'
import { Field } from 'styles/Formulary'

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
                return Date
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

    useEffect(()=> {
        setValues(props.fieldFormValues)
    }, [props.fieldFormValues])
    
    return (
        <div>
            {(props.field_is_hidden) ? '' : (
                <div>
                    {(props.field.label_is_hidden) ? '' : (
                        <Field.FieldTitle.Label>
                            { props.field.label_name }
                            <Field.FieldTitle.Required>{(props.field.required) ? '*': ''}</Field.FieldTitle.Required>
                        </Field.FieldTitle.Label>
                    )}
                    {renderFieldType()}
                </div>
            )}
        </div>
    )
}

export default Fields