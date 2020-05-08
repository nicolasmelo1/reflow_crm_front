import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Formulary from '../Formulary'
import agent from '../../redux/agent'
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
        let data = {}
        agent.TEMPLATES.getSelectTemplateFormulary(sourceRef.current, props.data.id, formId).then(response=> {
            if (response && response.status === 200) {
                data = {
                    ...response.data.data,
                    depends_on_form: response.data.data.depends_on_theme_form.map(sectionForm => ({
                        ...sectionForm,
                        form_fields: sectionForm.theme_form_fields.map(formField => ({
                            ...formField,
                            field_option: formField.theme_field_option
                        }))
                    }))
                }
                delete data.depends_on_theme_form;
                setFormData({ formId: data.id, templateId: props.data.id, formName: data.form_name + props.data.id,formData: data})
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
                    </TemplatesPreviewDescriptionContainer>
                    <TemplatesPreviewFormularyOptionsContainer>
                        <TemplatesPreviewFormularyOptionsTitle>
                            Formulários
                        </TemplatesPreviewFormularyOptionsTitle>
                        {props.data.theme_form.map(themeForm => (
                            <TemplatesPreviewFormularyOptionsButton onClick={e=> {onChangeFormulary(themeForm.id)}}>
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
                                //formularyId={this.state.formularyId} 
                                //setFormularyId={this.setFormularyId} 
                                //setFormularySettingsHasBeenUpdated={this.setFormularySettingsHasBeenUpdated}
                                //setFormularyHasBeenUpdated={this.setFormularyHasBeenUpdated}
                                //setFormularyDefaultData={this.setFormularyDefaultData}
                                //formularyDefaultData={this.state.formularyDefaultData}
                                //onOpenOrCloseFormulary={this.props.onOpenFormulary}
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