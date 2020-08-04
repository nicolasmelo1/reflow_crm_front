import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { ActivityIndicator, Modal, Text } from 'react-native'
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
    TemplatesGoBackButton,
    TemplatesHeader
} from '../../styles/Templates'


/**
 * This component is  responsible for handling the preview of the formularies.
 * You might ask what a preview is: a preview is a little description of the template,
 * and the formularies it contains. So preview is used when the user is wanting to know
 * more about a single template.
 * 
 * @param {Array<Object>} groups - Groups are an array containing all the forms the user has access.
 * It is usually used in the sidebar to load the templates and each page/formulary of the user.
 * In this case we need this to redirect the user to the first formulary it encounters.
 * @param {Object} data - This object holds the data of this template, the data is: all of the forms (but not
 * the data of each form, we get the form data to build the form from a url), a description, the id, and so on.
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before 
 * the data be retrieved.
 * @param {Function} onGetTemplate - A redux action responsible for getting more data about the template that was selected.
 * @param {BigInteger} selectedTemplateId - As the name suggests, the id of the selected template
 * @param {Function} onSelectTemplate - A redux action responsible for sending to the API the information that the user has selected 
 * this particular selectedTemplateId. So this is actually kinda like submiting the form.
 * @param {Function} setAddTemplates - Usually this is recieved by the Layout component, this function is responsible for showing or not
 * the Template component on the page. When the user clicks to select a template we actually substitute the content that the page is 
 * displaying, for the Templates component that occupies the hole page.
 * @param {Function} setSelectedTemplate - On this component we need the function to go back, but in other words this function is responsible
 * for handling the selectedTemplateId, we send a new template id everytime we want to get the details of a new template. When set to null
 * we don't load the preview.
 * @param {Function} onGetTemplateFormulary - Redux action that is responsible for retrieving the formulary data, based on an id.
 * This data is the data used to build the formulary and load it on the screen.
 */
const TemplatePreview = (props) => {
    const sourceRef = React.useRef(null)
    const isMountedRef = React.useRef(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        setIsSubmitting(true)
        props.onSelectTemplate(props.data.id).then(response => {
            if (response && response.status === 200) {
                props.setAddTemplates(false)
                if (props.groups.length === 0) {
                    if (process.env['APP'] === 'web') {
                        Router.push(paths.home().asUrl, paths.home(response.data.data.last_form_name).asUrl, { shallow: true })
                    } else {
                        // navigate to screen on mobile
                    }
                }
            }
            if (isMountedRef.current) {
                setIsSubmitting(false)
            }
        })
    }


    useEffect(() => {
        isMountedRef.current = true
        sourceRef.current = props.cancelToken.source()
        return () => {
            isMountedRef.current = false
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
            <Modal animationType="slide">
                <TemplatesPreviewContainer isOpen={props.selectedTemplateId !== -1}>
                    <TemplatesHeader>
                        <TemplatesGoBackButton onPress={e=>props.setSelectedTemplate(-1)}>
                            <FontAwesomeIcon icon={'times'} />
                        </TemplatesGoBackButton>
                    </TemplatesHeader>
                    <TemplatesPreviewContentsContainer>
                        <TemplatesPreviewDescriptionContainer>
                            <TemplatesPreviewDescriptionTitle>
                                {strings['pt-br']['templateDescriptionTitleLabel']}
                            </TemplatesPreviewDescriptionTitle>
                            <TemplatesPreviewDescriptionText>
                                {props.data.description}
                            </TemplatesPreviewDescriptionText>
                            <TemplatesPreviewDescriptionUseButton onPress={e=> {(!isSubmitting) ? onClickUseButton() : null}}>
                                {(isSubmitting) ? (
                                    <ActivityIndicator color="#17242D"/>
                                ) : (
                                    <Text>
                                        {strings['pt-br']['templateUseButtonLabel']}
                                    </Text>
                                )}
                            </TemplatesPreviewDescriptionUseButton>
                        </TemplatesPreviewDescriptionContainer>
                        <TemplatesPreviewFormularyOptionsContainer>
                            <TemplatesPreviewFormularyOptionsTitle>
                                {strings['pt-br']['templateFormularyTitleLabel']}
                            </TemplatesPreviewFormularyOptionsTitle>
                            {props.data.theme_form.map((themeForm, index) => (
                                <TemplatesPreviewFormularyOptionsButton key={index} onPress={e=> {onChangeFormulary(themeForm.id)}} isSelected={formData.formId === themeForm.id}>
                                    {formData.formId === themeForm.id ? (
                                        <TemplatesPreviewFormularyOptionsIcon icon={'chevron-right'}/>
                                    ) : null}
                                    <TemplatesPreviewFormularyOptionsText isSelected={formData.formId === themeForm.id}>
                                        {themeForm.label_name}
                                    </TemplatesPreviewFormularyOptionsText>
                                </TemplatesPreviewFormularyOptionsButton>
                            ))}
                        </TemplatesPreviewFormularyOptionsContainer>
                        <TemplatesPreviewFormularyPreviewContainer>
                            <TemplatesPreviewFormularyPreviewTitle>
                                {strings['pt-br']['templatePreviewTitleLabel']}
                            </TemplatesPreviewFormularyPreviewTitle>
                            <TemplatesPreviewFormularyPreviewFormularyContainer>
                            </TemplatesPreviewFormularyPreviewFormularyContainer>
                        </TemplatesPreviewFormularyPreviewContainer>
                    </TemplatesPreviewContentsContainer>
                </TemplatesPreviewContainer>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesPreviewContainer isOpen={props.selectedTemplateId !== -1}>
                <TemplatesGoBackButton onClick={e=>props.setSelectedTemplate(-1)}>
                    <FontAwesomeIcon icon={'chevron-left'} />&nbsp;{strings['pt-br']['templateGoBackButtonLabel']}
                </TemplatesGoBackButton>
                <TemplatesPreviewContentsContainer>
                    <TemplatesPreviewDescriptionContainer>
                        <TemplatesPreviewDescriptionTitle>
                            {strings['pt-br']['templateDescriptionTitleLabel']}
                        </TemplatesPreviewDescriptionTitle>
                        <TemplatesPreviewDescriptionText>
                            {props.data.description}
                        </TemplatesPreviewDescriptionText>
                        <TemplatesPreviewDescriptionUseButton onClick={e=> {(!isSubmitting) ? onClickUseButton() : null}}>
                            {(isSubmitting) ? (<Spinner animation="border" size="sm"/>) : strings['pt-br']['templateUseButtonLabel']}
                        </TemplatesPreviewDescriptionUseButton>
                    </TemplatesPreviewDescriptionContainer>
                    <TemplatesPreviewFormularyOptionsContainer>
                        <TemplatesPreviewFormularyOptionsTitle>
                            {strings['pt-br']['templateFormularyTitleLabel']}
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
                            {strings['pt-br']['templatePreviewTitleLabel']}
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