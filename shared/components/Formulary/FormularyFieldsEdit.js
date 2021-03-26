import React from 'react'
import { View } from 'react-native'
import FormularyFieldEdit from './FieldsEdit'
import { FormulariesEdit }  from '../../styles/Formulary'
import { strings } from '../../utils/constants'

/**
 * This component controls ALL of the fields data.
 * 
 * @param {Boolean} fieldIsMoving - boolean that defines if the field is being dragged or not
 * @param {function} setFieldIsMoving - function to set true or false in the `fieldIsMoving` variable to say
 * if the field is being dragged or not.
 * @param {BigInteger} sectionIndex - the index of the section inside of the section array
 * @param {function} onMoveField - function helper created in the parent component to update 
 * a single field when it has been dragged and dropped
 * @param {object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {function} removeField - function helper created in the parent component to remove a single field
 * @param {Array<Object>} fields - the array of the fields of the single section.
 * @param {function} onAddNewField - function helper created in the Formulary component to add a new field in the 
 * storage data
 * @param {function} onUpdateField - function helper created in the parent component to 
 * update a single field in the data store, this function is passed to the field directly
 * @param {Array<Object>} formulariesOptions - the formulariesOptions are all of the formularies the user can select when a user selects
 * the `form` field type or when the user creates a conditional section
 */
const FormularyFieldsEdit = (props) => {
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {props.fields.map((field, index)=> (
                    <FormularyFieldEdit
                    key={index}
                    field={field}
                    onCreateDraftFile={props.onCreateDraftFile}
                    types={props.types}
                    removeField={props.removeField}
                    fieldIsMoving={props.fieldIsMoving}
                    onMoveField={props.onMoveField}
                    setFieldIsMoving={props.setFieldIsMoving}
                    sectionIndex={props.sectionIndex}
                    onUpdateField={props.onUpdateField}
                    formulariesOptions={props.formulariesOptions}
                    userOptions={props.userOptions}
                    formName={props.formName}
                    formId={props.formId}
                    fieldIndex={index}
                    onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                    />
                ))}
                <FormulariesEdit.AddNewFieldButton text={strings['pt-br']['formularyEditAddNewFieldButtonLabel']} onClick={e=>{props.onAddNewField(props.sectionIndex)}}/>
    
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularyFieldsEdit