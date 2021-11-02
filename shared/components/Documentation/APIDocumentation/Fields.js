import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { javascript } from "@codemirror/lang-javascript"
import { types, strings } from '../../../utils/constants'
import Code from '../Code'
import agent from '../../../utils/agent'
import Styled from './styles'


/**
 * This will handle the `sectionAndFields` part of the API documentation.
 * It will display all of the fields with a description and examples so it's easy to follow along.
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Field = (props) => {
    const sourceRef = React.useRef()
    const isMountedRef = React.useRef()
    const [exampleCode, setExampleCode] = useState('')
    // ------------------------------------------------------------------------------------------
    const dateFormatTypeNameByDateFormatTypeId = (dateFormatTypeId) => {
        if (props?.types?.data?.field_date_format_type) {
            for (let i=0; i<props.types.data.field_date_format_type.length; i++) {
                if (props.types.data.field_date_format_type[i].id === dateFormatTypeId) {
                    return props.types.data.field_date_format_type[i].type
                }
            }
        }
        return ''
    }
    // ------------------------------------------------------------------------------------------
    const numberFormatTypeNameByNumberFormatTypeId = (numberFormatTypeId) => {
        if (props?.types?.data?.field_number_format_type) {
            for (let i=0; i<props.types.data.field_number_format_type.length; i++) {
                if (props.types.data.field_number_format_type[i].id === numberFormatTypeId) {
                    return props.types.data.field_number_format_type[i].type
                }
            }
        }
        return ''
    }
    // ------------------------------------------------------------------------------------------
    function getDescription() {
        if (['text', 'email'].includes(props.fieldTypeName)) {
            return {
                type: 'string',
                description: 'Um simples texto de uma linha.',
                isAutomaticGenerated: false
            }
        } else if (props.fieldTypeName === 'date') {
            let defaultDescription = 'Uma data como texto seguindo o padrão ISO-8601.'
            let defaultIsAutomaticGenerated = false

            const dateTypeName = dateFormatTypeNameByDateFormatTypeId(props.field.date_configuration_date_format_type)
            if (props.field.date_configuration_auto_create === true || props.field.date_configuration_auto_update === true) {
                defaultIsAutomaticGenerated = true
            }
            if (dateTypeName === 'date') {
                defaultDescription = defaultDescription + ` Exemplo: "${(new Date()).toISOString().split('T')[0]}"`
            } else {
                defaultDescription = defaultDescription + ` Exemplo: "${(new Date()).toISOString()}"`
            }

            return {
                type: 'string (ISO-8601)',
                description: defaultDescription,
                isAutomaticGenerated: defaultIsAutomaticGenerated
            }
        } else if (props.fieldTypeName === 'number') {
            let defaultDescription = 'Um número inteiro. Sem casas decimais.'
            const numberTypeName = numberFormatTypeNameByNumberFormatTypeId(props.field.number_configuration_number_format_type)
            if (numberTypeName === 'number' || numberTypeName === 'currency') {
                defaultDescription = 'Um numero que pode ser tanto um número inteiro quanto um número com decimais.'
            } else if (numberTypeName === 'percentage') {
                defaultDescription = 'Apenas números menores que 1. Exemplo 0.52'
            }
            return {
                type: 'number',
                description: defaultDescription,
                isAutomaticGenerated: false
            }
        } else if (props.fieldTypeName === 'form') {
            return {
                type: 'number',
                description: 'O valor desse campo é o id de outro registro ao qual o campo está conectado. Verifique o id do registro ao qual você deseja conectar e passe esse Id aqui.',
                isAutomaticGenerated: false
            }
        } else if (props.fieldTypeName === 'user') {
            return {
                type: 'number ou string',
                description: 'Esse é o id de um usuário, os possíveis ids que você pode usar estão definido nos exemplos abaixo. Você pode mandar tanto o id quanto um e-mail.',
                isAutomaticGenerated: false
            }
        } else if (['option', 'multi_option'].includes(props.fieldTypeName)) {
            return {
                type: 'string',
                description: 'Passe uma string com uma das opções apresentadas abaixo.',
                isAutomaticGenerated: false
            }
        } else if (['id', 'formula'].includes(props.fieldTypeName)) {
            return {
                type: 'string ou number',
                description: 'O valor desse campo é gerado automaticamente.',
                isAutomaticGenerated: true
            }
        } else if (props.fieldTypeName === 'attachment') {
            return {
                type: 'string',
                description: 'Para subir um anexo você precisa enviar um request POST para a url `url/upload_draft` e a string de resposta gerada por essa API deve ser passada como valor.',
                isAutomaticGenerated: false
            }
        }
        return {
            type: 'string ou number',
            description: '',
            isAutomaticGenerated: false
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Updates the example code depending on the value type, for fields like `options`, `multi_options` and others.
     * 
     * It's nice that this actually gives us real values to use in those cases. It gives us the last inputed values
     * as example.
     * Since this is async, we need to update the state in order to rerender the component with the examples.
     */
    async function exampleCodeByFieldTypeName() {
        if (['text', 'email'].includes(props.fieldTypeName)) {
            if (props.lastValues.length > 0) {
                setExampleCode(`${props.lastValues.map(lastValue=> `"${lastValue}"`).join('\n')}`)
            } else {
                setExampleCode(`"foo"\n"bar"`)
            }
        } else if (props.fieldTypeName === 'attachment') {
            setExampleCode(`"ZHJhZnQtMQ=="\n"ZHJhZnQtMg=="`)
        } else if (props.fieldTypeName === 'number') {
            if (props.lastValues.length > 0) {
                setExampleCode(`${props.lastValues.map(lastValue=> `${lastValue}`).join('\n')}`)
            } else {
                setExampleCode(`0\n1\n2\n3`)
            }
        } else if (props.fieldTypeName === 'date') {
            if (props.lastValues.length > 0) {
                setExampleCode(`${props.lastValues.map(lastValue=> `"${lastValue}"`).join('\n')}`)
            } else {
                setExampleCode(`"${(new Date()).toISOString()}"`)
            }
        } else if (props.fieldTypeName === 'form') {
            agent.http.FORMULARY.getFormularyFormFieldOptions(sourceRef.current, props.formName, props.field.id).then(response => {
                if (response && response.status === 200 && isMountedRef.current) {
                    const slicedOptions = response.data.data.slice(0, 5)
                    setExampleCode(slicedOptions.map(option => `${option.form_id}`).join('\n'))
                }
            })
        } else if (props.fieldTypeName === 'user') {
            agent.http.FORMULARY.getFormularyUserOptions(sourceRef.current, props.formName, props.field.id).then(response => {
                if (response && response.status === 200 && isMountedRef.current) {
                    const slicedOptions = response.data.data.slice(0, 5)
                    setExampleCode(`[\n${slicedOptions.map(option => `\t{\n\t\t"id": ${option.id},\n\t\t"email": "${option.email}"\n\t},`).join('\n')}\n]`)
                }
            })
        } else if (['option', 'multi_option'].includes(props.fieldTypeName)) {
            setExampleCode(`[\n\t${props.field.field_option.map(option=> `"${option.option}"`).join(',\n\t')}\n]`)
        } else if (props.fieldTypeName === 'id') {
            if (props.lastValues.length > 0) {
                setExampleCode(`${props.lastValues.map(lastValue=> `"${lastValue}"`).join('\n')}`)
            } else {
                setExampleCode(`${['1', '2', '3'].join('\n')}`)
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMountedRef.current = true
        sourceRef.current = axios.CancelToken.source()
        
        exampleCodeByFieldTypeName()
        return () => {
            isMountedRef.current = false
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div
            style={{
                padding: '10px 0',
                borderBottom: '2px solid #f2f2f2'
            }}
            >
                <Styled.APIDocumentationSectionAndFieldsTableRow>
                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                        <p>
                            {props.field.label_name}
                        </p>
                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                        <p>
                            {types('pt-br', 'field_type', props.fieldTypeName)}
                        </p>
                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                        {getDescription().isAutomaticGenerated ? (
                            <p
                            style={{
                                color: 'red',
                                fontWeight: 'bold'
                            }}
                            >
                                {'O valor desse campo é gerado dinamicamente, não precisa definir ele na chamada de API uma vez que ele é ignorado.'}
                            </p>
                        ):(
                            <React.Fragment>
                                <p
                                style={{
                                    color: '#0dbf7e',
                                    fontWeight: 'bold'
                                }}
                                >
                                    {getDescription().type}
                                </p>
                                <p>
                                    {getDescription().description}
                                </p>
                            </React.Fragment>
                        )}
                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                </Styled.APIDocumentationSectionAndFieldsTableRow>
                {!['id', 'formula'].includes(props.fieldTypeName) ? (
                    <Styled.APIDocumentationSectionAndFieldsTableRow>
                        <div style={{
                            padding: '5px',
                            borderRadius: '10px',
                            backgroundColor: '#17242D',
                            width: '100%'
                        }}>
                            <p style={{color: '#bfbfbf', padding: '0 10px'}}>
                                {strings['pt-br']['apiDocumentationSectionsAndFieldsFieldExampleValuesLabel']}
                            </p>
                            <Code
                            code={exampleCode}
                            languagePack={javascript()}
                            />
                        </div>
                    </Styled.APIDocumentationSectionAndFieldsTableRow>
                ) : ''}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Field