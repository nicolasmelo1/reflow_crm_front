import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import RichText from '../RichText'
import { 
    PDFGeneratorReaderDownloaderCustomContent,
    PDFGeneratorReaderDownloaderRichTextContainer,
    PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel,
    PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInput,
    PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer,
    PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton
} from '../../styles/PDFGenerator'

const Custom = (props) => {
    return (
        <PDFGeneratorReaderDownloaderCustomContent
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
            {props.content.text}
        </PDFGeneratorReaderDownloaderCustomContent>
    )
}


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorReaderDownloader = (props) => {
    const sourceRef = React.useRef(null)
    const documentRef = React.useRef(null)
    const multipleValuesDividerInputRef = React.useRef(null)
    const multipleValuesElementToChange = React.useRef(null)
    const multipleValuesDividerInputContainerRef = React.useRef(null)
    const [valueOptions, setValueOptions] = useState([])
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
        for (let valuesIndex = 0; valuesIndex<valueOptions.length; valuesIndex++) {
            if (valueOptions[valuesIndex].field_id.toString() === content.custom_value) {
                textArray.push(valueOptions[valuesIndex].value)
            }
        }
        return {
            component: Custom,
            text: textArray.join(', ')
        }
    }

    const onDownloadDocument = () => {
        const jsPDF = require('jspdf').jsPDF
        const html2canvas = require('html2canvas')
        const doc = new jsPDF();

        html2canvas(documentRef.current, { scale: 1 }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg')
				                                                                                    
            doc.addImage(imgData, 'jpeg', 20, 20)
            
            doc.save('sample.pdf')
        })
    }
    /**
     * 
     * @param {*} e 
     */
    const onClickCustomElement = (e) => {
        e.preventDefault()
        const valuesOfElement = valueOptions.filter(valueOption => valueOption.field_id.toString() === e.target.dataset.customValue)
        if (valuesOfElement.length > 1) {
            multipleValuesElementToChange.current = e.target
            setMultipleValuesDividerSetterFieldId(parseInt(e.target.dataset.customValue))
            setMultipleValuesDividerOptionPosition({
                x: e.pageX,
                y: e.pageY
            })
        }
    }

    const onClickToChangeCustomElementText = () => {
        if (multipleValuesDividerInputRef.current && multipleValuesElementToChange.current) {
            const text = valueOptions
                .filter(valueOption => valueOption.field_id.toString() === multipleValuesElementToChange.current.dataset.customValue)
                .map(valueOption => valueOption.value)
                .join(multipleValuesDividerInputRef.current.value)
            multipleValuesElementToChange.current.textContent = text
        }
        setMultipleValuesDividerSetterFieldId(null)
    }

    const onClickOutsideCustomElement = (e) => {
        e.stopPropagation()
        if (multipleValuesDividerInputContainerRef.current) {
            if (!multipleValuesDividerInputContainerRef.current.contains(e.target)) {
                setMultipleValuesDividerSetterFieldId(null)
            }
        }
    }

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorValuesReader(sourceRef.current, props.formName, props.templateData.id, props.formId).then(response => {
            if (response && response.status === 200) {
                setValueOptions(response.data.data)
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
        if (valueOptions.length > 0) {
            setHasRenderedValueOptions(true)
        }
    }, [valueOptions])

    useEffect(() => {
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
                    <PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer
                    ref={multipleValuesDividerInputContainerRef} 
                    top={multipleValuesDividerOptionPosition.y}
                    left={multipleValuesDividerOptionPosition.x}
                    >
                        <PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel>
                            {'Esse campo contém multiplos valores, como você deseja separá-los?'}
                        </PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel>
                        <PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInput 
                        ref={multipleValuesDividerInputRef} 
                        placeholder={'Ex: Separe por " - "'}
                        type={'text'}
                        />
                        <PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton onClick={(e) => onClickToChangeCustomElementText()}>
                            {'Ok'}
                        </PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton>
                    </PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer>
                ) : ''}
                <button onClick={(e) => props.setSelectedTemplateIndex(null)}>
                    Voltar
                </button>
                <button onClick={(e) => onDownloadDocument()}>
                    Baixar
                </button>
                <PDFGeneratorReaderDownloaderRichTextContainer ref={documentRef}>
                    <RichText 
                    isEditable={false}
                    initialData={props.templateData?.pdf_template_rich_text?.rich_text}
                    renderCustomContent={renderCustomContent} 
                    />
                </PDFGeneratorReaderDownloaderRichTextContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorReaderDownloader