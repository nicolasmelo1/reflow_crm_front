import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { javascript } from "@codemirror/lang-javascript"
import { python } from '@codemirror/lang-python'
import {StreamLanguage} from "@codemirror/stream-parser"
import {shell} from "@codemirror/legacy-modes/mode/shell"
import { types } from '../../../utils/constants'
import Code from '../Code'
import agent from '../../../utils/agent'
import Styled from './styles'


/**
 * Handles all the configuration needed for each field
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Field = (props) => {
    const sourceRef = React.useRef()
    const isMountedRef = React.useRef()
    const [exampleCode, setExampleCode] = useState('')

    /**
     * Updates the example code depending on the value type, for fields like `options`
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
        }
    }

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

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

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
                        <p>
                            {'String'}
                        </p>
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
                                {'Valores de exemplo'}
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

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Field