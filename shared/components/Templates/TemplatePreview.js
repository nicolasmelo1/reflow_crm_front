import React, { useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    TemplatesPreviewContentsContainer, 
    TemplatesPreviewDescriptionContainer,
    TemplatesPreviewDescriptionText,
    TemplatesPreviewDescriptionTitle,
    TemplatesPreviewContainer, 
    TemplatesGoBackButton } from '../../styles/Templates'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplatePreview = (props) => {
    const sourceRef = React.useRef(null)

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        if (props.selectedTemplateId !== -1) {
            props.onGetTemplate(sourceRef.current, props.selectedTemplateId)
        }
    }, [props.selectedTemplateId])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesPreviewContainer isOpen={props.selectedTemplateId !== -1}>
                <TemplatesGoBackButton onClick={e=>props.setSelectedTemplate(-1)}>
                    <FontAwesomeIcon icon={'chevron-left'}/> Voltar
                </TemplatesGoBackButton>
                <TemplatesPreviewContentsContainer>
                    <TemplatesPreviewDescriptionContainer>
                        <TemplatesPreviewDescriptionTitle>
                            Descrição
                        </TemplatesPreviewDescriptionTitle>
                        <TemplatesPreviewDescriptionText>
                            {props.data.description}
                        </TemplatesPreviewDescriptionText>
                    </TemplatesPreviewDescriptionContainer>
                    <div style={{ flexDirection: 'column', marginLeft: '10px'}}>
                        <h2 style={{color: '#0dbf7e'}}> Formulários</h2>
                        {props.data.theme_form.map(themeForm => (
                            <p style={{margin: 0, fontWeight: 'bold'}}>{themeForm.label_name}</p>
                        ))}
                    </div>
                    <div style={{ flexDirection: 'column'}}>
                        <h2 style={{color: '#0dbf7e'}}> Formulários</h2>
                    </div>
                </TemplatesPreviewContentsContainer>
            </TemplatesPreviewContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplatePreview