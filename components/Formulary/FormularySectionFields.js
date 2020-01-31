import React, { useState, useEffect } from 'react'
import { FormularyFieldContainer } from 'styles/Formulary'
import Field from './Field'

/**
 * 
 * @param {function} onUpdateMultiSection - (opitional) - if not Set, onUPDATEMULTISECTION must be defined
 */
const FormularySectionFields = (props) => {
    //const updateSection = (props.onUpdateMultiSection)
    const sectionFormValues = props.sectionData
    // files UPLOADED only
    const [sectionFiles, setSectionFiles] = useState([])

    // used by each field, to not become a tedius and repetitive job doing this on each field, we only pass the function
    const getFieldFormValues = (field_name) => {
        return props.sectionData.dynamic_form_value.filter(sectionFormValue=> sectionFormValue.field_name === field_name)
    }

    const addFieldFormValue = (field_name, value) => {
        props.sectionData.dynamic_form_value.push({
            'id': null,
            'value': value,
            'field_name': field_name
        })
        props.updateSection(props.sectionData, props.section.id, props.sectionDataIndex)
    }

    const removeFieldFormValue = (field_name, value) => {
        const indexToRemove = props.sectionData.dynamic_form_value.findIndex(sectionFormValue=> sectionFormValue.field_name === field_name && sectionFormValue.value === value)
        props.sectionData.dynamic_form_value.splice(indexToRemove, 1)
        props.updateSection(props.sectionData, props.section.id, props.sectionDataIndex)
    }

    const updateFieldFormValue = (field_name, old_value, new_value) => {
        const indexToUpdate = props.sectionData.dynamic_form_value.findIndex(sectionFormValue=> sectionFormValue.field_name === field_name && sectionFormValue.value === old_value)
        props.sectionData.dynamic_form_value[indexToUpdate].value = new_value
        props.updateSection(props.sectionData, props.section.id, props.sectionDataIndex)
    }

    const addFieldFile = (field_name, file) => {
        sectionFiles.push({
            'file': file,
            'field_name': field_name
        })
        setSectionFiles([...sectionFiles])
    }

    const removeFieldFile = (field_name, file_name) => {
        const indexToRemove = sectionFiles.findIndex(sectionFile => sectionFile.field_name === field_name && sectionFile.name === file_name)
        sectionFiles.splice(indexToRemove, 1)
        setSectionFiles([...sectionFormValues])
    }

    return (
        <div>
            {props.removeSection ? (<button onClick={e=> {props.removeSection(props.section.id, props.sectionDataIndex)}}>Remover</button>): ''}
            {props.fields.map((element, index)=>(
                <FormularyFieldContainer key={element.id}>
                    <Field 
                    field={element}
                    fieldFormValues={getFieldFormValues(element.name)} 
                    getFieldFormValues={getFieldFormValues}
                    addFieldFormValue={addFieldFormValue}
                    removeFieldFormValue={removeFieldFormValue}
                    updateFieldFormValue={updateFieldFormValue}
                    addFieldFile={addFieldFile}
                    removeFieldFile={removeFieldFile}
                    />
                </FormularyFieldContainer>
            ))}
        </div>
    )
}

export default FormularySectionFields