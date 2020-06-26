import React, { useState, useEffect } from 'react'
import Text from './Text'
import Number from './Number'
import Datetime from './Datetime'
import Email from './Email'
import User from './User'
import Period from './Period'
import Option from './Option'
import MultiOption from './MultiOption'
import Attachment from './Attachment'
import Id from './Id'
import LongText from './LongText'
import Form from './Form'
import { Field } from '../../../styles/Formulary'
import { errors, strings } from '../../../utils/constants'
import isEqual from '../../../utils/isEqual'

/**
 * This component controls each field individually, it's the parent component for all of the field types.
 * This component doesn't contain any logic from any field in particular EXCEPT the Form/Connection type of field.
 * 
 * It is supposed to be able to handle all the functionalities for all of the fields. If you need to add new
 * features for a specific field, check the field type main component in `shared/components/Formulary/Fields` folder. 
 * If you want to add any new Field, you can create it in the `shared/components/Formulary/Fields` folder.
 * 
 * So for example suppose we want a new field that is supposed to handle MAPs.
 * 1 - We create a new component in the `shared/components/Formulary/Fields` called `Maps.js`
 * 2 - All of the functionality for this field should be inside the new file `Maps.js`
 * 3 - Don't forget to register the field in `.getFieldType()` function in order to be rendered correctly.
 * 
 * @param {Object} errors - An object with errors for each field.
 * @param {Function} onChangeFormulary - Function to be fired when the user clicks "Add New" or "Edit" in 
 * Form/Connection type of field. It changes the formulary automatically.
 * @param {Interger} sectionId - The id of the current section
 * @param {Object} field - Remember the HOW and the WHAT explained in Formulary main component? This is the data
 * from HOW to render about the current view.
 * @param {Array<Object>} fieldFormValues - This is the What for the particular field, so what are the values this
 * specific field contains. It is important to notice that we ONLY use this when the state of the `values` state is
 * different than what this object contains. This way we can propagate changes up in the chain but not down. This way
 * we keep the Field component in it's `own litle world`.
 * @param {Function} getFieldFormValues - Function for retrieving the formValues from the parent state. Used only when
 * we update the formValue, this way we can keep this data and parent in sync with each other.
 * @param {Function} addFieldFormValue - Function to add form value to the parent state.
 * @param {Function} removeFieldFormValue - Function to remove form value from the parent state.
 * @param {Function} updateFieldFormValue - Function to add formValue from the parent state.
 * @param {Function} addFieldFile - Function to add new file, this function was defined in Formulary component and is used here
 * to add new files.
 * @param {Function} removeFieldFile - Function to remove a file from the files array in `index.js` in `shared/components/Formulary`.
 * @param {String} type - The type of the formulary, check `index.js` in `shared/components/Formulary`.
 * @param {Array<Object>} types - Array of objects about types. I think by now you might understand what it is, but anyway.
 * Types are used as default and required data used for everything around our application.
 */
const Fields = (props) => {
    const [values, setValues] = useState([])
    const typeId = (props.field.type?.type) ? props.field.type.type : props.field.type
    const fieldContainerRef = React.useRef(null)

    let typeName = (props.types.data) ? props.types.data.field_type.filter(fieldType => fieldType.id === typeId): []
    typeName = (typeName.length !== 0) ? typeName[0].type : ''

    const getFieldType = () => {
        switch (typeName) {
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
            case "period":
                return Period
            case "user":
                return User
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
    // the first if occurs if the user is editing the form, since these props are not passed when the user is editing
    // and the user should be used to test the field, he can still test, the first else condition is used in those cases.
    const multipleValueFieldHelper = (values) => {
        const formValues = props.fieldFormValues
        if (props.addFieldFormValue && props.removeFieldFormValue && props.updateFieldFormValue && props.getFieldFormValues) {
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
        } else {
            return values.map(value=> { return {field_name: props.field.name, value:value} })
        }
    }

    // Fields that accept a single value usually have the same logic,
    // so we use this function to don't repeat code in components
    // the first if occurs if the user is editing the form, since these props are not passed when the user is editing
    // and the user should be used to test the field, he can still test, the first else condition is used in those cases.
    const singleValueFieldsHelper = (value) => {
        if (props.addFieldFormValue && props.removeFieldFormValue && props.updateFieldFormValue && props.getFieldFormValues) {
            if (props.fieldFormValues.length === 0) {
                props.addFieldFormValue(props.field.name, value)
            } else if (value === '') {
                props.removeFieldFormValue(props.field.name, props.fieldFormValues[0].value)
            } else {
                props.updateFieldFormValue(props.field.name, props.fieldFormValues[0].value, value)
            }
            return props.getFieldFormValues(props.field.name)
        } else {
            return [{field_name: props.field.name, value:value}]
        }
    }

    const renderFieldType = () => {
        const Component = getFieldType()
        if (Component) {
            return (<Component values={values} setValues={setValues} singleValueFieldsHelper={singleValueFieldsHelper} multipleValueFieldHelper={multipleValueFieldHelper} {...props}/>)
        } else {
            return ''
        }
    }
    
    // checks in the field level if any error has occurred
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
        // We prevent the changes from propagating back down if the states are equal.
        if (props.addFieldFormValue && props.fieldFormValues && !isEqual(props.fieldFormValues, values)) {
            setValues(props.fieldFormValues)
            if (props.fieldFormValues.length === 0 && props.field.field_is_hidden) {
                props.addFieldFormValue(props.field.name, '')
            }
        }
    }, [props.fieldFormValues])

    // Scroll into field when there are any errors in the formulary
    useEffect(() => {
        if (checkErrors() && fieldContainerRef.current) {
            fieldContainerRef.current.scrollIntoView()
        }
    })

    return (
        <Field.Container ref={fieldContainerRef} invalid={checkErrors()}>
            <div>
                {(props.field.label_is_hidden) ? '' : (
                    <Field.FieldTitle.Label>
                        { props.field.label_name }
                        <Field.FieldTitle.Required>{(props.field.required) ? '*': ''}</Field.FieldTitle.Required>
                        {(typeName === 'form' && props.type !== 'embbed') ? (
                            <Field.FieldTitle.FormButton 
                            onClick={e => {props.type === 'full' ? props.onChangeFormulary(props.field.form_field_as_option.form_name, (values.length > 0) ? values[0].value: null) : () => {}}}
                            >
                                {formFieldLabelButtonText()}
                            </Field.FieldTitle.FormButton>
                        ) : ''}
                    </Field.FieldTitle.Label>
                )}
                {props.field.field_is_hidden ? null : renderFieldType()}
            </div>
            {(checkErrors()) ? (
                <Field.Errors>{errors('pt-br', props.errors.reason[0])}</Field.Errors>
            ) : ''}
        </Field.Container>
    )
}

export default Fields