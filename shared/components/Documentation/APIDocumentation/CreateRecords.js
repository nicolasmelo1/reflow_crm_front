import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { strings } from '../../../utils/constants'

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
        let fieldNames = arryOfValues.map(field => field.label_name).join(', ')
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
                    {strings['pt-br']['apiDocumentationCreateRecordsDescription1']}
                </p>
                <p>
                    {strings['pt-br']['apiDocumentationCreateRecordsDescription2']}
                </p>
                <p>
                    {strings['pt-br']['apiDocumentationCreateRecordsDescription3']}
                </p>
                {fieldDataByFieldTypes.attachment && fieldDataByFieldTypes.attachment.length > 0 ? (
                    <div>
                        <p>
                            {getPluralOrSingularFieldsText(strings['pt-br']['apiDocumentationCreateRecordsAttachments1'], fieldDataByFieldTypes.attachment)}
                        </p>
                        <p>
                            {strings['pt-br']['apiDocumentationCreateRecordsAttachments2']}
                        </p>
                    </div>
                ) : null}
                {fieldDataByFieldTypes.user && fieldDataByFieldTypes.user.length > 0 ? (
                    <div>
                        <p>
                            {getPluralOrSingularFieldsText(strings['pt-br']['apiDocumentationCreateRecordsUsers1'], fieldDataByFieldTypes.user)}
                        </p>
                    </div>
                ) : null}
                {fieldDataByFieldTypes.form && fieldDataByFieldTypes.form.length > 0 ? (
                    <div>
                        <p>
                            {getPluralOrSingularFieldsText(strings['pt-br']['apiDocumentationCreateRecordsConnection1'], fieldDataByFieldTypes.form)}
                        </p>
                    </div>
                ) : null}
                {automaticFields.length > 0 ? (
                    <div>
                        <p>
                            {getPluralOrSingularFieldsText(strings['pt-br']['apiDocumentationCreateRecordsAutomaticFields'], automaticFields, true)}
                        </p>
                    </div>
                ) : null}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default CreateRecords