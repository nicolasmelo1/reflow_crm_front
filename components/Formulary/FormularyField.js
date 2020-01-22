import React, { useState } from 'react'
import { FormularyFieldLabel, FormularyFieldContainer } from 'styles/Formulary'
import Field from './Field'

const FormularyField = (props) => {
    return (
        <div>
            {props.fields.map((element, index)=>(
                <FormularyFieldContainer key={index}>
                    <FormularyFieldLabel>{ element.label_name }</FormularyFieldLabel>
                    <Field field={element}></Field>
                </FormularyFieldContainer>
            ))}
        </div>
    )
}

export default FormularyField