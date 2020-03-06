import React, { useState } from 'react'
import Fields from 'components/Formulary/Fields'
import { FormulariesEdit }  from 'styles/Formulary'
import { types, strings } from 'utils/constants'
import Number from './Number'
import Option from './Option'
import Connection from './Connection'
import Datetime from './Datetime'
import Select from 'components/Utils/Select'


const FieldOption = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}


const FormularyFieldEdit = (props) => {
    const [isEditing, setIsEditing] = useState(false)

    const initialFieldType = (props.field.type && props.types.data.field_type) ? props.types.data.field_type.filter(fieldType=> fieldType.id === props.field.type).map(fieldType=> { return { value: fieldType.id, label: types('pt-br', 'field_type', fieldType.type) } }) : []
    const fieldTypes = (props.types && props.types.data && props.types.data.field_type) ? props.types.data.field_type.map(fieldType=> 
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
    
    const onMoveField = (e) => {
        let fieldContainer = e.currentTarget.closest('.field-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(fieldContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('fieldSectionIndexToMove', JSON.stringify(props.sectionIndex))
        e.dataTransfer.setData('fieldIndexToMove', JSON.stringify(props.fieldIndex))
        props.setFieldIsMoving(true)
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
        props.field.enabled = !props.field.enabled
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeFieldName = (e) => {
        e.preventDefault();
        props.field.label_name = e.target.value
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeFieldType = (data) => {
        props.field.type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
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

        if (['option', 'multi-option'].includes(fieldType.type)) {
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

    return (
        <div className="field-container" style={{borderTop: '2px solid #bfbfbf', padding: '5px'}} onDragOver={e=>{onDragOver(e)}} onDrop={e=>{onDrop(e)}}>
            <div style={{height: '1em', margin: '5px'}}>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="trash"/>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="eye" onClick={e=> {onDisableField(e)}}/>
                <div draggable="true" onDragStart={e => {onMoveField(e)}} onDrag={e => onDrag(e)} onDragEnd={e => {onDragEnd(e)}}>
                    <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="arrows-alt"/>
                </div>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="pencil-alt" onClick={e=> {setIsEditing(!isEditing)}}/>
            </div>
            {props.field.enabled ? (
                <div>
                    {isEditing ? (
                        <div style={{ width: '100%', backgroundColor: '#bfbfbf', padding: '5px 10px'}}>
                            <FormulariesEdit.FieldFormFieldContainer>
                                <FormulariesEdit.FieldFormLabel>
                                    {strings['pt-br']['formularyEditFieldTypeSelectorLabel']}
                                </FormulariesEdit.FieldFormLabel>
                                <FormulariesEdit.SelectorContainer>
                                    <Select 
                                        onFilter={onFilterFieldType}
                                        label={FieldOption}
                                        options={fieldTypes} 
                                        initialValues={initialFieldType} 
                                        onChange={onChangeFieldType} 
                                    />
                                </FormulariesEdit.SelectorContainer>
                            </FormulariesEdit.FieldFormFieldContainer>
                            <FormulariesEdit.FieldFormFieldContainer>
                                <FormulariesEdit.FieldFormLabel>
                                    {strings['pt-br']['formularyEditFieldNameInputLabel']}
                                </FormulariesEdit.FieldFormLabel>
                                <FormulariesEdit.InputField
                                type="text" 
                                value={props.field.label_name} 
                                onChange={e=> {onChangeFieldName(e)}}
                                />
                            </FormulariesEdit.FieldFormFieldContainer>
                            <FormulariesEdit.FieldFormFieldContainer>
                                <div style={{ backgroundColor:'#fff',  padding: '10px 5px'}}>
                                    <FormulariesEdit.FieldFormCheckboxLabel>
                                        <input type="checkbox" checked={props.field.required} onChange={e => {onChangeRequired()}}/>&nbsp;{strings['pt-br']['formularyEditFieldIsRequiredCheckboxLabel']}
                                    </FormulariesEdit.FieldFormCheckboxLabel>
                                </div>
                                <div style={{ backgroundColor:'#fff', padding: '10px 5px', borderTop: '1px solid #bfbfbf'}}>
                                    <FormulariesEdit.FieldFormCheckboxLabel>
                                        <input type="checkbox" checked={props.field.label_is_hidden} onChange={e => {onChangeLabelIsHidden()}}/>&nbsp;{strings['pt-br']['formularyEditFieldLabelIsVisibleCheckboxLabel']}
                                    </FormulariesEdit.FieldFormCheckboxLabel>
                                </div>
                                <div style={{ backgroundColor:'#fff', padding: '10px 5px', borderTop: '1px solid #bfbfbf'}}>
                                    <FormulariesEdit.FieldFormCheckboxLabel>
                                        <input type="checkbox" checked={props.field.field_is_hidden} onChange={e => {onChangeFieldIsHidden()}}/>&nbsp;{strings['pt-br']['formularyEditFieldIsVisibleCheckboxLabel']}
                                    </FormulariesEdit.FieldFormCheckboxLabel>
                                </div>
                                <div style={{ backgroundColor:'#fff', padding: '10px 5px', borderTop: '1px solid #bfbfbf'}}>
                                    <FormulariesEdit.FieldFormCheckboxLabel>
                                        <input type="checkbox" checked={props.field.is_unique} onChange={e => {onChangeIsUnique()}}/>&nbsp;{strings['pt-br']['formularyEditFieldIsUniqueCheckboxLabel']}
                                    </FormulariesEdit.FieldFormCheckboxLabel>
                                </div>
                            </FormulariesEdit.FieldFormFieldContainer>
                            {formularyItemsForFieldTypes()}
                        </div>
                    ): (
                        <Fields 
                        errors={{}}
                        field={props.field}
                        types={props.types}
                        fieldFormValues={[]}
                        />
                    )}
                </div>
            ) : (
                <p>
                    O campo está desativado.
                </p>
            )}
        </div>
    )
}

export default FormularyFieldEdit