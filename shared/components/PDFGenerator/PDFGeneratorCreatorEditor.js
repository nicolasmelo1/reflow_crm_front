import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal, SafeAreaView, useWindowDimensions } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import RichText from '../RichText'
import FieldSelectorOptionBox from './FieldSelectorOptionBox'
import dynamicImport from '../../utils/dynamicImport'
import { strings } from '../../utils/constants'
import Styled from './styles'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

const Custom = (props) => {
    return (
        <Styled.PDFGeneratorCreatorEditorCustomContent
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
        </Styled.PDFGeneratorCreatorEditorCustomContent>
    )
}

/**
 * Component responsible for rendering the editor of pdf to the user. This editor is mostly the RichText component.
 * It handles the name of the PDF Template and everything else is handled on the Rich Text component editor.
 * 
 * @param {Array<Object>} formAndFieldOptions - Array of fields so we can display them to the user when he types '@' in the
 * RichText editor
 * @param {Object} templateData - This is a template data object, and this is important. On some other components like Employees table for example
 * when we edit a user we edit actually the item in the array. Here we want to make the data that display on the `PDFGeneratorCreator` component and here
 * separate. So when you change the name of a template for example, and hit `cancel` button, the list will remain intact.
 * @param {Function} setSelectedTemplateIndex - State mutation function defined in `PDFGeneratorCreator` component. This is used so we can know which index
 * of the templates list was selected so we can get the correct object in templateData. When selectedTemplate is null, this component is closed. So here
 * we only use this function to close this component.
 * @param {Function} onUpdateOrCreatePDFTemplateConfiguration - Function defined in `PDFGeneratorCreator` component to save the data on the backend. It recieves
 * an object. If this object has the id key as null then it will create a new PDFTemplate ohterwise it will update an existing template Configuration.
 * @param {Function} onAddNotification - When the user is trying to create a pdf template but face an error. We need to add a notification
 * for the user
 */
const PDFGeneratorCreatorEditor = (props) => {
    const sourceRef = React.useRef(null)
    const isMountedRef = React.useRef(true)
    const mobileWindowHeight = useWindowDimensions().height
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)
    const [templateData, setTemplateData] = useState({})
    const [unmanagedFieldSelectedValue, setUnmanagedFieldSelectedValue] = useState(null)
    const [isUnmanagedFieldSelectorOpen, setIsUnmanagedFieldSelectorOpen] = useState(false)
    const [unmanagedFieldSelectorPosition, setUnmanagedFieldSelectorPosition] = useState({
        x: 0,
        y: 0
    })
    // ------------------------------------------------------------------------------------------
    // we use this to tell the rich text that when the user types this character we will handle the insertion of the content on this component and not
    // on the rich text itself
    const unmanaged = {
        '@': setUnmanagedFieldSelectorPosition
    }
    // ------------------------------------------------------------------------------------------
    /**
    * This function is used for validating if the data the user inserted in a field name is valid or not. You will notice that this is a switch
    * with a set of statements. Each return case is a different condition to check if the data is valid.
    * 
    * @param {String} name - The name is actually a key that we use to reference on what the field you are validating is.
    * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
    * based on the keys from the `userData` object.
    * @param {String} value - The value the user inserted in this field to validate.
    */
    const isValid = (name, value) => {
        switch (name) {
            case 'name':
                return value !== ''
            default:
                return true
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the rich text renders a custom content it doesn't know what to render, since it is not handled inside of the rich text itself.
     * Because of this we need this function to tell it what it should render when it encounter a custom content.
     * 
     * @param {Object} content - The content object, you can find how it is and it's data on index.js in RichText/Blocks folder.
     */
    const renderCustomContent = (content) => {
        let text = ''
        for (let formIndex = 0; formIndex<props.formAndFieldOptions.length; formIndex++) {
            for (let fieldIndex=0; fieldIndex<props.formAndFieldOptions[formIndex].form_fields.length; fieldIndex++) {
                if (content.custom_value.includes('fieldVariable') && 
                    `fieldVariable-${props.formAndFieldOptions[formIndex].form_fields[fieldIndex].id.toString()} fromConnectedField-${props.formAndFieldOptions[formIndex].form_from_connected_field ? props.formAndFieldOptions[formIndex].form_from_connected_field.id.toString(): ''}` === content.custom_value) {
                    text = props.formAndFieldOptions[formIndex].form_fields[fieldIndex].label_name
                    break
                }
            }
        }
        return {
            component: Custom,
            text: text
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is responsible for handling when state changes in the rich text. The rich text changes as the user
     * types but the data doesn't propagate back down, it stays at this component.
     * 
     * @param {Object} data - The Rich text object data. It is complex, but you can look up the structure in RichText component
     * at `.createNewPage()` function
     */
    const onRichTextStateChange = (data) => {
        if (isMountedRef.current) {
            setTemplateData({
                ...templateData, 
                rich_text_page: {
                    ...data
                }
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Used for when the user changes the name of the template. It is mostly really simple, just changes the templateData state 
     * `name` parameter
     * 
     * @param {String} templateName - The new name of your template.
     */
    const onChangeTemplateName = (templateName) => {
        setTemplateData({
            ...templateData,
            name: templateName
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Submits the template data to the backend, when we submit we change the isSubmitting so 
     * the user cannot make any interaction on the buttons while it is loading.
     */
    const onSubmit = () => {
        setisSubmitting(true)
        props.onUpdateOrCreatePDFTemplateConfiguration({...templateData}).then(response => {
            if (([undefined, null].includes(response) || response.status !== 200) && isMountedRef.current) {
                if (response.data?.error?.reason && response.data.error.reason.includes('invalid_rich_text')) {
                    props.onAddNotification(strings['pt-br']['pdfGeneratorOnSubmitErrorMessage'], 'error')
                }
                setisSubmitting(false)
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMountedRef.current = true
        sourceRef.current = axios.CancelToken.source()
        setIsLoading(true)
        props.onGetPDFGeneratorTemplateConfiguration(sourceRef.current, props.formName, props.templateData.id).then(response => {
            if (response && response.status === 200) {
                setTemplateData(response.data.data)
            }
            setIsLoading(false)
        }).catch(__ => setIsLoading(false))

        return () => {
            isMountedRef.current = false
            if (sourceRef.current) { 
                sourceRef.current.cancel()
            }
        }   
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <Modal animationType="slide">
                {isUnmanagedFieldSelectorOpen ? (
                    <FieldSelectorOptionBox 
                    fieldOptions={props.formAndFieldOptions}
                    onClickOption={setUnmanagedFieldSelectedValue}
                    setIsUnmanagedFieldSelectorOpen={setIsUnmanagedFieldSelectorOpen}
                    />
                ) : null}
                <SafeAreaView>
                    <Styled.PDFGeneratorEditorButtonsContainer>
                        <Styled.PDFGeneratorCreatorEditorTemplateTitleInput value={templateData.name} onChange={(e) => onChangeTemplateName(e.nativeEvent.text)}/>
                        <Styled.PDFGeneratorCreatorEditorTemplateCancelButton onPress={e=>props.setSelectedTemplateIndex(null)}>
                            <FontAwesomeIcon icon={'times'} />
                        </Styled.PDFGeneratorCreatorEditorTemplateCancelButton>
                    </Styled.PDFGeneratorEditorButtonsContainer>
                    <Styled.PDFGeneratorCreatorEditorRichTextContainer
                    height={mobileWindowHeight}
                    >
                        {isLoading ? null : (
                            <React.Fragment>
                                {templateData?.rich_text_page ? (
                                    <RichText 
                                    initialText={strings['pt-br']['pdfGeneratorEditorRichTextInitialText']}
                                    initialData={templateData?.rich_text_page}
                                    allowedBlockTypeIds={props.allowedRichTextBlockIds}
                                    onStateChange={onRichTextStateChange}
                                    renderCustomContent={renderCustomContent} 
                                    handleUnmanagedContent={unmanaged} 
                                    onOpenUnmanagedContentSelector={setIsUnmanagedFieldSelectorOpen}
                                    isUnmanagedContentSelectorOpen={isUnmanagedFieldSelectorOpen}
                                    onChangeUnmanagedContentValue={setUnmanagedFieldSelectedValue}
                                    unmanagedContentValue={unmanagedFieldSelectedValue}
                                    />
                                ) : null }
                            </React.Fragment>
                        )}
                    </Styled.PDFGeneratorCreatorEditorRichTextContainer>
                </SafeAreaView>
            </Modal>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                <Styled.PDFGeneratorCreatorEditorTemplateTitleContainer>
                    <Styled.PDFGeneratorCreatorEditorTemplateTitleInput 
                    isValid={isValid('name', templateData.name)}
                    value={templateData.name} 
                    onChange={(e) => onChangeTemplateName(e.target.value)}/>
                </Styled.PDFGeneratorCreatorEditorTemplateTitleContainer>
                <Styled.PDFGeneratorEditorButtonsContainer> 
                    <Styled.PDFGeneratorCreatorEditorTemplateSaveButton
                    isValid={isValid('name', templateData.name)}
                    onClick={(e) => isSubmitting || !isValid('name', templateData.name)  ? null : onSubmit({...templateData})}
                    > 
                        {isSubmitting ? (
                            <Spinner animation="border" size="sm"/>
                        ): strings['pt-br']['pdfGeneratorEditorSaveButtonLabel']}
                    </Styled.PDFGeneratorCreatorEditorTemplateSaveButton>
                    <Styled.PDFGeneratorCreatorEditorTemplateCancelButton 
                    onClick={(e) => isSubmitting ? null : props.setSelectedTemplateIndex(null)}
                    >
                        {strings['pt-br']['pdfGeneratorEditorCancelButtonLabel']}
                    </Styled.PDFGeneratorCreatorEditorTemplateCancelButton>
                </Styled.PDFGeneratorEditorButtonsContainer>
                {isUnmanagedFieldSelectorOpen ? (
                    <FieldSelectorOptionBox 
                    fieldOptions={props.formAndFieldOptions}
                    top={unmanagedFieldSelectorPosition.y} 
                    left={unmanagedFieldSelectorPosition.x} 
                    onClickOption={setUnmanagedFieldSelectedValue}
                    />
                ) : ''}
                <Styled.PDFGeneratorCreatorEditorRichTextContainer>
                    {isLoading ? (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Spinner animation="border"/>
                        </div>
                    ) : (
                        <React.Fragment>
                            {templateData?.rich_text_page ? (
                                <RichText 
                                initialText={strings['pt-br']['pdfGeneratorEditorRichTextInitialText']}
                                initialData={templateData?.rich_text_page}
                                allowedBlockTypeIds={props.allowedRichTextBlockIds}
                                onStateChange={onRichTextStateChange}
                                renderCustomContent={renderCustomContent} 
                                handleUnmanagedContent={unmanaged} 
                                onOpenUnmanagedContentSelector={setIsUnmanagedFieldSelectorOpen}
                                isUnmanagedContentSelectorOpen={isUnmanagedFieldSelectorOpen}
                                onChangeUnmanagedContentValue={setUnmanagedFieldSelectedValue}
                                unmanagedContentValue={unmanagedFieldSelectedValue}
                                />
                            ) : ''}
                        </React.Fragment>
                    )}
                </Styled.PDFGeneratorCreatorEditorRichTextContainer>
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreatorEditor