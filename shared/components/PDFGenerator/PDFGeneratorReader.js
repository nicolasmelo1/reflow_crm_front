import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Router from 'next/router'
import { paths, strings } from '../../utils/constants'
import PDFGeneratorReaderDownloader from './PDFGeneratorReaderDownloader'
import { 
    PDFGeneratorReaderTopButtonsContainer,
    PDFGeneratorReaderGoBackButton,
    PDFGeneratorReaderTemplateButton,
    PDFGeneratorGetMoreTemplatesButtonContainer,
    PDFGeneratorGetMoreTemplatesButton,
    PDFGeneratorReaderTemplatesContainer
} from '../../styles/PDFGenerator'


/**
 * This component holds all of the template options for downloading. This is a sibling of PDFGeneratorCreator component. It is really similar
 * with some small differences between them.
 * 
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before 
 * the data be retrieved.
 * @param {String} formName - This is a unique identifier for each form of each company. This props is the form name that 
 * the user is currently in. 
 * @param {BigInteger} formId - The ID of the current formulary we are generation the pdf for. We use this
 * to get the saved data of the formulary.
 * @param {Array<Object>} templates - The array containing all of templates the user can select. They are what we show to the user.
 * @param {Function} onGetPDFGeneratorValuesReader - This is a redux action function used for retrieving the values from a 
 * formulary based on its `formId`
 * @param {Function} onGetPDFGeneratorTempalatesReader - This is a redux action function used for retrieving the list of templates
 * so we can show them to the user for selection
 * @param {Function} onCheckIfCanDownloadPDF - Sends a request to the backend to see if can download template
 * @param {Function} onAddNotification - When the user is trying to download a pdf template but face an error. We need to add a notification
 * for the user
 */
const PDFGeneratorReader = (props) => {
    const sourceRef = React.useRef(null)
    const [page, setPage] = useState({
        current: 1,
        total: 1
    })
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

    /**
     * We only load 5 templates, so we display a button to load more templates in the bottom of the list.
     * This handles when the user clicks to load more template.
     */
    const onClickLoadMoreButton = () => {
        const newPage = page.current + 1
        if (newPage <= page.total) {
            props.onGetPDFGeneratorTempalatesReader(sourceRef.current, props.formName, newPage).then(response => {
                if (response && response.status === 200) {
                    setPage(response.data.pagination)
                }
            })
        }
    }

    useEffect(() => {
        // When the component is loaded we just fetch for the templates. 
        // Nothing really fancy about it.
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTempalatesReader(sourceRef.current, props.formName, 1).then(response => {
            if (response && response.status === 200) {
                setPage(response.data.pagination)
            }
        })       
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View>
                {selectedTemplateIndex !== null ? (
                    <PDFGeneratorReaderDownloader
                    cancelToken={props.cancelToken}
                    formId={props.formId}
                    formName={props.formName}
                    templateData={props.templates[selectedTemplateIndex]}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onGetPDFGeneratorValuesReader={props.onGetPDFGeneratorValuesReader}
                    onCheckIfCanDownloadPDF={props.onCheckIfCanDownloadPDF}
                    onAddNotification={props.onAddNotification}
                    />
                ) : (
                    <View>
                        <PDFGeneratorReaderTopButtonsContainer>
                            <PDFGeneratorReaderGoBackButton onClick={(e) => onClickCancel()}>
                                {strings['pt-br']['pdfGeneratorReaderGoBackButtonLabel']}
                            </PDFGeneratorReaderGoBackButton>
                        </PDFGeneratorReaderTopButtonsContainer>
                        {props.templates.map((pdfTemplate, index) => (
                            <PDFGeneratorReaderTemplateButton 
                            key={pdfTemplate.id} 
                            onClick={(e) => setSelectedTemplateIndex(index)} 
                            >
                                <Text>
                                    {pdfTemplate.name}
                                </Text>
                            </PDFGeneratorReaderTemplateButton>
                        ))}
                    </View>
                )}
            </View>
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
                    onCheckIfCanDownloadPDF={props.onCheckIfCanDownloadPDF}
                    onAddNotification={props.onAddNotification}
                    allowedBlockTypeIds={props.allowedRichTextBlockIds}
                    />
                ) : (
                    <div>
                        <PDFGeneratorReaderTopButtonsContainer>
                            <PDFGeneratorReaderGoBackButton onClick={(e) => onClickCancel()}>
                                {strings['pt-br']['pdfGeneratorReaderGoBackButtonLabel']}
                            </PDFGeneratorReaderGoBackButton>
                        </PDFGeneratorReaderTopButtonsContainer>
                        <PDFGeneratorReaderTemplatesContainer>
                            {props.templates.map((pdfTemplate, index) => (
                                <PDFGeneratorReaderTemplateButton 
                                key={pdfTemplate.id} 
                                onClick={(e) => setSelectedTemplateIndex(index)} 
                                >
                                    <h2>
                                        {pdfTemplate.name}
                                    </h2>
                                </PDFGeneratorReaderTemplateButton>
                            ))}
                            {page.current < page.total ? (
                                <PDFGeneratorGetMoreTemplatesButtonContainer>
                                    <PDFGeneratorGetMoreTemplatesButton
                                    onClick={(e) => onClickLoadMoreButton()} 
                                    >
                                        {strings['pt-br']['pdfGeneratorLoadMoreButtonLabel']}
                                    </PDFGeneratorGetMoreTemplatesButton>
                                </PDFGeneratorGetMoreTemplatesButtonContainer>
                            ) : ''}
                        </PDFGeneratorReaderTemplatesContainer>
                    </div>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorReader