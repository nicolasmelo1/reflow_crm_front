import React, { useState } from 'react'
import { FormularySectionTitle, FormularyMultiFormAddNewButton, FormularySectionContainer } from 'styles/Formulary'
import FormularyField from './FormularyField'

const FomularyMultiSection = (props) => {

    const addMultiSection = (e, section) => {
        e.preventDefault()
        props.multiSections.splice(0, 0, section)
        props.setMultiSections([...props.multiSections])
    }

    return (
        <div>
            <FormularyMultiFormAddNewButton onClick={e=>addMultiSection(e, props.section)}>Adicionar</FormularyMultiFormAddNewButton>
            {(props.multiSections) ? props.multiSections.filter(multiSection=> props.section.id === multiSection.id)
                                                        .map((multiSection, index) => (
                                                            <FormularyField key={index} fields={multiSection.form_fields}/>
                                                        )) : ''}
        </div>
    )
}


const FormularySection = (props) => {
    const [conditionalSections,  setConditionalSections] = useState(props.sections.filter(element => element.conditional_value !== null))
    const [multiSections, setMultiSections] = useState([])
    const sections = props.sections.filter(element => conditionalSections.find(conditional=> conditional.id === element.id) === undefined)
    
    sections.forEach(section=> {
        props.data.depends_on_dynamic_form.push({
            "id": '',
            "form_id": section.id,
            "dynamic_form_value": []
        })
    })
    return (
        <div>
            {sections.map((section, index)=>(
                <FormularySectionContainer key={index}>
                    <FormularySectionTitle>{ section.label_name }</FormularySectionTitle>
                    {(section.form_type === 'multi-form') ? (
                        <FomularyMultiSection multiSections={multiSections} setMultiSections={setMultiSections} section={section}/>
                    ): <FormularyField fields={section.form_fields}/>}
                </FormularySectionContainer>
            ))}
        </div>
    )
}

export default FormularySection