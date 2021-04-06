import React, { useState, useEffect } from 'react'
import { View, Text, Animated } from 'react-native'
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PDFGeneratorCreatorEditor from './PDFGeneratorCreatorEditor'
import Alert from '../Utils/Alert'
import dynamicImport from '../../utils/dynamicImport'
import { paths, strings } from '../../utils/constants'
import {
    PDFGeneratorCreatorButtonsContainer,
    PDFGeneratorCreatorGoBackButton,
    PDFGeneratorCreatorCreateNewButton,
    PDFGeneratorCreatorCreateNewButtonLabel,
    PDFGeneratorCreatorTemplateTitle,
    PDFGeneratorCreatorEditTemplateButton,
    PDFGeneratorCreatorRemoveTemplateButton,
    PDFGeneratorCreatorTemplateCardContainer,
    PDFGeneratorCreatorTemplatesContainer,
    PDFGeneratorGetMoreTemplatesButton,
    PDFGeneratorGetMoreTemplatesButtonContainer
} from '../../styles/PDFGenerator'

const Swipeable = dynamicImport('react-native-gesture-handler', 'Swipeable')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component is responsible for holding the data of all of the pdf templates. And we use this data
 * to show a list of templates to the user.
 * 
 * @param {String} formName - The name of the current selected formulary, this is usully recieved from the url
 * @param {Object} cancelToken - A axios cancel token. We use this so we can cancel a request and the promise when the user unmounts a component,
 * before the data is retrieved
 * @param {Array<Object>} templates - An array of templates that the user had created. This is recieved from the redux state
 * @param {Function} onGetPDFGeneratorTemplatesConfiguration - A redux function used for getting all of the templates the user had created
 * @param {Function} onCreatePDFGeneratorTemplateConfiguration - A redux function used for saving the template data on the backend
 * @param {Function} onUpdatePDFGeneratorTemplateConfiguration - A redux function used for updating a template data on the backend
 * @param {Function} onRemovePDFGeneratorTemplateConfiguration - A redux function used for removing a template from the backend, this is used
 * when the user press delete.
 * @param {Function} onGetPDFGeneratorTempalatesConfigurationFieldOptions - A redux action function used for retrieving all of options the user
 * can select inside of the rich text
 * @param {Array<BigInteger} allowedRichTextBlockIds - All of the blockTypeIds that are allowed to exist in the pdf template.
 * @param {Function} onAddNotification - When the user is trying to create a pdf template but face an error. We need to add a notification
 * for the user
 */
const PDFGeneratorCreator = (props) => {
    const sourceRef = React.useRef()
    const formNameRef = React.useRef('')
    const [page, setPage] = useState({
        current: 1,
        total: 1
    })
    const [isLoading, setIsLoading] = useState(false)
    const [templateIndexToRemove, setTemplateIndexToRemove] = useState(null)
    const [formAndFieldOptions, setFormAndFieldOptions] = useState([])
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null)
    // ------------------------------------------------------------------------------------------
    /**
     * This is used when rendering the `PDFGeneratorCreatorEditor` component, with this we get the templateData to send to the child component.
     * Since we open the `PDFGeneratorCreatorEditor` component by selecting which index of the 'props.templates' we have selected, this function
     * tries to return the template of the selectedIndex. If the index is not null but does not exist in the `props.templates` array we return a
     * new PDFTemplate configuration object.
     */
    const getTemplateData = () => {
        return [undefined, null].includes(props.templates[selectedTemplateIndex]) ? addNewPDFTemplateConfiguration() : props.templates[selectedTemplateIndex]
    }
    // ------------------------------------------------------------------------------------------
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
    // ------------------------------------------------------------------------------------------
    /**
     * Fires when the user clicks cancel on this page, we return the user to an empty page so it automatically returns the user to the page
     * he was in. We actually don't need this.
     */
    const onClickCancel = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.empty().asUrl, paths.empty().asUrl,{ shallow: true })
        }
    }
    // ------------------------------------------------------------------------------------------
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
            props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName, 1).then(response => {
                if (response && response.status === 200) {
                    setPage(response.data.pagination)
                }
            })
        }
        return response
    }
    // ------------------------------------------------------------------------------------------
    /**
     * We only load 5 templates, so we display a button to load more templates in the bottom of the list.
     * This handles when the user clicks to load more template.
     */
    const onClickLoadMoreButton = () => {
        const newPage = page.current + 1
        if (newPage <= page.total) {
            setIsLoading(true)
            props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName, newPage).then(response => {
                if (response && response.status === 200) {
                    setPage(response.data.pagination)
                } 
                setIsLoading(false)
            }).catch(__ => setIsLoading(false))
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Removes a PDF Template from the backend by its id, after the PDFTemplate was removed we load the list of templates again.
     * 
     * @param {BigInteger} pdfTemplateConfigurationId - The template id you want to remove.
     */
    const onRemovePDFTemplateConfiguration = () => {
        const pdfTemplateConfigurationId = props.templates[templateIndexToRemove].id
        props.onRemovePDFGeneratorTemplateConfiguration(props.formName, pdfTemplateConfigurationId).then(response => {
            if (response && response.status === 200) {
                props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName, 1).then(response => {
                    if (response && response.status === 200) {
                        setPage(response.data.pagination)
                    }
                })
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // When the user opens this component we get all of the template configuration for the current formName
        // Not only this, we also get all of the field options the user can select as variables.
        sourceRef.current = props.cancelToken.source()
        formNameRef.current = props.formName
        setIsLoading(true)
        props.onGetPDFGeneratorTemplatesConfiguration(sourceRef.current, props.formName, 1).then(response => {
            if (response && response.status === 200) {
                setPage(response.data.pagination)
                props.onGetPDFGeneratorTempalatesConfigurationFieldOptions(sourceRef.current, props.formName).then(response => {
                    if (response && response.status === 200) {
                        setFormAndFieldOptions(response.data.data)
                    }
                    setIsLoading(false)
                }).catch(__ => {
                    setIsLoading(false)
                })
            } else {
                setIsLoading(false)
            }
        }).catch(__ => {
            setIsLoading(false)
        })

        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
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
                    onGetPDFGeneratorTemplateConfiguration={props.onGetPDFGeneratorTemplateConfiguration}
                    formName={props.formName}
                    allowedRichTextBlockIds={props.allowedRichTextBlockIds}
                    formAndFieldOptions={formAndFieldOptions}
                    templateData={getTemplateData()}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onUpdateOrCreatePDFTemplateConfiguration={onUpdateOrCreatePDFTemplateConfiguration}
                    />
                ) : (
                    <View style={{ height: '100%'}}>
                        <PDFGeneratorCreatorCreateNewButton onPress={(e) => setSelectedTemplateIndex(props.templates.length)}>
                            <PDFGeneratorCreatorCreateNewButtonLabel>
                                {'+'}
                            </PDFGeneratorCreatorCreateNewButtonLabel>
                        </PDFGeneratorCreatorCreateNewButton>
                        <PDFGeneratorCreatorTemplatesContainer>
                            {props.templates.map((pdfTemplate, index) => (
                                <Swipeable 
                                key={pdfTemplate.id}
                                friction={2}
                                rightThreshold={40}
                                renderRightActions={(progress, dragX) => {
                                    return (
                                        <View style={{ width: 70, flexDirection: 'row' }}>
                                            <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }]}}>
                                                <PDFGeneratorCreatorRemoveTemplateButton
                                                onPress={(e)=> setTemplateIndexToRemove(index)}
                                                >
                                                    <FontAwesomeIcon icon={'trash'}/>
                                                </PDFGeneratorCreatorRemoveTemplateButton>
                                            </Animated.View>
                                        </View>
                                    )
                                }}
                                >
                                    <PDFGeneratorCreatorTemplateCardContainer>
                                        <PDFGeneratorCreatorEditTemplateButton onPress={(e)=> setSelectedTemplateIndex(index)}>
                                            <PDFGeneratorCreatorTemplateTitle>
                                                {pdfTemplate.name}
                                            </PDFGeneratorCreatorTemplateTitle>
                                        </PDFGeneratorCreatorEditTemplateButton>

                                    </PDFGeneratorCreatorTemplateCardContainer>
                                </Swipeable>
                            ))}
                        </PDFGeneratorCreatorTemplatesContainer>
                    </View>
                )}
            </View>
        )
    }
    //########################################################################################//
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
                    formName={props.formName}
                    onGetPDFGeneratorTemplateConfiguration={props.onGetPDFGeneratorTemplateConfiguration}
                    onAddNotification={props.onAddNotification}
                    allowedRichTextBlockIds={props.allowedRichTextBlockIds}
                    formAndFieldOptions={formAndFieldOptions}
                    templateData={getTemplateData()}
                    setSelectedTemplateIndex={setSelectedTemplateIndex}
                    onUpdateOrCreatePDFTemplateConfiguration={onUpdateOrCreatePDFTemplateConfiguration}
                    />
                ) : (
                    <div>
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
                        <PDFGeneratorCreatorTemplatesContainer>
                            {isLoading && (props.templates.length === 0 || formNameRef.current !== props.formName) ? (
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0dbf7e', marginTop: '10px'}}>
                                    <Spinner animation="border"/>
                                </div>
                            ) : props.templates.map((pdfTemplate, index) => (
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
                            {page.current < page.total ? (
                                <PDFGeneratorGetMoreTemplatesButtonContainer>
                                    {isLoading ? (
                                        <Spinner animation="border"/>
                                    ) : (
                                        <PDFGeneratorGetMoreTemplatesButton
                                        onClick={(e) => onClickLoadMoreButton()} 
                                        >
                                            {strings['pt-br']['pdfGeneratorLoadMoreButtonLabel']}
                                        </PDFGeneratorGetMoreTemplatesButton>
                                    )}
                                </PDFGeneratorGetMoreTemplatesButtonContainer>
                            ) : ''}
                        </PDFGeneratorCreatorTemplatesContainer>
                    </div>
                )}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorCreator