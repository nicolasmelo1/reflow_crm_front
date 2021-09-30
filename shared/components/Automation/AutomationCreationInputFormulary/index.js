import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import generateUUID from '../../../utils/generateUUID'
import { Select } from '../../Utils'
import Field from './Fields'
import Styled from '../styles'


const Section = (props) => {

}


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const AutomationCreationInputFormulary = (props) => {
    const sourceRef = React.useRef()
    const sectionIdByTypeNameRef = React.useRef({})
    const fieldIdByTypeNameRef = React.useRef({})
    const [inputFormulary, setInputFormulary] = useState({
        formulary_sections: []
    })
    const [inputFormularyData, setInputFormularyData] = useState({
        formulary_record_sections: []
    })

    /**
     * Retrieves the field type name by it's fieldTypeId, 
     * Since this can be called many times we cache this value while the component exist
     * with the FieldId. What we do is simple, when we retrieve the `fieldTypeName` we will
     * cache this value in an object where the fieldId will be the key, and the type name will
     * be the value. So if we call the function again passing the same fieldId we retrieve directly
     * from the object and does not need to evaluate again.
     * 
     * @param {BigInt} fieldId - The id of the field, this is used for caching.
     * @param {BigInt} fieldTypeId - The id of the field_type you want to retrieve the name of
     * 
     * @returns {String} - Returns a string with the name of the field_type or an empty string.
     */
    const getFieldTypeNameById = (fieldId, fieldTypeId) => {
        if (fieldId in fieldIdByTypeNameRef.current) {
            return fieldIdByTypeNameRef.current[fieldId]
        } else {
            if (props.types?.automation?.input_field_type) {
                for (let i=0; i<props.types.automation.input_field_type.length; i++) {
                    const inputFieldTypeId = props.types.automation.input_field_type[i].id
                    if (inputFieldTypeId === fieldTypeId) {
                        fieldIdByTypeNameRef.current[fieldId] = props.types.automation.input_field_type[i].name
                        return fieldIdByTypeNameRef.current[fieldId]
                    }
                }
            } 
            return ''
        }
    }

    /**
     * Wasting Everyone's Time pattern by repeating the same code of `getFieldTypeNameById` function but for sections.
     * 
     * I don't know if the desired behaviour might change in the future so it's better to repeat it twice here.
     * 
     * @param {BigInt} sectionId - The id of the section, this is used for caching.
     * @param {BigInt} sectionTypeId - The id of the section_type you want to retrieve the name of
     * 
     * @returns {String} - Returns a string with the name of the secton_type or an empty string.
     */
    const getSectionTypeNameById = (sectionId, sectionTypeId) => {
        if (sectionId in sectionIdByTypeNameRef.current) {
            return sectionIdByTypeNameRef.current[sectionId]
        } else {
            if (props.types?.automation?.input_section_type) {
                for (let i=0; i<props.types.automation.input_section_type.length; i++) {
                    const inputSectionTypeId = props.types.automation.input_section_type[i].id
                    if (inputSectionTypeId === sectionTypeId) {
                        sectionIdByTypeNameRef.current[sectionId] = props.types.automation.input_section_type[i].name
                        return sectionIdByTypeNameRef.current[sectionId]
                    }
                }
            } 
            return ''
        }
    }

    /**
     * Checks if a record of the section was created. We start the formulary with an empty `inputFormularyData`
     * as you see, we will fill it as we start filling the formulary fields.
     * 
     * @param {BigInt} sectionId - The id of the section to retrieve the records for, 
     * this is the actual section id and not the record of the section
     * 
     * @returns {Array<Object>} - Returns an array of objects of all of the records from a specific 
     */
    const sectionRecordsOfSectionId = (sectionId) => {
        return inputFormularyData.formulary_record_sections.filter(sectionRecord => sectionRecord.section === sectionId)
    }

    const createNewMultiSectionRecord = (sectionId) => {
        inputFormularyData.formulary_record_sections.push({
            uuid: generateUUID(),
            section: sectionId,
            section_record_fields: []
        })
        setInputFormularyData({...inputFormularyData})
    }

    /**
     * Retrieves the records of a particular field, a record is the value the user had inputed in a field
     * for example, if we have a formulary with the following fields:
     * >>> Select the formulary
     * >>> Select the field
     * 
     * For the first field, when the user fills the input we will create this data in an array. Since the data is dynamic
     * we actually doesn't have much control on how this filled data will behave, what will come first and what will come
     * last in the array, because of that we need this helper function to retrieve the records of his filled data.
     * 
     * If he filled the first field with `Prospecção de Clientes`
     * the data we retrive for him will be like:
     * {
     *      sectionRecordUUID: UUID of the section record,
     *      fieldValue: {
     *          uuid: the uuid of the field record value,
     *          field: The id of the field.
     *          value: The actual value of the field
     *      }
     * }
     * 
     * 
     * @param {BigInt} fieldId - The id of the field to retrieve the values to, this is the actual field value, not the recordField
     * @param {BigInt} sectionId - The id of the section to retrieve the values to, this is the section value.
     * 
     * @returns {Object} - The field object holding the value of the field
     */
    const getRecordsOfField = (fieldId, sectionId, sectionRecordUUID=null) => {
        const recordSectionData = inputFormularyData.formulary_record_sections.filter(sectionRecord => 
            (sectionRecordUUID === null && sectionRecord.section === sectionId) || 
            (sectionRecord.section === sectionId && sectionRecord.uuid === sectionRecordUUID) 
        )
        if (recordSectionData.length > 0) {
            sectionRecordUUID = recordSectionData[0].uuid
            const recordFieldData = recordSectionData[0].section_record_fields.filter(fieldRecord => fieldRecord.field === fieldId)
            
            if (recordFieldData.length > 0) {
                return {
                    sectionRecordUUID: sectionRecordUUID,
                    fieldValue: recordFieldData[0]
                }
            }
        }
        return {
            sectionRecordUUID: sectionRecordUUID,
            fieldValue: {}
        }
    }

    
    const setFieldValue = (value, fieldId, sectionId, fieldRecordUUID=null, sectionRecordUUID=null) => {
        // We are modifying a value
        if (fieldRecordUUID && sectionRecordUUID) {
            const indexOfSectionRecord = inputFormularyData.formulary_record_sections.findIndex(sectionRecord => sectionRecord.uuid === sectionRecordUUID)
            const recordSectionData = inputFormularyData.formulary_record_sections[indexOfSectionRecord]

            if (indexOfSectionRecord !== -1 && recordSectionData) {
                const indexOfFieldRecord = recordSectionData.section_record_fields.findIndex(fieldRecord => fieldRecord.uuid === fieldRecordUUID)
                const recordFieldData = recordSectionData.section_record_fields[indexOfFieldRecord]
                
                if (indexOfFieldRecord !== -1 && recordFieldData) {
                    if (value === null) {
                        recordSectionData.section_record_fields.splice(indexOfFieldRecord, 1)
                    } else {
                        recordFieldData.value = value
                    }
                }
            }
        } else {
            const fieldData = {
                uuid: generateUUID(),
                field: fieldId,
                value: value
            }
            if (sectionRecordUUID) {
                const indexOfSectionRecord = inputFormularyData.formulary_record_sections.findIndex(sectionRecord => sectionRecord.uuid === sectionRecordUUID)
                const recordData = inputFormularyData.formulary_record_sections[indexOfSectionRecord]
                if (indexOfSectionRecord !== -1 && recordData) {
                    recordData.section_record_fields.push(fieldData)
                }
            } else {
                const sectionData = {
                    uuid: generateUUID(),
                    section: sectionId,
                    section_record_fields: [fieldData]
                }
                inputFormularyData.formulary_record_sections.push(sectionData)
            }
        }
        console.log(inputFormularyData)
        setInputFormularyData({...inputFormularyData})
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        if (props.triggerOrActionData.input_formulary) {
            props.onGetInputFormulary(sourceRef.current, props.triggerOrActionData.input_formulary).then(response => {
                if (response.status === 200) {
                    setInputFormulary(response.data.data)
                }
            })
        }
        
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.AutomationCreationInputFormularyContainer>
                <Styled.AutomationCreationInputFormularyHeader
                appColor={props.appData.app_color}
                >
                    <Styled.AutomationCreationInputFormularyHeaderAppName>
                        {props.appData.name}
                    </Styled.AutomationCreationInputFormularyHeaderAppName>
                    <Styled.AutomationCreationInputFormularyHeaderTriggerOrActionName>
                        {props.triggerOrActionData.name}
                    </Styled.AutomationCreationInputFormularyHeaderTriggerOrActionName>
                    <Styled.AutomationCreationInputFormularyHeaderDescription>
                        {props.triggerOrActionData.description}
                    </Styled.AutomationCreationInputFormularyHeaderDescription>
                </Styled.AutomationCreationInputFormularyHeader>
                <Styled.AutomationCreationInputFormularyFormContainer>
                    {inputFormulary.formulary_sections.map(formularySection => {
                        if (getSectionTypeNameById(formularySection.id, formularySection.section_type) === 'unique') {
                            return (
                                <div
                                key={formularySection.id}
                                >
                                    <h2>
                                        {formularySection.name}
                                    </h2>
                                    {formularySection.section_fields.map(sectionField => (
                                        <div key={sectionField.id}>
                                            <Field
                                            section={formularySection}
                                            field={sectionField}
                                            fieldTypeName={getFieldTypeNameById(sectionField.id, sectionField.field_type)}
                                            setFieldValue={setFieldValue}
                                            records={getRecordsOfField(sectionField.id, formularySection.id)}
                                            /> 
                                        </div>
                                    ))}
                                </div>
                            )
                        } else {
                            return (
                                <div key={formularySection.id}>
                                    <h2>
                                        {formularySection.name}
                                    </h2>
                                    <button 
                                    onClick={(e) => createNewMultiSectionRecord(formularySection.id)}
                                    >
                                        {'Adicionar'}
                                    </button>
                                    {sectionRecordsOfSectionId(formularySection.id).map(sectionRecord => (
                                        <div key={sectionRecord.uuid}>
                                            {formularySection.section_fields.map(sectionField => (
                                                <div key={sectionField.id}>
                                                    <Field
                                                    section={formularySection}
                                                    field={sectionField}
                                                    fieldTypeName={getFieldTypeNameById(sectionField.id, sectionField.field_type)}
                                                    setFieldValue={setFieldValue}
                                                    records={getRecordsOfField(sectionField.id, formularySection.id, sectionRecord.uuid)}
                                                    /> 
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    })}
                </Styled.AutomationCreationInputFormularyFormContainer>
            </Styled.AutomationCreationInputFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default AutomationCreationInputFormulary