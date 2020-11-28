import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import RichText from '../RichText'
import FieldSelectorOptionBox from './FieldSelectorOptionBox'
import { 
    PDFGeneratorCreatorTemplateTitleContainer
} from '../../styles/PDFGenerator'

const Custom = (props) => {
    return (
        <span style={{color: 'blue', fontWeight: props.content.is_bold ? 'bold' : 'normal'}}>
            {props.content.text}
        </span>
    )
}

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorCreatorEditor = (props) => {
    const sourceRef = React.useRef()
    const [richTextData, setRichTextData] = useState({})
    const [templateData, setTemplateData] = useState({})
    const [isEditingTemplateName, setIsEditingTemplateName] = useState(false)
    const [unmanagedFieldSelectedValue, setUnmanagedFieldSelectedValue] = useState(null)
    const [isUnmanagedFieldSelectorOpen, setIsUnmanagedFieldSelectorOpen] = useState(false)
    const [unmanagedFieldSelectorPosition, setUnmanagedFieldSelectorPosition] = useState({
        x: 0,
        y: 0
    })
    const unmanaged = {
        '@': setUnmanagedFieldSelectorPosition
    }

    const renderCustomContent = (content) => {
        let text = ''
        for (let i = 0; i<props.fieldOptions.length; i++) {
            if (props.fieldOptions[i].id.toString() === content.custom_value) {
                text = props.fieldOptions[i].label_name
                break
            }
        }
        return {
            component: Custom,
            text: text
        }
    }
    
    const onChangeTemplateName = (data) => {
        setTemplateData({
            ...templateData,
            name: data
        })
    }

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        setTemplateData({...props.templateData})
        if (props.templateData?.pdf_template_rich_text?.rich_text) {
            props.onGetRichTextDataById(sourceRef.current, props.templateData?.pdf_template_rich_text?.rich_text).then(response => {
                if (response && response.status === 200) {
                    setRichTextData(response.data.data)
                }
            })
        }
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
                <PDFGeneratorCreatorTemplateTitleContainer>
                    {isEditingTemplateName ? (
                        <input value={templateData.name} onChange={(e) => onChangeTemplateName(e.target.value)}/>
                    ) : (
                        <h2>{templateData.name}</h2>
                    )}
                    <div>
                        <button onClick={(e)=> setIsEditingTemplateName(!isEditingTemplateName)}>
                            <FontAwesomeIcon icon={'pencil-alt'}/>
                        </button>
                        <button>
                            <FontAwesomeIcon icon={'chevron-down'}/>
                        </button>
                    </div>
                </PDFGeneratorCreatorTemplateTitleContainer>
                <div style={{ height: '50px', width: '100%'}}>
                    
                    <button>Salvar</button>
                    <button onClick={(e) => props.setSelectedTemplateIndex(null)}>Cancelar</button>
                </div>
                {isUnmanagedFieldSelectorOpen ? (
                    <FieldSelectorOptionBox 
                    fieldOptions={props.fieldOptions}
                    top={unmanagedFieldSelectorPosition.y} 
                    left={unmanagedFieldSelectorPosition.x} 
                    onClickOption={setUnmanagedFieldSelectedValue}
                    />
                ) : ''}
                <RichText 
                initialData={richTextData}
                renderCustomContent={renderCustomContent} 
                handleUnmanagedContent={unmanaged} 
                onOpenUnmanagedContentSelector={setIsUnmanagedFieldSelectorOpen}
                isUnmanagedContentSelectorOpen={isUnmanagedFieldSelectorOpen}
                onChangeUnmanagedContentValue={setUnmanagedFieldSelectedValue}
                unmanagedContentValue={unmanagedFieldSelectedValue}
                />
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreatorEditor