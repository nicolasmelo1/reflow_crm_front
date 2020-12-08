import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Router from 'next/router'
import { paths, strings } from '../../utils/constants'
import PDFGeneratorReaderDownloader from './PDFGeneratorReaderDownloader'
import { 
    PDFGeneratorReaderTopButtonsContainer,
    PDFGeneratorReaderGoBackButton,
    PDFGeneratorReaderTemplateButton
} from '../../styles/PDFGenerator'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorReader = (props) => {
    const sourceRef = React.useRef(null)
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null)

    /**
     * Fires when the user clicks cancel on this page, we return the user to an empty page so it automatically returns the user to the page
     * he was in. We actually don't need this.
     */
    const onClickCancel = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.empty().asUrl, paths.empty().asUrl,{ shallow: true })
        }
    }


    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTempalatesReader(sourceRef.current, props.formName)
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
            <div>
                {selectedTemplateIndex !== null ? (
                    <PDFGeneratorReaderDownloader
                    cancelToken={props.cancelToken}
                    formId={props.formId}
                    formName={props.formName}
                    templateData={props.templates[selectedTemplateIndex]}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onGetPDFGeneratorValuesReader={props.onGetPDFGeneratorValuesReader}
                    />
                ) : (
                    <div>
                        <PDFGeneratorReaderTopButtonsContainer>
                            <PDFGeneratorReaderGoBackButton onClick={(e) => onClickCancel()}>
                                {'Voltar para gestão'}
                            </PDFGeneratorReaderGoBackButton>
                        </PDFGeneratorReaderTopButtonsContainer>
                        <div>
                            {props.templates.map((pdfTemplate, index) => (
                                <PDFGeneratorReaderTemplateButton 
                                key={pdfTemplate.id} 
                                onClick={(e) => setSelectedTemplateIndex(index)} 
                                style={{ display: 'block', width: '100%', textAlign: 'left'}}
                                >
                                    <h2>
                                        {pdfTemplate.name}
                                    </h2>
                                </PDFGeneratorReaderTemplateButton>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorReader