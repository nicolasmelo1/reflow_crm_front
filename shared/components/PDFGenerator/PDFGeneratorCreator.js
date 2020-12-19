import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PDFGeneratorCreatorEditor from './PDFGeneratorCreatorEditor'
import Alert from '../Utils/Alert'
import { paths, strings } from '../../utils/constants'
import {
    PDFGeneratorCreatorButtonsContainer,
    PDFGeneratorCreatorGoBackButton,
    PDFGeneratorCreatorCreateNewButton,
    PDFGeneratorCreatorTemplateTitle,
    PDFGeneratorCreatorEditTemplateButton,
    PDFGeneratorCreatorRemoveTemplateButton,
    PDFGeneratorCreatorTemplateCardContainer,
    PDFGeneratorCreatorTemplatesContainer
} from '../../styles/PDFGenerator'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorCreator = (props) => {
    const sourceRef = React.useRef()
    const [templateIndexToRemove, setTemplateIndexToRemove] = useState(null)
    const [formAndFieldOptions, setFormAndFieldOptions] = useState([])
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(-1/*null*/)
    
    /**
     * This is used when rendering the `PDFGeneratorCreatorEditor` component, with this we get the templateData to send to the child component.
     * Since we open the `PDFGeneratorCreatorEditor` component by selecting which index of the 'props.templates' we have selected, this function
     * tries to return the template of the selectedIndex. If the index is not null but does not exist in the `props.templates` array we return a
     * new PDFTemplate configuration object.
     */
    const getTemplateData = () => {
        return [undefined, null].includes(props.templates[selectedTemplateIndex]) ? addNewPDFTemplateConfiguration() : props.templates[selectedTemplateIndex]
    }
    
    /**
     * When the user want to create a new Template Configuration we need to return this object. Remember that we open the `PDFGeneratorCreator` 
     * by defining the selected templateconfiguration index? If we set a index that does not exist in the props.templates array we will create
     * this new PDFTemplate configuration using the data retrieved from this function
     * 
     * @returns {Object} - Returns an object with the template configuration data.
     */
    const addNewPDFTemplateConfiguration = () => ({
        id: null,
        name: strings['pt-br']['pdfGeneratorEditorNewTemplateTitle'],
        form: null,
        template_configuration_variables: [],
        rich_text_page: null
    })

    /**
     * Fires when the user clicks cancel on this page, we return the user to an empty page so it automatically returns the user to the page
     * he was in. We actually don't need this.
     */
    const onClickCancel = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.empty().asUrl, paths.empty().asUrl,{ shallow: true })
        }
    }

    /**
     * Function responsible for creating or updating a PDF template configuration.
     * `templateConfigurationData` is the template data it is used for sending to the backend.
     * This function is used inside `PDFGeneratorCreatorEditor` component when saving a template.
     * If the object has de `id` key and it is not null we update the template configuration, otherwise we
     * just create a new template.
     * 
     * @param {Object} templateConfigurationData - The template configuration data we want to save on the backend.
     */
    const onUpdateOrCreatePDFTemplateConfiguration = async (templateConfigurationData) => {
        let response = null
        if (templateConfigurationData.id === null) {
            response = await props.onCreatePDFGeneratorTemplateConfiguration(templateConfigurationData, props.formName)
        } else {
            response = await props.onUpdatePDFGeneratorTemplateConfiguration(templateConfigurationData, props.formName, templateConfigurationData.id)
        }
        if (response && response.status === 200) {
            setSelectedTemplateIndex(null)
            props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName)
        }
        return response
    }

    /**
     * Removes a PDF Template from the backend by its id, after the PDFTemplate was removed we load the list of templates again.
     * 
     * @param {BigInteger} pdfTemplateConfigurationId - The template id you want to remove.
     */
    const onRemovePDFTemplateConfiguration = () => {
        const pdfTemplateConfigurationId = props.templates[templateIndexToRemove].id
        props.onRemovePDFGeneratorTemplateConfiguration(props.formName, pdfTemplateConfigurationId).then(response => {
            if (response && response.status === 200) {
                props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName)
            }
        })
    }


    useEffect(() => {
        // When the user opens this component we get all of the template configuration for the current formName
        // Not only this, we also get all of the field options the user can select as variables.
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName)
        props.onGetPDFGeneratorTempalatesConfigurationFieldOptions(sourceRef.current, props.formName).then(response => {
            if (response && response.status === 200) {
                setFormAndFieldOptions(response.data.data)
            }
        })
        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View>
                {templateIndexToRemove !== null ? (
                    <Alert 
                    alertTitle={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertTitle']} 
                    alertMessage={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertMessage']} 
                    show={templateIndexToRemove !== null} 
                    onHide={() => {
                        setTemplateIndexToRemove(null)
                    }} 
                    onAccept={() => {
                        setTemplateIndexToRemove(null)
                        onRemovePDFTemplateConfiguration()
                    }}
                    onAcceptButtonLabel={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertAcceptButtonLabel']}
                    />
                ) : null}
                {selectedTemplateIndex !== null ? (
                    <PDFGeneratorCreatorEditor
                    formAndFieldOptions={formAndFieldOptions}
                    templateData={getTemplateData()}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onUpdateOrCreatePDFTemplateConfiguration={onUpdateOrCreatePDFTemplateConfiguration}
                    />
                ) : (
                    <PDFGeneratorCreatorTemplatesContainer>
                        {props.templates.map((pdfTemplate, index) => (
                            <PDFGeneratorCreatorTemplateCardContainer key={pdfTemplate.id}>
                                <PDFGeneratorCreatorEditTemplateButton onPress={(e)=> setSelectedTemplateIndex(index)}>
                                    <PDFGeneratorCreatorTemplateTitle>
                                        {pdfTemplate.name}
                                    </PDFGeneratorCreatorTemplateTitle>
                                </PDFGeneratorCreatorEditTemplateButton>
                                <PDFGeneratorCreatorRemoveTemplateButton 
                                onClick={(e)=> setTemplateIndexToRemove(index)}
                                >
                                    <FontAwesomeIcon icon={'trash'}/>
                                </PDFGeneratorCreatorRemoveTemplateButton>
                            </PDFGeneratorCreatorTemplateCardContainer>
                        ))}
                    </PDFGeneratorCreatorTemplatesContainer>
                )}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {templateIndexToRemove !== null ? (
                    <Alert 
                    alertTitle={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertTitle']} 
                    alertMessage={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertMessage']} 
                    show={templateIndexToRemove !== null} 
                    onHide={() => {
                        setTemplateIndexToRemove(null)
                    }} 
                    onAccept={() => {
                        setTemplateIndexToRemove(null)
                        onRemovePDFTemplateConfiguration()
                    }}
                    onAcceptButtonLabel={strings['pt-br']['pdfGeneratorOnRemoveTemplateAlertAcceptButtonLabel']}
                    />
                ) : ''}
                {selectedTemplateIndex !== null ? (
                    <PDFGeneratorCreatorEditor
                    formAndFieldOptions={formAndFieldOptions}
                    templateData={getTemplateData()}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onUpdateOrCreatePDFTemplateConfiguration={onUpdateOrCreatePDFTemplateConfiguration}
                    />
                ) : (
                    <PDFGeneratorCreatorTemplatesContainer>
                        <PDFGeneratorCreatorButtonsContainer>
                            <PDFGeneratorCreatorGoBackButton onClick={(e) => onClickCancel()}>
                                {strings['pt-br']['pdfGeneratorCreatorGoBackButtonLabel']}
                            </PDFGeneratorCreatorGoBackButton>
                            <PDFGeneratorCreatorCreateNewButton
                            onClick={(e) => setSelectedTemplateIndex(props.templates.length)}
                            >
                                {strings['pt-br']['pdfGeneratorCreatorCreateNewButtonLabel']}
                            </PDFGeneratorCreatorCreateNewButton>
                        </PDFGeneratorCreatorButtonsContainer>
                        <div>
                            {props.templates.map((pdfTemplate, index) => (
                                <PDFGeneratorCreatorTemplateCardContainer key={pdfTemplate.id}>
                                    <PDFGeneratorCreatorTemplateTitle>
                                        {pdfTemplate.name}
                                    </PDFGeneratorCreatorTemplateTitle>

                                    <div>
                                        <PDFGeneratorCreatorEditTemplateButton 
                                        onClick={(e)=> setSelectedTemplateIndex(index)}
                                        >
                                            <FontAwesomeIcon icon={'pencil-alt'}/>
                                        </PDFGeneratorCreatorEditTemplateButton>
                                        <PDFGeneratorCreatorRemoveTemplateButton 
                                        onClick={(e)=> setTemplateIndexToRemove(index)}
                                        >
                                            <FontAwesomeIcon icon={'trash'}/>
                                        </PDFGeneratorCreatorRemoveTemplateButton>
                                    </div>
                                </PDFGeneratorCreatorTemplateCardContainer>
                            ))}
                        </div>
                    </PDFGeneratorCreatorTemplatesContainer>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreator