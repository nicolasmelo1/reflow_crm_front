import React, { useState } from 'react'
import FormularySectionEdit from './FormularySectionEdit'
import { FormulariesEdit }  from 'styles/Formulary'

const FormularySectionsEdit = (props) => {
    const [isMoving, setIsMoving] = useState(false)
    const [fieldIsMoving, setFieldIsMoving] = useState(false)


    const reorder = () => {
        props.data.depends_on_form = props.data.depends_on_form.map((section, index) => {
            section.form_fields = section.form_fields.map((field, index) => {
                field.order = index+1
                return field
            })
            section.order = index+1
            return section
        })
    }

    const onMoveField = (movedSectionFieldIndex, movedFieldIndex, targetSectionFieldIndex, targetFieldIndex) => {
        const movedElement = {...props.data.depends_on_form[movedSectionFieldIndex].form_fields[movedFieldIndex]}
        let newArrayWithoutMoved = [...props.data.depends_on_form]
        newArrayWithoutMoved[movedSectionFieldIndex].form_fields = [...props.data.depends_on_form[movedSectionFieldIndex].form_fields.filter((_, index) => index !== movedFieldIndex)]
        newArrayWithoutMoved[targetSectionFieldIndex].form_fields.splice(targetFieldIndex, 0, movedElement)
        props.data.depends_on_form = newArrayWithoutMoved
        reorder()
        props.onUpdateFormularySettings({...props.data})
    }

    const onMoveSection = (movedSectionIndex, targetSectionIndex) => {
        let newArrayWithoutMoved = props.data.depends_on_form.filter((_, index) => index !== movedSectionIndex)
        newArrayWithoutMoved.splice(targetSectionIndex, 0, props.data.depends_on_form[movedSectionIndex])
        props.data.depends_on_form = newArrayWithoutMoved
        reorder()
        props.onUpdateFormularySettings({...props.data})
    }

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
            type: (props.types.data.form_type && props.types.data.form_type.filter(formType=> formType.type === 'form').lenght > 0) ? props.types.data.form_type.filter(formType=> formType.type === 'form')[0].id : 2,
            group: null
        }

        props.data.depends_on_form.push(defaultSectionData)
        reorder()
        props.onUpdateFormularySettings({...props.data})
    }

    const onAddNewField = (sectionIndex) => {
        const defaultFieldData = {
            id: null,
            field_option: [],
            form_field_as_option : {},
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
        props.data.depends_on_form[sectionIndex].form_fields.push(defaultFieldData)
        reorder()
        props.onUpdateFormularySettings({...props.data})
    }

    const onUpdateField = (sectionIndex, fieldIndex, newFieldData) => {
        props.data.depends_on_form[sectionIndex].form_fields[fieldIndex] = newFieldData
        props.onUpdateFormularySettings({...props.data})
    }

    const onUpdateSection = (sectionIndex, newSectionData) => {
        props.data.depends_on_form[sectionIndex] = newSectionData
        props.onUpdateFormularySettings({...props.data})
    }

    const goBackToFormulary = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.setIsEditing()
    }
    
    const sections = (props.data && props.data.depends_on_form) ? props.data.depends_on_form : []
    let fieldOptions = []
    sections.forEach(section => {
        section.form_fields.forEach(field => {
            if (field && field.id) {
                fieldOptions.push(field)
            }
        })
    })

    return (
        <div>
            <button onClick={e=>{goBackToFormulary(e)}}>Voltar</button>
            {sections.map((section, index)=> (
                <FormularySectionEdit key={index} 
                onUpdateSection={onUpdateSection} 
                onUpdateField={onUpdateField}
                sectionIndex={index}
                section={section} 
                fieldIsMoving={fieldIsMoving}
                setFieldIsMoving={setFieldIsMoving}
                isMoving={isMoving}
                onMoveSection={onMoveSection}
                onMoveField={onMoveField}
                setIsMoving={setIsMoving}
                onAddNewField={onAddNewField}
                types={props.types} 
                fieldOptions={fieldOptions}
                formulariesOptions={props.formulariesOptions}
                />
            ))}
            <FormulariesEdit.AddNewSectionButton text="Adicionar nova seção" onClick={e=>{onAddNewSection()}} />

        </div>
    )
}

export default FormularySectionsEdit