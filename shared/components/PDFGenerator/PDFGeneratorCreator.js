import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PDFGeneratorCreatorEditor from './PDFGeneratorCreatorEditor'
import { paths } from '../../utils/constants'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorCreator = (props) => {
    const sourceRef = React.useRef()
    const [fieldOptions, setFieldOptions] = useState([])
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null)
    
    const getTemplateData = () => {
        return [undefined, null].includes(props.templates[selectedTemplateIndex]) ? addNewPDFTemplateConfiguration() : props.templates[selectedTemplateIndex]
    }

    const addNewPDFTemplateConfiguration = () => ({
        id: null,
        name: 'Novo template',
        form: null,
        template_configuration_variables: [],
        pdf_template_rich_text: null
    })

    const onClickCancel = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.empty().asUrl, paths.empty().asUrl,{ shallow: true })
        }
    }

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName)
        props.onGetPDFGeneratorTempalatesConfigurationFieldOptions(sourceRef.current, props.formName).then(response => {
            if (response && response.status === 200) {
                setFieldOptions(response.data.data)
            }
        })
        return () => {
            if(sourceRef.current) {
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
            <div>
                {selectedTemplateIndex !== null ? (
                    <PDFGeneratorCreatorEditor
                    cancelToken={props.cancelToken}
                    fieldOptions={fieldOptions}
                    templateData={getTemplateData()}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    cancelToken={props.cancelToken}
                    onGetRichTextDataById={props.onGetRichTextDataById}
                    />
                ) : (
                    <div style={{ height: 'var(--app-height)', width: '100%'}}>
                        <div>
                            <button onClick={(e) => setSelectedTemplateIndex(props.templates.length)}>Criar Novo</button>
                            <button>Salvar</button>
                            <button onClick={(e) => onClickCancel()}>Cancelar</button>
                        </div>
                        <div>
                            {props.templates.map((pdfTemplate, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <h2>{pdfTemplate.name}</h2>
                                    <div>
                                        <button onClick={(e)=> setSelectedTemplateIndex(index)}>
                                            <FontAwesomeIcon icon={'pencil-alt'}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreator