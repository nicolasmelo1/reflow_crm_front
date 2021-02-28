import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import FormularySectionEdit from './FormularySectionEdit'
import { FormulariesEdit, Formularies }  from '../../styles/Formulary'
import { strings } from '../../utils/constants'

/**
 * This component controls all of the sections, we keep most of the primary functions here, since that when we change
 * something we actually change the hole structure of the data, the redux reducer actually keep the complete structure
 * but most of the time we want to change parts of it, we could write many reducers but to keep it simple we prefer to keep
 * the redux dumb, and change always the hole data. This is why we have most functions for sections and fields here.
 * 
 * @param {function} onRemoveFormularySettingsField - the function from the redux action to remove a field
 * @param {function} onUpdateFormularySettingsField - the function from the redux action to update a field
 * @param {function} onCreateFormularySettingsField - the function from the redux action to create a new field  
 * @param {function} onRemoveFormularySettingsSection - the function from the redux action to remove a section
 * @param {function} onUpdateFormularySettingsSection - the function from the redux action to update a section
 * @param {function} onCreateFormularySettingsSection - the function from the redux action to create a new section                   
 * @param {function} onChangeFormularySettingsState - the function from redux action to change the store data, 
 * we don't make any backend calls on this function, just change the state.        
 * @param {BigInteger} formId - the ID of the current formulary we are editing.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {function} setIsEditing - function defined in the main Formulary component so we can define if the form
 * is in Editing mode or not.                             
 * @param {Object} data - this is the main data that we use to update formularies.
 * @param {Array<Object>} formulariesOptions - on field_type === `form` we usually need to connect a field with a 
 * field from another formulary.
 */
const FormularySectionsEdit = (props) => {
    const [isMoving, setIsMoving] = useState(false)
    const [fieldIsMoving, setFieldIsMoving] = useState(false)
    const [fieldOptions, setFieldOptions] = useState([])
    // ------------------------------------------------------------------------------------------
    const reorder = () => {
        props.data.depends_on_form = props.data.depends_on_form.map((section, sectionIndex) => {
            section.form_fields = section.form_fields.map((field, fieldIndex) => {
                field.order = fieldIndex+1
                return field
            })
            section.order = sectionIndex+1
            return section
        })
    }
    // ------------------------------------------------------------------------------------------
    // almost equal as the onDrop() function in SidebarFormEdit component in the Sidebar folder
    const onMoveField = (movedSectionFieldIndex, movedFieldIndex, targetSectionFieldIndex, targetFieldIndex) => {
        const movedElement = {...props.data.depends_on_form[movedSectionFieldIndex].form_fields[movedFieldIndex]}
        let newArrayWithoutMoved = [...props.data.depends_on_form]
        const targetSectionId = newArrayWithoutMoved[targetSectionFieldIndex].id
        let confirmation = true
        if (movedElement.form !== targetSectionId) {
            confirmation = confirm(`ALERTA!\nMover os campos entre seções, exclui os dados desse campo, deseja continuar?`)
        }
        if (confirmation) {
            movedElement.form = targetSectionId
            newArrayWithoutMoved[movedSectionFieldIndex].form_fields = [...props.data.depends_on_form[movedSectionFieldIndex].form_fields.filter((_, index) => index !== movedFieldIndex)]
            newArrayWithoutMoved[targetSectionFieldIndex].form_fields.splice(targetFieldIndex, 0, movedElement)
            props.data.depends_on_form = newArrayWithoutMoved
            reorder()
            if (props.data.depends_on_form[targetSectionFieldIndex].form_fields[targetFieldIndex].id) {
                props.onUpdateFormularySettingsField(props.data.depends_on_form[targetSectionFieldIndex].form_fields[targetFieldIndex], props.formId, props.data.depends_on_form[targetSectionFieldIndex].form_fields[targetFieldIndex].id)
            }
            props.onChangeFormularySettingsState({...props.data})
        }
    }
    // ------------------------------------------------------------------------------------------
    // almost equal as the onDrop() function in SidebarGroupEdit component in the Sidebar folder
    const onMoveSection = (movedSectionIndex, targetSectionIndex) => {
        let newArrayWithoutMoved = props.data.depends_on_form.filter((_, index) => index !== movedSectionIndex)
        newArrayWithoutMoved.splice(targetSectionIndex, 0, props.data.depends_on_form[movedSectionIndex])
        props.data.depends_on_form = newArrayWithoutMoved
        reorder()
        props.onChangeFormularySettingsState({...props.data})
        if (props.data.depends_on_form[targetSectionIndex].id) {
            props.onUpdateFormularySettingsSection(props.data.depends_on_form[targetSectionIndex], props.formId, props.data.depends_on_form[targetSectionIndex].id)
        }
    }
    // ------------------------------------------------------------------------------------------
    const onAddNewSection = () => {
        const defaultSectionData = {
            id:	null,
            conditional_on_field: null,
            conditional_value: null,
            conditional_type: null,
            form_fields: [],
            form_name: '',
            label_name: '',
            order: 0,
            enabled: true,
            type: (props.types.data.form_type && props.types.data.form_type.filter(formType=> formType.type === 'form').length > 0) ? props.types.data.form_type.filter(formType=> formType.type === 'form')[0].id : 1,
            group: null
        }

        props.data.depends_on_form.push(defaultSectionData)
        reorder()
        props.onChangeFormularySettingsState({...props.data})
    }
    // ------------------------------------------------------------------------------------------
    const onAddNewField = (sectionIndex) => {
        const defaultFieldData = {
            id: null,
            field_option: [],
            form_field_as_option : {
                id: null,
                form_depends_on_id: null,
                form_depends_on_group_id: null,
            },
            name: '',
            form: null,
            number_configuration_mask: '9',
            formula_configuration: null,
            label_name: '',
            placeholder: '',
            required: false,
            order: 0,
            is_unique: false,
            field_is_hidden: false,
            label_is_hidden: false,
            date_configuration_auto_create: false,
            date_configuration_auto_update:	false,
            number_configuration_allow_negative: true,
            number_configuration_allow_zero: true,
            enabled: true,
            date_configuration_date_format_type: (props.types.data.field_date_format_type && props.types.data.field_date_format_type.filter(dateFormat=> dateFormat.type === 'date').length > 0) ? props.types.data.field_date_format_type.filter(dateFormat=> dateFormat.type=== 'date')[0].id : 1,
            period_configuration_period_interval_type: (props.types.data.field_period_interval_type && props.types.data.field_period_interval_type.filter(periodFormat=> periodFormat.type === 'date').length > 0) ? props.types.data.field_period_interval_type.filter(periodFormat=> periodFormat.type === 'date')[0].id : 4,
            number_configuration_number_format_type: (props.types.data.field_number_format_type && props.types.data.field_number_format_type.filter(numberFormat=> numberFormat.type === 'number').length > 0) ? props.types.data.field_number_format_type.filter(numberFormat=> numberFormat.type === 'number')[0].id : 1,
            type: (props.types.data.field_type && props.types.data.field_type.filter(fieldType=> fieldType.type === 'text').lenght > 0) ? props.types.data.field_type.filter(fieldType=> fieldType.type === 'text')[0].id : 2,
        }
    
        let newFieldData = {...defaultFieldData}
        newFieldData.form = props.data.depends_on_form[sectionIndex].id
        props.data.depends_on_form[sectionIndex].form_fields.push(newFieldData)
        reorder()
        props.onChangeFormularySettingsState({...props.data})
    }
    // ------------------------------------------------------------------------------------------
    const removeSection = (sectionIndex) => {
        const sectionId = {...props.data.depends_on_form[sectionIndex]}
        props.data.depends_on_form.splice(sectionIndex, 1)
        reorder()
        props.onChangeFormularySettingsState({...props.data})
        if (sectionId.id) {
            props.onRemoveFormularySettingsSection(props.formId, sectionId.id)
        }
    } 
    // ------------------------------------------------------------------------------------------
    const removeField = (sectionIndex, fieldIndex) => {
        const fieldId = {...props.data.depends_on_form[sectionIndex].form_fields[fieldIndex]}
        props.data.depends_on_form[sectionIndex].form_fields.splice(fieldIndex, 1)
        reorder()
        props.onChangeFormularySettingsState({...props.data})
        if (fieldId.id) {
            props.onRemoveFormularySettingsField(props.formId, fieldId.id)
        }
    }
    // ------------------------------------------------------------------------------------------
    const onUpdateField = (sectionIndex, fieldIndex, newFieldData) => {
        props.data.depends_on_form[sectionIndex].form_fields[fieldIndex] = newFieldData
        if (![null, -1].includes(newFieldData.id)) {
            props.onUpdateFormularySettingsField(newFieldData, props.formId, newFieldData.id)
            props.onChangeFormularySettingsState({...props.data})
        } else {
            props.onCreateFormularySettingsField(newFieldData, props.formId, sectionIndex, fieldIndex)
        }
    }
    // ------------------------------------------------------------------------------------------
    const onUpdateSection = (sectionIndex, newSectionData) => {
        props.data.depends_on_form[sectionIndex] = newSectionData
        if (![null, -1].includes(newSectionData.id)) {
            props.onUpdateFormularySettingsSection(newSectionData, props.formId, newSectionData.id)
            props.onChangeFormularySettingsState({...props.data})
        } else {
            props.onCreateFormularySettingsSection(newSectionData, props.formId, sectionIndex)
        }
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.data.depends_on_form) {
            const sectionsData = [...props.data.depends_on_form]
            setFieldOptions([].concat.apply([], sectionsData.map(section => section.form_fields.filter(field => field && field.id))))
        }
    }, [props.data.depends_on_form])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                <Formularies.EditButton onClick={props.setIsEditing} label={strings['pt-br']['formularyFinishEditButtonLabel']} description={strings['pt-br']['formularyFinishEditButtonDescription']}/>
                {props.data.depends_on_form ? props.data.depends_on_form.map((section, index)=> (
                    <FormularySectionEdit key={index} 
                    onUpdateSection={onUpdateSection} 
                    onUpdateField={onUpdateField}
                    sectionIndex={index}
                    section={section} 
                    fieldIsMoving={fieldIsMoving}
                    removeSection={removeSection}
                    removeField={removeField}
                    setFieldIsMoving={setFieldIsMoving}
                    isMoving={isMoving}
                    onMoveSection={onMoveSection}
                    onMoveField={onMoveField}
                    setIsMoving={setIsMoving}
                    onAddNewField={onAddNewField}
                    types={props.types} 
                    fieldOptions={fieldOptions}
                    formulariesOptions={props.formulariesOptions}
                    onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                    formName={props.formName}
                    formId={props.formId}
                    userOptions={props.userOptions}
                    />
                )): ''}
                <FormulariesEdit.AddNewSectionButton text={strings['pt-br']['formularyEditAddNewSectionButtonLabel']} onClick={e=>{onAddNewSection()}} />

            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySectionsEdit