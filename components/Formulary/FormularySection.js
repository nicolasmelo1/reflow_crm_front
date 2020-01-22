import React, { useState } from 'react'
import { FormularySectionTitle, FormularyMultiFormAddNewButton, FormularySectionContainer } from 'styles/Formulary'
import FormularyField from './FormularyField'


const FormularySection = (props) => {
    const [conditionalSections,  setConditionalSections] = useState(props.sections.filter(element => element.conditional_value !== null))
    return (
        <div>
            {props.sections.filter(element => conditionalSections.find(conditional=> conditional.id === element.id) === undefined).map((element, index)=>(
                <FormularySectionContainer key={index}>
                    <FormularySectionTitle>{ element.label_name }</FormularySectionTitle>
                    {(element.form_type === 'multi-form') ? <FormularyMultiFormAddNewButton>Adicionar</FormularyMultiFormAddNewButton> : ''}
                    <FormularyField fields={element.form_fields}/>
                </FormularySectionContainer>
            ))}
        </div>
    )
}

export default FormularySection