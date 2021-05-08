import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import RichText from '../RichText'
import { retrieveHTMLWithContentToDownload } from './utils'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { FRONT_END_HOST } from '../../config'
import dynamicImport from '../../utils/dynamicImport'
import { strings } from '../../utils/constants'
import agent from '../../utils/agent'
import base64 from '../../utils/base64'
import deepCopy from '../../utils/deepCopy'
import Styled from './styles'


const Spinner = dynamicImport('react-bootstrap', 'Spinner')


const Attachment = (props) => {
    const values = props.content.text.split(', ').map(value => !['', null, undefined].includes(value) ? base64.decode(value) : value)
    
    return (
        <div>
            {values.map(value => {
                if (/(http(s?)):\/\//i.test(value)) {
                    return (
                        <div style={{ width: '100%'}}>
                            <img src={value}/>
                        </div>
                    )
                } else {
                    let newProps = deepCopy(props)
                    newProps.content.text = base64.encode(value)
                    return (
                        <Custom {...newProps}/>
                    )
                }
            })}
        </div>
    )
}

const Custom = (props) => {
    const text = props.content.text.split(', ').map(value => !['', null, undefined].includes(value) ? base64.decode(value) : value).join(', ')

    return (
        <Styled.PDFGeneratorReaderDownloaderCustomContent
        className={'custom_content'}
        data-custom-value={props.content.custom_value}
        draggabble="false"
        isItalic={props.content.is_italic}
        isBold={props.content.is_bold}
        isCode={props.content.text === '' || props.content.text === '\n' ? false : props.content.is_code}
        isUnderline={props.content.is_underline}
        textColor={props.content.text_color}
        markerColor={props.content.marker_color}
        textSize={props.content.text_size}
        >
            {text}
        </Styled.PDFGeneratorReaderDownloaderCustomContent>
    )
}


/**
 * This component is responsible for loading the rich text uneditable. We use this so the 
 * user can download the rich text and do some final tweaks to the pdf before downloading.
 * 
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before 
 * the data be retrieved.
 * @param {BigInteger} formId - the ID of the current formulary we are generation the pdf for. We use this
 * to get the saved data of the formulary.
 * @param {String} formName - This is a unique identifier for each form of each company. 
 * This props is the form name that the user is currently in. 
 * @param {Object} templateData - This is a data of the template.
 * @param {Function} setSelectedTemplateIndex - State mutation function defined in `PDFGeneratorReader` component. This is used so we can know which index
 * of the templates list was selected so we can get the correct object in templateData. When selectedTemplate is null, this component is closed. So here
 * we only use this function to close this component.
 * @param {Function} onGetPDFGeneratorValuesReader - This is a redux action function used for retrieving the
 * values from a formulary based on its `formId`
 * @param {Function} onCheckIfCanDownloadPDF - Sends a request to the backend to see if can download template
 * @param {Function} onAddNotification - When the user is trying to download a pdf template but face an error. We need to add a notification
 * for the user
 */
const PDFGeneratorReaderDownloader = (props) => {
    const sourceRef = React.useRef(null)
    const documentRef = React.useRef(null)
    const multipleValuesDividerInputRef = React.useRef(null)
    const multipleValuesElementToChange = React.useRef(null)
    const multipleValuesDividerInputContainerRef = React.useRef(null)
    const [templateData, setTemplateData] = useState({})
    const [isDownloadingFile, setIsDownloadingFile] = useState(false)
    const [valueOptions, setValueOptions] = useState(null)
    const [hasRenderedValueOptions, setHasRenderedValueOptions] = useState(false)
    const [multipleValuesDividerSetterFieldId, setMultipleValuesDividerSetterFieldId] = useState(null)
    const [multipleValuesDividerOptionPosition, setMultipleValuesDividerOptionPosition] = useState({
        x: 0,
        y: 0
    })

    /**
     * When the rich text renders a custom content it doesn't know what to render, since it is not handled inside of the rich text itself.
     * Because of this we need this function to tell it what it should render when it encounter a custom content.
     * 
     * @param {Object} content - The content object, you can find how it is and it's data on index.js in RichText/Blocks folder.
     */
    const renderCustomContent = (content) => {
        let textArray = []
        let fieldType = ''
        if (valueOptions !== null) {
            for (let valuesIndex = 0; valuesIndex<valueOptions.length; valuesIndex++) {
                if (`fieldVariable-${valueOptions[valuesIndex].field_id} fromConnectedField-${valueOptions[valuesIndex].form_value_from_connected_field ? valueOptions[valuesIndex].form_value_from_connected_field.id: ''}` === content.custom_value) {
                    if (!['', null, undefined].includes(valueOptions[valuesIndex].value)) {
                        const base64Value = base64.encode(valueOptions[valuesIndex].value)
                        textArray.push(base64Value)
                    } else {
                        textArray.push(valueOptions[valuesIndex].value)
                    }
                    fieldType = valueOptions[valuesIndex].field_type
                }
            }
        }
        if (fieldType === 'attachment') {
            return {
                component: Attachment,
                text: textArray.join(', ')
            }
        } else {
            return {
                component: Custom,
                text: textArray.join(', ')
            }
        }
    }

    /**
     * This function uses jspdf and html2canvas library, we are importing both libs here because this
     * might not work on the mobile version of the app. So for the mobile version
     * we will need to change this function, so we can use it inside of a webview.
     * 
     * Okay, but how this works? 
     * 
     * We need to preserve the styling, that's why we use html2canvas for. We first convert the content
     * to a canvas element so we can preserve the styling, then we add this canvas element as an image
     * and then we download it as a pdf. 
     */
    const onDownloadDocument = () => {
        setIsDownloadingFile(true)

        const page = retrieveHTMLWithContentToDownload(documentRef.current)
    
        try {
            props.onCheckIfCanDownloadPDF(sourceRef.current, props.formName, templateData.id).then(response => {
                if (response && response.status === 200) {
                    axios.post(`${FRONT_END_HOST}api/generate_pdf`, {html: page}, {
                        responseType: 'blob'
                    }).then(response => {
                        const blob = new Blob([response.data], {type: 'application/pdf'})
                        const link = document.createElement('a')
                        link.href = window.URL.createObjectURL(blob)
                        link.download = `${templateData.name}.pdf`
                        link.click()
                        link.remove()
                        setIsDownloadingFile(false)
                    }).catch(error => {
                        props.onAddNotification(strings['pt-br']['pdfGeneratorDownloaderUnknownErrorMessage'], 'error')
                        setIsDownloadingFile(false)
                    })
                } else {
                    props.onAddNotification(strings['pt-br']['pdfGeneratorDownloaderErrorMessage'], 'error')
                    setIsDownloadingFile(false)
                }
            }).catch(error => {
                props.onAddNotification(strings['pt-br']['pdfGeneratorDownloaderErrorMessage'], 'error')
                setIsDownloadingFile(false)
            })
        } catch {
            props.onAddNotification(strings['pt-br']['pdfGeneratorDownloaderErrorMessage'], 'error')
            setIsDownloadingFile(false)
        }
    }

    /**
     * This is fired when the user clicks on a custom element. This is fired
     * on a click event that we append to the elements of a specific class name.
     * 
     * This is used to open the multiple values divider input. This input is for changing
     * the separator of multiple values. Some values can appear more than once. By default
     * we separate them by ',' but this separator might not be what you want, because
     * of this you can use this to add the separator you want to multiple values.
     * 
     * AGAIN, THIS IS NOT FOR SETTING THE SEPARATOR, THIS JUST OPENS THE INPUT SO
     * YOU CAN ADD YOUR OWN SEPARATOR.
     * 
     * @param {MouseEvent} e - A mouse event object that has data like the mouse 
     * x and y position, the element clicked and so on.
     */
    const onClickCustomElement = (e) => {
        e.preventDefault()
        if (valueOptions !== null) {
            const valuesOfElement = valueOptions.filter(valueOption => `fieldVariable-${valueOption.field_id.toString()} fromConnectedField-${valueOption.form_value_from_connected_field ? valueOption.form_value_from_connected_field.id.toString(): ''}` === e.target.dataset.customValue)
            if (valuesOfElement.length > 1) {
                multipleValuesElementToChange.current = e.target
                setMultipleValuesDividerSetterFieldId(parseInt(e.target.dataset.customValue))
                setMultipleValuesDividerOptionPosition({
                    x: e.pageX,
                    y: e.pageY
                })
            }   
        }
    }

    /**
     * This is fired when the user clicks 'OK' on the menu that opens 
     * for him to change the separator of multiple values. This container
     * opens when the user clicks on a element with the .custom_content
     * class name.
     * 
     * When the user sets his separator we get the inputed value by reference.
     */
    const onClickToChangeCustomElementText = () => {
        if (valueOptions !== null) {
            if (multipleValuesDividerInputRef.current && multipleValuesElementToChange.current) {
                const text = valueOptions
                    .filter(valueOption => `fieldVariable-${valueOption.field_id.toString()} fromConnectedField-${valueOption.form_value_from_connected_field ? valueOption.form_value_from_connected_field.id.toString(): ''}` === multipleValuesElementToChange.current.dataset.customValue)
                    .map(valueOption => valueOption.value)
                    .join(multipleValuesDividerInputRef.current.value)
                multipleValuesElementToChange.current.textContent = text
            }
            setMultipleValuesDividerSetterFieldId(null)
        }
    }

    /**
     * This is fired whenever the user clicks outside of multipleValuesDividerSetter container.
     * So the container that you can set the separator. When the user clicks outside we want to 
     * close the container.
     * 
     * @param {MouseEvent} e - MouseEvent that contains the position of the click on the page, and information
     * like the content clicked.
     */
    const onClickOutsideCustomElement = (e) => {
        e.stopPropagation()
        if (multipleValuesDividerInputContainerRef.current) {
            if (!multipleValuesDividerInputContainerRef.current.contains(e.target)) {
                setMultipleValuesDividerSetterFieldId(null)
            }
        }
    }

    useEffect(() => {
        // When this component is mounted we first get variables values.
        // Then we append to the document the `onClickOutsideCustomElement` function
        // so we can close the multiple values separator container.
        // When this component is unmounted we remove the 'click' event from the 
        // elements with the `.custom_content`, this event is added on the others
        // useEffects
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTempalateReader(sourceRef.current, props.formName, props.templateData.id).then(response => {
            if (response && response.status === 200) {
                setTemplateData(response.data.data)
                props.onGetPDFGeneratorValuesReader(sourceRef.current, props.formName, props.templateData.id, props.formId).then(async response => {
                    if (response && response.status === 200) {
                        const values = await Promise.all(response.data.data.map(async value => {
                            if (value.field_type === 'attachment' && !['', null, undefined].includes(value.value) && ['png', 'jpg', 'jpeg', 'gif'].includes(value.value.split('.').pop())) {
                                value.value = await agent.http.FORMULARY.getAttachmentFile(value.form_name, value.form_id, value.field_id, value.value)
                            }
                            return value
                        }))
                        setValueOptions(values)
                    }
                })
            }
        })

        document.addEventListener("mousedown", onClickOutsideCustomElement)
        return () => {
            document.removeEventListener("mousedown", onClickOutsideCustomElement)
            const customElements = Array.from(document.querySelectorAll('.custom_content'))
            customElements.forEach(customElement => {
                customElement.removeEventListener('click', onClickCustomElement)
            })

            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        // This is kinda dumb but we need to do this, sorry. When we change the valueOptions
        // the elements WILL BE rendered but are not rendered yet. Because of this
        // AFTER THE ELEMENTS ARE RENDERED WE FORCE THE COMPONENT TO UPDATE AGAIN
        // changing the state. Since the Elements will be rendered after that
        // we can easily add the 'click' eventListener to the '.custom_content' elements
        // because they will be already rendered in the page.
        if (valueOptions !== null) {
            setHasRenderedValueOptions(true)
        }
    }, [valueOptions])

    useEffect(() => {
        // Explained more above but this is kinda the way react works. So we need to do this. Sorry :/
        const customElements = Array.from(document.querySelectorAll('.custom_content'))
        customElements.forEach(customElement => {
            customElement.addEventListener('click', onClickCustomElement)
        })
    }, [hasRenderedValueOptions])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {multipleValuesDividerSetterFieldId !== null ? (
                    <Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer
                    ref={multipleValuesDividerInputContainerRef} 
                    top={multipleValuesDividerOptionPosition.y}
                    left={multipleValuesDividerOptionPosition.x}
                    >
                        <Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel>
                            {strings['pt-br']['pdfGeneratorReaderDownloaderMultipleFieldsSeparatorTitleLabel']}
                        </Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel>
                        <Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInput 
                        ref={multipleValuesDividerInputRef} 
                        placeholder={strings['pt-br']['pdfGeneratorReaderDownloaderMultipleFieldsSeparatorPlaceholder']}
                        type={'text'}
                        />
                        <Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton onClick={(e) => onClickToChangeCustomElementText()}>
                            {strings['pt-br']['pdfGeneratorReaderDownloaderMultipleFieldsSeparatorButtonLabel']}
                        </Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton>
                    </Styled.PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer>
                ) : ''}
                <Styled.PDFGeneratorReaderTopButtonsContainer>
                    <Styled.PDFGeneratorReaderDownloaderGoBackButton 
                    onClick={(e) => props.setSelectedTemplateIndex(null)}
                    >
                        <FontAwesomeIcon icon={'chevron-left'}/>
                        &nbsp;{strings['pt-br']['pdfGeneratorReaderDownloaderGoBackButtonLabel']}
                    </Styled.PDFGeneratorReaderDownloaderGoBackButton>
                    <Styled.PDFGeneratorReaderDownloaderDownloadButton 
                    onClick={(e) => isDownloadingFile ? null : onDownloadDocument()}
                    >
                        {isDownloadingFile ? (<Spinner animation="border" size="sm"/>) : strings['pt-br']['pdfGeneratorReaderDownloaderDownloadButtonLabel']}
                    </Styled.PDFGeneratorReaderDownloaderDownloadButton>
                </Styled.PDFGeneratorReaderTopButtonsContainer>
                <Styled.PDFGeneratorReaderDownloaderPage>
                    <div 
                    ref={documentRef}
                    >
                        {templateData?.rich_text_page && hasRenderedValueOptions ? (
                            <RichText 
                            isToolbarFixed={true}
                            isEditable={true}
                            initialData={templateData?.rich_text_page}
                            renderCustomContent={renderCustomContent} 
                            allowedBlockTypeIds={props.allowedRichTextBlockIds}
                            />
                        ) : (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner animation="border" style={{ color:'#0dbf7e'}}/>
                            </div>
                        )}
                    </div>
                </Styled.PDFGeneratorReaderDownloaderPage>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorReaderDownloader