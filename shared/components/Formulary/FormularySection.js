import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { View } from 'react-native'
import Fields from './Fields'
import { Formularies } from '../../styles/Formulary'
import dynamicImport from '../../utils/dynamicImport'

const Col = dynamicImport('react-bootstrap', 'Col')
const Row = dynamicImport('react-bootstrap', 'Row')

/**
 * This Components controls each section individually
 */
const FormularySection = (props) => {
    // used by each field, to not become a tedius and repetitive job doing this on each field, we only pass the function
    const getFieldFormValues = (field_name) => {
        return props.sectionData.dynamic_form_value.filter(sectionFormValue=> sectionFormValue.field_name === field_name)
    }

    const addFieldFormValue = (field_name, field_id, value) => {
        props.sectionData.dynamic_form_value.push({
            'id': null,
            'value': value,
            'field_id': field_id,
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

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Formularies.FieldsContainer isConditional={props.removeSection !== null}>
                {props.removeSection ? (
                    <div style={{ display: 'flex', flexDirection: 'row-reverse'}}>
                        <Formularies.MultiForm.RemoveButton 
                        onClick={e=> {props.removeSection(props.section.id, props.sectionDataIndex)}}
                        >
                            <FontAwesomeIcon icon="trash"/>
                        </Formularies.MultiForm.RemoveButton>
                    </div>
                ): ''}
                {props.fields.map((element, index)=>(
                    <Formularies.FieldContainer key={element.id}>
                        <Fields 
                        formName={props.formName}
                        errors={props.errors}
                        onChangeFormulary={props.onChangeFormulary}
                        sectionId={props.sectionData.id}
                        field={element}
                        fieldFormValues={getFieldFormValues(element.name)} 
                        getFieldFormValues={getFieldFormValues}
                        addFieldFormValue={addFieldFormValue}
                        removeFieldFormValue={removeFieldFormValue}
                        updateFieldFormValue={updateFieldFormValue}
                        draftToFileReference={props.draftToFileReference}
                        onAddFile={props.onAddFile}
                        type={props.type}
                        types={props.types}
                        isSectionConditional={props.isSectionConditional}
                        />
                    </Formularies.FieldContainer>
                ))}
            </Formularies.FieldsContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySection