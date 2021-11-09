import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {StreamLanguage} from "@codemirror/stream-parser"
import {shell} from "@codemirror/legacy-modes/mode/shell"
import { strings } from '../../../utils/constants'
import Code from '../Code'
import Styled from './styles'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const CreateRecords = (props) => {
    const [fieldDataByFieldTypes, setFieldDataByFieldTypes] = useState({})
    const [automaticFields, setAutomaticFields] = useState([])

    /**
     * Gets the plural or singular values for the fields explanation the the documentation, this will guarantee that if the
     * fieldType has just one value it will be singular and if it has multiple values it will be plural.
     * 
     * @param {string} text - The text that will come after the singular or plural phrase.
     * @param {Array<object>} arryOfValues - Array of fields.
     * 
     * @returns {string} - The text with singular or plural phrase
     */
    const getPluralOrSingularFieldsText = (text, arryOfValues, ignoreVerb=false) => {
        let fieldNames = arryOfValues.map(field => (`#${field.label_name}#`.replaceAll(' ', '_'))).join(', ')
        fieldNames = fieldNames.replace(/,([^,]*)$/, ` ${strings['pt-br']['apiDocumentationAnd']}` + '$1')
        if (arryOfValues.length > 1) {
            if (ignoreVerb === false) {
                return `${strings['pt-br']['apiDocumentationTheFieldsPlural']} ${fieldNames} ${strings['pt-br']['apiDocumentationPluralVerb']} ${text}`
            } else {
                return `${strings['pt-br']['apiDocumentationTheFieldsPlural']} ${fieldNames} ${text}`
            }
        } else {
            if (ignoreVerb === false) {
                return `${strings['pt-br']['apiDocumentationTheFieldsSingular']} ${fieldNames} ${strings['pt-br']['apiDocumentationSingularVerb']} ${text}`
            } else {
                return `${strings['pt-br']['apiDocumentationTheFieldsSingular']} ${fieldNames} ${text}`
            }
        }
    }

    /**
     * Gets each field from the formulary and then set each fieldType for each field it has this way we can 
     * generate paragraphs dynamically in the documentation.
     */
    const dynamicallyCreateParagraphs = () => {
        const automaticFieldsInFormulary = []
        props.types.data.field_type.forEach(fieldType=> {
            fieldDataByFieldTypes[fieldType.type] = []
        })

        props.sections.forEach(section => {
            section.form_fields.forEach(field => {
                const fieldTypeName = props.getFieldTypeNameByFieldTypeId(parseInt(field.type))
                fieldDataByFieldTypes[fieldTypeName].push(field)
                if (props.isFieldAutomaticGenerated(field)) {
                    automaticFieldsInFormulary.push(field)
                }
            })
        })
        setAutomaticFields([...automaticFieldsInFormulary])
        setFieldDataByFieldTypes({...fieldDataByFieldTypes})
    }

    useEffect(() => {
        dynamicallyCreateParagraphs()
    },[])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <p>
                    {props.getTextFormatted(
                        strings['pt-br']['apiDocumentationCreateRecordsDescription1'].replace('{}', `_${props.urls.createRecord.replace('{companyId}', props.companyId).replace('{pageName}', props.formName)}_`)
                    )}
                </p>
                <p>
                    {props.getTextFormatted(
                        strings['pt-br']['apiDocumentationCreateRecordsDescription2']
                    )}
                </p>
                <p>
                    {strings['pt-br']['apiDocumentationCreateRecordsDescription3']}
                </p>
                {fieldDataByFieldTypes.attachment && fieldDataByFieldTypes.attachment.length > 0 ? (
                    <div>
                        <p>
                            {props.getTextFormatted(
                                getPluralOrSingularFieldsText(
                                    strings['pt-br']['apiDocumentationCreateRecordsAttachments1'], fieldDataByFieldTypes.attachment
                                    )
                            )}
                        </p>
                        <p>
                            {props.getTextFormatted(
                                strings['pt-br']['apiDocumentationCreateRecordsAttachments2'].replace('{}',`_${props.urls.createDraft.replace('{companyId}', props.companyId)}_`)
                            )}
                        </p>
                    </div>
                ) : null}
                {fieldDataByFieldTypes.user && fieldDataByFieldTypes.user.length > 0 ? (
                    <div>
                        <p>
                            {props.getTextFormatted(
                                getPluralOrSingularFieldsText(strings['pt-br']['apiDocumentationCreateRecordsUsers1'], fieldDataByFieldTypes.user
                                )
                            )}
                        </p>
                    </div>
                ) : null}
                {fieldDataByFieldTypes.form && fieldDataByFieldTypes.form.length > 0 ? (
                    <div>
                        <p>
                            {props.getTextFormatted(
                                getPluralOrSingularFieldsText(
                                    strings['pt-br']['apiDocumentationCreateRecordsConnection1'], fieldDataByFieldTypes.form
                                )
                            )}
                        </p>
                    </div>
                ) : null}
                {automaticFields.length > 0 ? (
                    <div>
                        <p>
                            {props.getTextFormatted(
                                getPluralOrSingularFieldsText(
                                    strings['pt-br']['apiDocumentationCreateRecordsAutomaticFields'], automaticFields, true
                                )
                            )}
                        </p>
                    </div>
                ) : null}
                <Styled.APIDocumentationCodeContainer>
                    <Code
                    code={`curl -v -X POST ${props.urls.createRecord.replace('{companyId}', props.companyId).replace('{pageName}', props.formName)} \\ \n` +
                    `-H "Content-Type: application/json" \\ \n` + 
                    `-H "Authorization: Bearer ${props.apiAccessKey}" \\ \n` +
                    `--data '${props.getStructureOfTheApiCall(props.templateId, props.formularyId)}'`}
                    languagePack={StreamLanguage.define(shell)}
                    />
                </Styled.APIDocumentationCodeContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default CreateRecords