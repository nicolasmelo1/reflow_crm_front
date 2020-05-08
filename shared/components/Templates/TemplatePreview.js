import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Formulary from '../Formulary'
import agent from '../../redux/agent'
import { 
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
    const [formData, setFormData] = useState(null)

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
            let data = {}
            agent.TEMPLATES.getSelectTemplateFormulary(sourceRef.current, props.selectedTemplateId, props.data.theme_form[0].id).then(response=> {
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
                    setFormData(data)
                }
            })
        }
    }, [props.data.theme_form])

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
                        {formData ? (
                            <Formulary 
                            formName={null} 
                            buildData={formData}
                            //formularyId={this.state.formularyId} 
                            //setFormularyId={this.setFormularyId} 
                            //setFormularySettingsHasBeenUpdated={this.setFormularySettingsHasBeenUpdated}
                            //setFormularyHasBeenUpdated={this.setFormularyHasBeenUpdated}
                            //setFormularyDefaultData={this.setFormularyDefaultData}
                            //formularyDefaultData={this.state.formularyDefaultData}
                            //onOpenOrCloseFormulary={this.props.onOpenFormulary}
                            />
                        ) : ''}
                    </div>
                </TemplatesPreviewContentsContainer>
            </TemplatesPreviewContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplatePreview