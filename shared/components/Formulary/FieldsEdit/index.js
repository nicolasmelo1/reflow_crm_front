import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Number from './Number'
import Period from './Period'
import Option from './Option'
import Connection from './Connection'
import Datetime from './Datetime'
import Fields from '../Fields'
import Select from '../../Utils/Select'
import { FormulariesEdit }  from '../../../styles/Formulary'
import { types, strings } from '../../../utils/constants'
import deepCopy from '../../../utils/deepCopy'
import Overlay from '../../../styles/Overlay'
import Alert from '../../Utils/Alert'
import agent from '../../../utils/agent'

/**
 * We created this component because probably each selection item will be styled
 * 
 * @param {String} name - the name to show in the option 
 */
const FieldOption = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}

/**
 * This component controls a unique and single field.
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
 * @param {Object} field - the object of a single field
 * @param {BigInteger} fieldIndex - the index of this single field in the fields array of the section
 * @param {function} onUpdateField - function helper created in the parent component to 
 * update a single field in the data store, this function is passed to the field directly
 * @param {Array<Object>} formulariesOptions - the formulariesOptions are all of the formularies the user can select when a user selects
 * the `form` field type or when the user creates a conditional section
 */
const FormularyFieldEdit = (props) => {
    const [fieldTypeIsOpen, setFieldTypeIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [fieldTypes, setFieldTypes] = useState([])
    const [initialFieldType, setInitialFieldType] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [draftToFileReference, setDraftToFileReference] = useState({})
    const [defaultValueIsOpen, setDefaultValueIsOpen] = useState(false)

    const getFieldTypeName = () => {
        const fieldType = props.types.data.field_type.filter(fieldType => fieldType.id === props.field.type)
        if (fieldType.length > 0) {
            return fieldType[0].type
        } else {
            return ''
        }
    }

    const onMoveField = (e) => {
        let fieldContainer = e.currentTarget.closest('.field-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(fieldContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('fieldSectionIndexToMove', JSON.stringify(props.sectionIndex))
        e.dataTransfer.setData('fieldIndexToMove', JSON.stringify(props.fieldIndex))
        props.setFieldIsMoving(true)
    }

    const onRemoveField = () => {
        props.removeField(props.sectionIndex, props.fieldIndex)
    }

    const onDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        let movedFieldSectionIndex = e.dataTransfer.getData('fieldSectionIndexToMove')
        let movedFieldIndex = e.dataTransfer.getData('fieldIndexToMove')
        if (movedFieldIndex !== '' && movedFieldSectionIndex !== '') {
            movedFieldSectionIndex = JSON.parse(movedFieldSectionIndex)
            movedFieldIndex = JSON.parse(movedFieldIndex)
            props.onMoveField(movedFieldSectionIndex, movedFieldIndex, props.sectionIndex, props.fieldIndex)
        }
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.setFieldIsMoving(false)
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    // ------------------------------------------------------------------------------------------
    const onDisableField = (e) => {
        let fieldData = {...props.field}
        fieldData.enabled = !fieldData.enabled
        props.onUpdateField(props.sectionIndex, props.fieldIndex, fieldData)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeFieldName = (e) => {
        e.preventDefault();
        let fieldData = {...props.field}
        fieldData.label_name = e.target.value
        props.onUpdateField(props.sectionIndex, props.fieldIndex, fieldData)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeFieldType = (data) => {
        let fieldData = {...props.field}
        fieldData.type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, {...fieldData})
    }
    // ------------------------------------------------------------------------------------------
    const onFilterFieldType = (value) => {
        return (props.types && props.types.data && props.types.data.field_type) ? props.types.data.field_type
        .filter(fieldType=> types('pt-br', 'field_type', fieldType.type).includes(value))
        .map(fieldType=> 
            { 
                return { 
                    value: fieldType.id, 
                    label: { 
                        props: {
                            name: types('pt-br', 'field_type', fieldType.type) 
                        } 
                    }
                }
            }
        ): []
    }
    // ------------------------------------------------------------------------------------------
    const onChangeRequired = () => {
        props.field.required = !props.field.required
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeIsUnique = () => {
        props.field.is_unique = !props.field.is_unique
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeLabelIsHidden = () => {
        props.field.label_is_hidden = !props.field.label_is_hidden
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeFieldIsHidden = () => {
        props.field.field_is_hidden = !props.field.field_is_hidden
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is needed because we use the Field component to update the default values, this way we don't
     * need to any special logic to add default values
     * 
     * @param {String} value - The value as string to add.
     */
    const onAddDefaultFieldValue = (__, value) => {
        if (value != '') {
            props.field.field_default_field_values.push({
                id: null,
                value: value
            })
            props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Similar to `onAddDefaultFieldValue` function. We need this because we use this to remove values from
     * the fields, the fields are used on the formularies, but on this context we just simulate this for adding
     * default fields.
     * 
     * @param {String} value - The removed value
     */
    const onRemoveDefaultFieldValue = (__, value) => {
        props.field.field_default_field_values = props.field.field_default_field_values.filter(defaultFieldValue => defaultFieldValue.value !== value)
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Similar to both `onRemoveDefaultFieldValue` and `onAddDefaultFieldValue` functions. We need this because on the fields
     * we can have many values for a single field, with this we are able to mimic and use this funcionality to add default
     * values to the fields. This function is used to update a field.
     * 
     * @param {String} oldValue - The old value as string that needs to be changed
     * @param {String} newValue - The new value to change the old value to
     */
    const onUpdateDefaultFieldValue = (__, oldValue, newValue) => {
        for (let i = 0; i<props.field.field_default_field_values.length; i++) {
            if (props.field.field_default_field_values[i].value === oldValue) {
                props.field.field_default_field_values[i].value = newValue
            }
        }
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    // ------------------------------------------------------------------------------------------
    const onAddDefaultFileAttachment = async (file) => {
        const response = await props.onCreateDraftFile(file)
        if (response && response.status === 200) {
            const draftStringId = response.data.data.draft_id
            draftToFileReference[draftStringId] = file.name
            setDraftToFileReference({...draftToFileReference})
            return draftStringId
        }
        return ''
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Retrieves the attachment url to use on the attachments.
     * 
     * @param {String} fileName - The name of the file you want to retrieve the url for
     * 
     * @returns {String} - The url to retrieve the fil
     */
    const onGetAttachmentUrl = async (__, fileName) => {
        return await agent.http.FORMULARY.getFormularySettingsDefaultAttachmentFile(props.formId, props.field.id, fileName)
    }
    // ------------------------------------------------------------------------------------------
    const getDefaultFieldValueInput = () => {
        const fieldData = deepCopy(props.field)
        fieldData.label_is_hidden = true
        fieldData.field_is_hidden = false
        
        const fieldFormValues = props.field.field_default_field_values.map(defaultFieldValue => ({
            id: null,
            field_id: props.field.id,
            field_name: props.field.name,
            value: defaultFieldValue.value
        }))

        return (
            <Fields 
            userOptions={props.userOptions}
            errors={{}}
            field={fieldData}
            formName={props.formName}
            types={props.types}
            draftToFileReference={draftToFileReference}
            fieldFormValues={fieldFormValues}
            getAttachmentUrl={onGetAttachmentUrl}
            addFieldFormValue={onAddDefaultFieldValue}
            removeFieldFormValue={onRemoveDefaultFieldValue}
            updateFieldFormValue={onUpdateDefaultFieldValue}
            getFieldFormValues={() => {return fieldFormValues}}
            onAddFile={onAddDefaultFileAttachment}
            />
        )
    }
    // ------------------------------------------------------------------------------------------
    const formularyItemsForFieldTypes = () => {
        const fieldType = getFieldTypeName()

        if (['option', 'multi_option'].includes(fieldType)) {
            return (
                <Option
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType === 'number') {
            return (
                <Number
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                formId={props.formId}
                onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                />
            )
        } else if (fieldType === 'period') {
            return (
                <Period
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType === 'date') {
            return (
                <Datetime
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType === 'form') {
            return (
                <Connection
                formName={props.formName}
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                formulariesOptions={props.formulariesOptions}
                />
            )
        }
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (isEditing === false) {
            if (props.field.field_default_field_values.length > 0) {
                setDefaultValueIsOpen(true)
            } else {
                setDefaultValueIsOpen(false)
            }
        }
    }, [isEditing])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.field.field_default_field_values.length > 0) {
            setDefaultValueIsOpen(true)
        } else {
            setDefaultValueIsOpen(false)
        }
    }, [props.field.field_default_field_values])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setFieldTypes(props.types.data.field_type.map(fieldType=> { 
            return { 
                value: fieldType.id, 
                label: { 
                    props: {
                        name: types('pt-br', 'field_type', fieldType.type) 
                    } 
                }
            }
        }))
    }, [props.types.data.field_type])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setInitialFieldType(props.types.data.field_type.filter(fieldType=> fieldType.id === props.field.type).map(fieldType=> { return { value: fieldType.id, label: types('pt-br', 'field_type', fieldType.type) } }))
    }, [props.types.data.field_type, props.field.type])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //#########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //#########################################################################################//
    const renderWeb = () => {
        return (
            <FormulariesEdit.FieldContainer 
            className="field-container" 
            isEditing={isEditing}
            onDragOver={e=>{onDragOver(e)}} 
            onDrop={e=>{onDrop(e)}}
            >
                <Alert 
                alertTitle={strings['pt-br']['formularyEditRemoveFieldAlertTitle']} 
                alertMessage={strings['pt-br']['formularuEditRemoveFieldAlertContent']} 
                show={showAlert} 
                onHide={() => {
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    onRemoveField()
                }}
                onAcceptButtonLabel={strings['pt-br']['formularuEditRemoveFieldAlertAcceptButtonLabel']}
                />
                <div style={{height: '1em', margin: '5px'}}>
                    <Overlay text={strings['pt-br']['formularyEditFieldTrashIconPopover']}>
                        <FormulariesEdit.Icon.FieldIcon size="sm" icon="trash" onClick={e=> {setShowAlert(true)}}/>
                    </Overlay>
                    <Overlay text={(props.field.enabled) ? strings['pt-br']['formularyEditFieldEyeIconPopover'] : strings['pt-br']['formularyEditFieldEyeSlashIconPopover']}>
                        <FormulariesEdit.Icon.FieldIcon size="sm" icon={(props.field.enabled) ? 'eye' : 'eye-slash'} onClick={e=> {onDisableField(e)}}/>
                    </Overlay>
                    <Overlay text={strings['pt-br']['formularyEditFieldMoveIconPopover']}>
                        <div style={{ float:'right' }} draggable="true" onDragStart={e => {onMoveField(e)}} onDrag={e => onDrag(e)} onDragEnd={e => {onDragEnd(e)}}>
                            <FormulariesEdit.Icon.FieldIcon size="sm" icon="arrows-alt"/>
                        </div>
                    </Overlay>
                    <Overlay text={(isEditing) ? strings['pt-br']['formularyEditFieldIsNotEditingIconPopover'] : strings['pt-br']['formularyEditFieldIsEditingIconPopover']}>
                        <FormulariesEdit.Icon.FieldIcon size="sm" icon="pencil-alt" onClick={e=> {setIsEditing(!isEditing)}} isEditing={isEditing}/>
                    </Overlay>
                </div>
                {props.field.enabled ? (
                    <div>
                        {props.field ? (
                            <div>
                                <Fields 
                                userOptions={props.userOptions}
                                errors={{}}
                                formName={props.formName}
                                field={props.field}
                                types={props.types}
                                fieldFormValues={[]}
                                />
                            </div>
                        ) : (
                            <p>
                                {strings['pt-br']['formularyEditFieldNoFieldTypeLabel']}
                            </p>
                        )}
                        {isEditing ? (
                            <FormulariesEdit.FieldFormularyContainer>
                                <FormulariesEdit.FieldFormFieldContainer>
                                    <FormulariesEdit.FieldFormLabel>
                                        {strings['pt-br']['formularyEditFieldNameInputLabel']}
                                    </FormulariesEdit.FieldFormLabel>
                                    <FormulariesEdit.InputField 
                                    autoComplete={'whathever'} 
                                    type="text" 
                                    value={props.field.label_name} 
                                    onChange={e=> {onChangeFieldName(e)}}
                                    />
                                </FormulariesEdit.FieldFormFieldContainer>
                                {props.field.label_name ? (
                                    <div>
                                        <FormulariesEdit.FieldFormFieldContainer>
                                            <FormulariesEdit.FieldFormLabel>
                                                {strings['pt-br']['formularyEditFieldTypeSelectorLabel']}
                                            </FormulariesEdit.FieldFormLabel>
                                            <FormulariesEdit.SelectorContainer isOpen={fieldTypeIsOpen}>
                                                <Select 
                                                    setIsOpen={setFieldTypeIsOpen}
                                                    isOpen={fieldTypeIsOpen}
                                                    onFilter={onFilterFieldType}
                                                    label={FieldOption}
                                                    options={fieldTypes} 
                                                    initialValues={initialFieldType} 
                                                    onChange={onChangeFieldType} 
                                                />
                                            </FormulariesEdit.SelectorContainer>
                                        </FormulariesEdit.FieldFormFieldContainer>
                                        {getFieldTypeName() !== 'form' ? (
                                            <FormulariesEdit.FieldFormFieldContainer>
                                                <FormulariesEdit.FieldFormLabel>
                                                    {strings['pt-br']['formularyEditFieldDefaultValuesLabel']}
                                                </FormulariesEdit.FieldFormLabel>
                                                {defaultValueIsOpen ? (
                                                    <div style={{ margin: '-5px' }}>
                                                        {getDefaultFieldValueInput()}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <small style={{ color: '#6a7074'}}>
                                                            {strings['pt-br']['formularyEditFieldDefaultValuesExplanation']}
                                                        </small>
                                                        <div>
                                                            <FormulariesEdit.FieldFormAddDefaultValueButton onClick={(e) => setDefaultValueIsOpen(true)}>
                                                                {strings['pt-br']['formularyEditFieldDefaultValuesButton']}
                                                            </FormulariesEdit.FieldFormAddDefaultValueButton>
                                                        </div>
                                                    </div>
                                                )}
                                            </FormulariesEdit.FieldFormFieldContainer>
                                        ) : ''}
                                        <FormulariesEdit.FieldFormFieldContainer>
                                            <FormulariesEdit.FieldFormCheckbox checked={props.field.required} onChange={onChangeRequired} text={strings['pt-br']['formularyEditFieldIsRequiredCheckboxLabel']}/>
                                            <FormulariesEdit.FieldFormCheckboxDivider/>
                                            <FormulariesEdit.FieldFormCheckbox checked={props.field.label_is_hidden} onChange={onChangeLabelIsHidden} text={strings['pt-br']['formularyEditFieldLabelIsVisibleCheckboxLabel']}/>
                                            <FormulariesEdit.FieldFormCheckboxDivider/>
                                            <FormulariesEdit.FieldFormCheckbox checked={props.field.field_is_hidden} onChange={onChangeFieldIsHidden} text={strings['pt-br']['formularyEditFieldIsVisibleCheckboxLabel']}/>
                                            <FormulariesEdit.FieldFormCheckboxDivider/>
                                            <FormulariesEdit.FieldFormCheckbox checked={props.field.is_unique} onChange={onChangeIsUnique} text={strings['pt-br']['formularyEditFieldIsUniqueCheckboxLabel']}/>
                                        </FormulariesEdit.FieldFormFieldContainer>
                                        {formularyItemsForFieldTypes()}
                                    </div>
                                ) : ''}
                            </FormulariesEdit.FieldFormularyContainer>
                        ): ''}
                    </div>
                ) : (
                    <p>
                        {strings['pt-br']['formularyEditFieldDisabledLabel']}
                    </p>
                )}
            </FormulariesEdit.FieldContainer>
        )
    }
    //#########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default FormularyFieldEdit