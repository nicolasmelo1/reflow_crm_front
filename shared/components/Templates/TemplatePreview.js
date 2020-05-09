import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Formulary from '../Formulary'
import { paths, strings } from '../../utils/constants'
import { 
    TemplatesPreviewFormularyPreviewFormularyContainer,
    TemplatesPreviewFormularyPreviewTitle,
    TemplatesPreviewFormularyPreviewContainer,
    TemplatesPreviewFormularyOptionsButton,
    TemplatesPreviewFormularyOptionsIcon,
    TemplatesPreviewFormularyOptionsText,
    TemplatesPreviewFormularyOptionsTitle,
    TemplatesPreviewFormularyOptionsContainer,
    TemplatesPreviewContentsContainer, 
    TemplatesPreviewDescriptionUseButton,
    TemplatesPreviewDescriptionContainer,
    TemplatesPreviewDescriptionText,
    TemplatesPreviewDescriptionTitle,
    TemplatesPreviewContainer, 
    TemplatesGoBackButton 
} from '../../styles/Templates'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplatePreview = (props) => {
    const sourceRef = React.useRef(null)
    const [formData, setFormData] = useState({
        formId: null, 
        templateId: null,
        formName: null,
        formData: {}
    })

    const onChangeFormulary = (formId) => {
        props.onGetTemplateFormulary(sourceRef.current, props.data.id, formId).then(data=> {
            setFormData({ 
                formId: data.id, 
                templateId: props.data.id, 
                formName: data.form_name + props.data.id,
                formData: data
            })
        })
    }

    const onClickUseButton = () => {
        props.onSelectTemplate(props.data.id).then(response => {
            if (response && response.status === 200) {
                props.setAddTemplates(false)
                if (props.groups.length === 0) {
                    Router.push(paths.home(response.data.data.last_form_name, true), paths.home(response.data.data.last_form_name), { shallow: true })
                }
            }
        })
    }


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


    useEffect(() => {
        if (props.data.theme_form.length > 0) {
            onChangeFormulary(props.data.theme_form[0].id)
        }
    }, [props.data])


    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesPreviewContainer isOpen={props.selectedTemplateId !== -1}>
                <TemplatesGoBackButton onClick={e=>props.setSelectedTemplate(-1)}>
                    <FontAwesomeIcon icon={'chevron-left'} /> Voltar
                </TemplatesGoBackButton>
                <TemplatesPreviewContentsContainer>
                    <TemplatesPreviewDescriptionContainer>
                        <TemplatesPreviewDescriptionTitle>
                            Descrição
                        </TemplatesPreviewDescriptionTitle>
                        <TemplatesPreviewDescriptionText>
                            {props.data.description}
                        </TemplatesPreviewDescriptionText>
                        <TemplatesPreviewDescriptionUseButton onClick={e=> onClickUseButton()}>
                            Usar
                        </TemplatesPreviewDescriptionUseButton>
                    </TemplatesPreviewDescriptionContainer>
                    <TemplatesPreviewFormularyOptionsContainer>
                        <TemplatesPreviewFormularyOptionsTitle>
                            Formulários
                        </TemplatesPreviewFormularyOptionsTitle>
                        {props.data.theme_form.map((themeForm, index) => (
                            <TemplatesPreviewFormularyOptionsButton key={index} onClick={e=> {onChangeFormulary(themeForm.id)}}>
                                {formData.formId === themeForm.id ? (
                                    <TemplatesPreviewFormularyOptionsIcon icon={'chevron-right'}/>
                                ): ''}
                                <TemplatesPreviewFormularyOptionsText isSelected={formData.formId === themeForm.id}>
                                    {themeForm.label_name}
                                </TemplatesPreviewFormularyOptionsText>
                            </TemplatesPreviewFormularyOptionsButton>
                        ))}
                    </TemplatesPreviewFormularyOptionsContainer>
                    <TemplatesPreviewFormularyPreviewContainer>
                        <TemplatesPreviewFormularyPreviewTitle>
                            Preview
                        </TemplatesPreviewFormularyPreviewTitle>
                        <TemplatesPreviewFormularyPreviewFormularyContainer>
                            {formData.templateId === props.data.id ? (
                                <Formulary 
                                display={'standalone'}
                                type={'preview'}
                                formName={formData.formName} 
                                buildData={formData.formData}
                                />
                            ) : ''}
                        </TemplatesPreviewFormularyPreviewFormularyContainer>
                    </TemplatesPreviewFormularyPreviewContainer>
                </TemplatesPreviewContentsContainer>
            </TemplatesPreviewContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplatePreview