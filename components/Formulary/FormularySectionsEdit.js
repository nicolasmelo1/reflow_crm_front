import React, { useState } from 'react'
import FormularySectionEdit from './FormularySectionEdit'

const FormularySectionsEdit = (props) => {
    const [isMoving, setIsMoving] = useState(false)
    const [fieldIsMoving, setFieldIsMoving] = useState(false)

    const onMoveField = (movedSectionFieldIndex, movedFieldIndex, targetSectionFieldIndex, targetFieldIndex) => {
        const movedElement = {...props.data.depends_on_form[movedSectionFieldIndex].form_fields[movedFieldIndex]}
        let newArrayWithoutMoved = [...props.data.depends_on_form]
        newArrayWithoutMoved[movedSectionFieldIndex].form_fields = [...props.data.depends_on_form[movedSectionFieldIndex].form_fields.filter((_, index) => index !== movedFieldIndex)]
        newArrayWithoutMoved[targetSectionFieldIndex].form_fields.splice(targetFieldIndex, 0, movedElement)
        newArrayWithoutMoved = newArrayWithoutMoved.map(section => {
            section.form_fields = section.form_fields.map((field, index) => {
                field.order = index+1
                return field
            })
            return section
        })
        props.data.depends_on_form = newArrayWithoutMoved
        props.onUpdateFormularySettings({...props.data})
    }

    const onMoveSection = (movedSectionIndex, targetSectionIndex) => {
        let newArrayWithoutMoved = props.data.depends_on_form.filter((_, index) => index !== movedSectionIndex)
        newArrayWithoutMoved.splice(targetSectionIndex, 0, props.data.depends_on_form[movedSectionIndex])
        newArrayWithoutMoved = newArrayWithoutMoved.map((section, index) => {
            section.order = index+1
            return section
        })
        props.data.depends_on_form = newArrayWithoutMoved
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
                types={props.types} 
                fieldOptions={fieldOptions}
                formulariesOptions={props.formulariesOptions}
                />
            ))}
        </div>
    )
}

export default FormularySectionsEdit