import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Row } from 'react-bootstrap'
import Fields from './Fields'
import { Formularies } from '../../styles/Formulary'

 
/**
 * This Components controls each section individually
 */
const FormularySection = (props) => {
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

    const addFieldFile = (fieldName, file) => {
        props.files.push({
            file: file,
            name: fieldName
        })
        props.updateFiles([...props.files])
    }

    const removeFieldFile = (fieldName, fileName) => {
        const indexToRemove = props.files.findIndex(sectionFile => sectionFile.name === fieldName && sectionFile.file.name === fileName)
        props.files.splice(indexToRemove, 1)
        props.updateFiles([...props.files])
    }

    return (
        <Formularies.FieldsContainer isConditional={props.removeSection !== null}>
            {props.removeSection ? (
                <Row>
                    <Col>
                        <Formularies.MultiForm.RemoveButton onClick={e=> {props.removeSection(props.section.id, props.sectionDataIndex)}}>
                            <FontAwesomeIcon icon="trash"/>
                        </Formularies.MultiForm.RemoveButton>
                    </Col>
                </Row>
            ): ''}
            {props.fields.map((element, index)=>(
                <Formularies.FieldContainer key={element.id}>
                    <Fields 
                    errors={props.errors}
                    onChangeFormulary={props.onChangeFormulary}
                    sectionId={props.sectionData.id}
                    field={element}
                    fieldFormValues={getFieldFormValues(element.name)} 
                    getFieldFormValues={getFieldFormValues}
                    addFieldFormValue={addFieldFormValue}
                    removeFieldFormValue={removeFieldFormValue}
                    updateFieldFormValue={updateFieldFormValue}
                    addFieldFile={addFieldFile}
                    types={props.types}
                    removeFieldFile={removeFieldFile}
                    />
                </Formularies.FieldContainer>
            ))}
        </Formularies.FieldsContainer>
    )
}

export default FormularySection