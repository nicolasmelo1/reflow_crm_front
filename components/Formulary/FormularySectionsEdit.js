import React from 'react'
import FormularySectionEdit from './FormularySectionEdit'

const FormularySectionsEdit = (props) => {

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
            if (field.id) {
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
                types={props.types} 
                fieldOptions={fieldOptions}
                formulariesOptions={props.formulariesOptions}
                />
            ))}
        </div>
    )
}

export default FormularySectionsEdit