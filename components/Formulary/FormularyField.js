import React, { useState } from 'react'
import { FormularyFieldLabel, FormularyFieldContainer } from 'styles/Formulary'
import Field from './Field'

const FormularyField = (props) => {
    const [sectionFormValues, setSectionFormValues] = useState([])

    // used by each field, to not become a tedius and repetitive job doing this on each field, we only pass the function
    const getFieldFormValues = (field_name) => {
        return sectionFormValues.filter(sectionFormValue=> sectionFormValue.field_name === field_name)
    }

    const addFieldFormValue = (field_name, value) => {
        sectionFormValues.push({
            'id': null,
            'value': value,
            'field_name': field_name
        })
        setSectionFormValues([...sectionFormValues])
    }

    const removeFieldFormValue = (field_name, value) => {
        const indexToRemove = sectionFormValues.findIndex(sectionFormValue=> sectionFormValue.field_name === field_name && sectionFormValue.value === value)
        sectionFormValues.splice(indexToRemove, 1)
        setSectionFormValues([...sectionFormValues])
    }

    const updateFieldFormValue = (field_name, old_value, new_value) => {
        const indexToUpdate = sectionFormValues.findIndex(sectionFormValue=> sectionFormValue.field_name === field_name && sectionFormValue.value === old_value)
        sectionFormValues[indexToUpdate].value = new_value
        setSectionFormValues([...sectionFormValues])
    }

    return (
        <div>
            {props.fields.map((element, index)=>(
                <FormularyFieldContainer key={index}>
                    <FormularyFieldLabel>{ element.label_name }</FormularyFieldLabel>
                    <Field 
                    field={element}
                    getFieldFormValues={getFieldFormValues} 
                    addFieldFormValue={addFieldFormValue}
                    removeFieldFormValue={removeFieldFormValue}
                    updateFieldFormValue={updateFieldFormValue}
                    setSectionFormValues={setSectionFormValues}/>
                </FormularyFieldContainer>
            ))}
        </div>
    )
}

export default FormularyField