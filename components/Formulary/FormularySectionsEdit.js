import React from 'react'
import FormularySectionEdit from './FormularySectionEdit'

const FormularySectionsEdit = (props) => {
    const onUpdateSection = (sectionIndex, newSectionData) => {
        props.data.depends_on_form[sectionIndex] = newSectionData
        props.onUpdateFormularySettings({...props.data})
    }


    const goBackToFormulary = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.setIsEditing()
    }
    
    const sections = (props.data.depends_on_form) ? props.data.depends_on_form : []
    return (
        <div>
            <button onClick={e=>{goBackToFormulary(e)}}>Voltar</button>
            {sections.map((section, index)=> (
                <FormularySectionEdit key={index} onUpdateSection={onUpdateSection} sectionIndex={index} section={section} types={props.types}/>
            ))}
        </div>
    )
}

export default FormularySectionsEdit