import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import RichText from '../RichText'
import FieldSelectorOptionBox from './FieldSelectorOptionBox'
import { strings } from '../../utils/constants'
import { 
    PDFGeneratorCreatorTemplateTitleContainer,
    PDFGeneratorCreatorEditorButtonsContainer,
    PDFGeneratorCreatorEditorTemplateCancelButton,
    PDFGeneratorCreatorEditorTemplateSaveButton,
    PDFGeneratorCreatorEditorTemplateTitleInput,
    PDFGeneratorCreatorEditorCustomContent,
    PDFGeneratorCreatorEditorRichTextContainer
} from '../../styles/PDFGenerator'


const Custom = (props) => {
    return (
        <PDFGeneratorCreatorEditorCustomContent
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
        </PDFGeneratorCreatorEditorCustomContent>
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
 */
const PDFGeneratorCreatorEditor = (props) => {
    const [templateData, setTemplateData] = useState({...props.templateData})
    const [unmanagedFieldSelectedValue, setUnmanagedFieldSelectedValue] = useState(null)
    const [isUnmanagedFieldSelectorOpen, setIsUnmanagedFieldSelectorOpen] = useState(false)
    const [unmanagedFieldSelectorPosition, setUnmanagedFieldSelectorPosition] = useState({
        x: 0,
        y: 0
    })
    // we use this to tell the rich text that when the user types this character we will handle the insertion of the content on this component and not
    // on the rich text itself
    const unmanaged = {
        '@': setUnmanagedFieldSelectorPosition
    }

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
                if (props.formAndFieldOptions[formIndex].form_fields[fieldIndex].id.toString() === content.custom_value) {
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
    
    /**
     * This function is responsible for handling when state changes in the rich text. The rich text changes as the user
     * types but the data doesn't propagate back down, it stays at this component.
     * 
     * @param {Object} data - The Rich text object data. It is complex, but you can look up the structure in RichText component
     * at `.createNewPage()` function
     */
    const onRichTextStateChange = (data) => {
        setTemplateData({
            ...templateData, 
            rich_text_page: {
                ...data
            }
        })
    }

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
    
    /**
     * When we remove a unmanaged variable in the rich text it can notify the upper component about the removal by `onRemoveUnmanagedContent` props, that's why this is for.
     * This way we can remove the variable from the template_configuration_variables. Obviously we cannot track the order on the variables. So the order of the variables actually
     * doesn't matter much here. We use this for optimizations in the backend.
     * 
     * @param {Array<Object>} contents - This is an array of contents of all of the custom contents removed from the Rich Text
     */
    const onRemoveVariable = (contents) => {
        contents.forEach(content => {
            const indexToRemove = templateData.template_configuration_variables.findIndex(configurationVariable => configurationVariable.field.toString() === content.custom_value.toString())
            templateData.template_configuration_variables.splice(indexToRemove, 1)
        })
        setTemplateData({
            ...templateData,
            template_configuration_variables: [...templateData.template_configuration_variables]
        })
    }
    
    /**
     * Really similar to onRemoveVariable, excepts this is fired when the user adds a new variable on the rich text. As said in `onRemoveVariable`
     * The order here doesn't matter
     * 
     * @param {BigInteger} fieldId - The id of the field you are adding as a variable.
     */
    const onAddVariable = (fieldId) => {
        setUnmanagedFieldSelectedValue(fieldId)
        setTemplateData({
            ...templateData,
            template_configuration_variables: templateData.template_configuration_variables.concat({id:null, field: fieldId})
        })
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <PDFGeneratorCreatorTemplateTitleContainer>
                    <PDFGeneratorCreatorEditorTemplateTitleInput value={templateData.name} onChange={(e) => onChangeTemplateName(e.target.value)}/>
                </PDFGeneratorCreatorTemplateTitleContainer>
                <PDFGeneratorCreatorEditorButtonsContainer> 
                    <PDFGeneratorCreatorEditorTemplateSaveButton 
                    onClick={(e) => props.onUpdateOrCreatePDFTemplateConfiguration({...templateData})}
                    > 
                        {strings['pt-br']['pdfGeneratorEditorSaveButtonLabel']}
                    </PDFGeneratorCreatorEditorTemplateSaveButton>
                    <PDFGeneratorCreatorEditorTemplateCancelButton 
                    onClick={(e) => props.setSelectedTemplateIndex(null)}
                    >
                        {strings['pt-br']['pdfGeneratorEditorCancelButtonLabel']}
                    </PDFGeneratorCreatorEditorTemplateCancelButton>
                </PDFGeneratorCreatorEditorButtonsContainer>
                {isUnmanagedFieldSelectorOpen ? (
                    <FieldSelectorOptionBox 
                    fieldOptions={props.formAndFieldOptions}
                    top={unmanagedFieldSelectorPosition.y} 
                    left={unmanagedFieldSelectorPosition.x} 
                    onClickOption={onAddVariable}
                    />
                ) : ''}
                <PDFGeneratorCreatorEditorRichTextContainer>
                    <RichText 
                    initialData={props.templateData?.rich_text_page}
                    onStateChange={onRichTextStateChange}
                    renderCustomContent={renderCustomContent} 
                    onRemoveUnmanagedContent={onRemoveVariable}
                    handleUnmanagedContent={unmanaged} 
                    onOpenUnmanagedContentSelector={setIsUnmanagedFieldSelectorOpen}
                    isUnmanagedContentSelectorOpen={isUnmanagedFieldSelectorOpen}
                    onChangeUnmanagedContentValue={setUnmanagedFieldSelectedValue}
                    unmanagedContentValue={unmanagedFieldSelectedValue}
                    />
                </PDFGeneratorCreatorEditorRichTextContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreatorEditor