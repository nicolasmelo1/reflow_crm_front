import React, { useState, useEffect } from 'react'
import Number from './Number'
import Period from './Period'
import Option from './Option'
import Connection from './Connection'
import Datetime from './Datetime'
import Fields from '../Fields'
import Select from '../../Utils/Select'
import { FormulariesEdit }  from '../../../styles/Formulary'
import { types, strings } from '../../../utils/constants'
import Overlay from '../../../styles/Overlay'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
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

    const onMoveField = (e) => {
        let fieldContainer = e.currentTarget.closest('.field-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(fieldContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('fieldSectionIndexToMove', JSON.stringify(props.sectionIndex))
        e.dataTransfer.setData('fieldIndexToMove', JSON.stringify(props.fieldIndex))
        props.setFieldIsMoving(true)
    }

    const onRemoveField = (e) => {
        e.preventDefault()
        e.stopPropagation()
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

    const onDisableField = (e) => {
        let fieldData = {...props.field}
        fieldData.enabled = !fieldData.enabled
        props.onUpdateField(props.sectionIndex, props.fieldIndex, fieldData)
    }

    const onChangeFieldName = (e) => {
        e.preventDefault();
        let fieldData = {...props.field}
        fieldData.label_name = e.target.value
        props.onUpdateField(props.sectionIndex, props.fieldIndex, fieldData)
    }

    const onChangeFieldType = (data) => {
        let fieldData = {...props.field}
        fieldData.type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, {...fieldData})
    }
    
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

    const onChangeRequired = () => {
        props.field.required = !props.field.required
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeIsUnique = () => {
        props.field.is_unique = !props.field.is_unique
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeLabelIsHidden = () => {
        props.field.label_is_hidden = !props.field.label_is_hidden
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeFieldIsHidden = () => {
        props.field.field_is_hidden = !props.field.field_is_hidden
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const formularyItemsForFieldTypes = () => {
        const fieldType = props.types.data.field_type.filter(fieldType => fieldType.id === props.field.type)[0]
        if (!fieldType) {
            return ''
        }

        if (['option', 'multi_option'].includes(fieldType.type)) {
            return (
                <Option
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType.type === 'number') {
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
        } else if (fieldType.type === 'period') {
            return (
                <Period
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType.type === 'date') {
            return (
                <Datetime
                field={props.field}
                onUpdateField={props.onUpdateField}
                types={props.types}
                sectionIndex={props.sectionIndex}
                fieldIndex={props.fieldIndex}
                />
            )
        } else if (fieldType.type === 'form') {
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

    useEffect(() => {
        setInitialFieldType(props.types.data.field_type.filter(fieldType=> fieldType.id === props.field.type).map(fieldType=> { return { value: fieldType.id, label: types('pt-br', 'field_type', fieldType.type) } }))
    }, [props.types.data.field_type, props.field.type])

    return (
        <FormulariesEdit.FieldContainer className="field-container" onDragOver={e=>{onDragOver(e)}} onDrop={e=>{onDrop(e)}}>
            <div style={{height: '1em', margin: '5px'}}>
                <Overlay text={strings['pt-br']['formularyEditFieldTrashIconPopover']}>
                    <FormulariesEdit.Icon.FieldIcon size="sm" icon="trash" onClick={e=> {onRemoveField(e)}}/>
                </Overlay>
                <Overlay text={strings['pt-br']['formularyEditFieldEyeIconPopover']}>
                    <FormulariesEdit.Icon.FieldIcon size="sm" icon="eye" onClick={e=> {onDisableField(e)}}/>
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
                                <FormulariesEdit.InputField type="text" value={props.field.label_name} onChange={e=> {onChangeFieldName(e)}}/>
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

export default FormularyFieldEdit