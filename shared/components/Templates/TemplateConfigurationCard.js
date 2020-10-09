import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import TemplateConfigurationForm from './TemplateConfigurationForm'
import Alert from '../Utils/Alert'
import { types, strings } from '../../utils/constants'
import {
    TemplatesConfigurationCardContainer,
    TemplatesConfigurationCardLabel,
    TemplatesConfigurationCardContainerHeader,
    TemplatesConfigurationCardHeaderButton
} from '../../styles/Templates'

/**
 * This component is each template card. Each template card has it's own formulary.
 * This component holds the state that opens and closes the formulary. 
 * 
 * Otherwise it is just a simple square representing each template in the grid of templates.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} templateConfiguration - The template configuration data object. You might want to see `getNewTempalteConfigurationData` function on
 * TemplateConfiguration component to see what this looks like.
 * @param {Object} dependentForms - This is a object recieved from the backend, it contains the dependent formularies as keys and the dependencies it has
 * as an array of values on each key. So the keys are formularies ids that have `form` field types, and the ids in the array of each key is the id of
 * the formulary it depends on.
 * @param {Array<Object>} formulariesOptions - Recieves an formatted array of objects. This object follows the Select component guidelines. Each object has a
 * `value` key with ids, and a `label` with the formulary label_name.
 * * @param {Function} onChangeTemplateConfigurationData - Used for changing the template configuration state. This changes the object state at a specific index
 * that is used by this component. So this function only is used to change the state of the data, this does not send the data to the backend or something
 * like this.
 * @param {Function} onCreateOrUpdateTemplateConfiguration - Used for creating or updating a template configuration, this is used for SUBMITTING the data
 * to the backend. This actually doesn't change the state.
 * @param {Function} onRemoveTemplateConfiguration - Removes a template. This function is a function on TemplateConfiguration that actually calls an redux action
 * to remove the formulary. We use this because first, to remove template we need the index of this template on the array. Another reason is because
 * when we call this function we need to check if the templateConfiguration object has an id defined or not. If it has we send a delete request to the backend
 * to delete the template and also remove from the array in the state. Otherwise, just removes the element from the array.
 */
const TemplateConfigurationCard = (props) => {
    const [showAlert, setShowAlert] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const templateThemeType = props.types?.defaults?.theme_type ? props.types.defaults.theme_type.filter(themeType => themeType.id === props.templateConfiguration.theme_type) : []

    const renderMobile = () => {
        return (
            <View>
                <Alert 
                alertTitle={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertTitle']} 
                alertMessage={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertMessage']} 
                show={showAlert} 
                onHide={() => {
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    props.onRemoveTemplateConfiguration()
                }}
                onAcceptButtonLabel={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertAcceptButton']}
                />
                <TemplatesConfigurationCardContainer>
                    <TemplatesConfigurationCardContainerHeader>
                        <TemplatesConfigurationCardHeaderButton onPress={e=> setIsFormOpen(true)}>
                            <FontAwesomeIcon icon={'pencil-alt'}/>
                        </TemplatesConfigurationCardHeaderButton>
                        <TemplatesConfigurationCardHeaderButton onPress={e=> setShowAlert(true)}>
                            <FontAwesomeIcon icon={'trash'}/>
                        </TemplatesConfigurationCardHeaderButton>
                    </TemplatesConfigurationCardContainerHeader>
                    <TemplatesConfigurationCardLabel isEmpty={['', null].includes(props.templateConfiguration.display_name)}>
                        {['', null].includes(props.templateConfiguration.display_name) ? 
                        strings['pt-br']['templateConfigurationCardEmptyCardTitleLabel'] : 
                        props.templateConfiguration.display_name}
                    </TemplatesConfigurationCardLabel>
                    {templateThemeType.length > 0 ? (
                        <Text>
                            {types('pt-br', 'theme_type', templateThemeType[0].name)}
                        </Text>
                    ): null}
                </TemplatesConfigurationCardContainer>
                {isFormOpen ? (
                    <TemplateConfigurationForm 
                    types={props.types}
                    templateConfiguration={props.templateConfiguration}
                    onChangeTemplateConfigurationData={props.onChangeTemplateConfigurationData}
                    onCreateOrUpdateTemplateConfiguration={props.onCreateOrUpdateTemplateConfiguration}
                    dependentForms={props.dependentForms}
                    formulariesOptions={props.formulariesOptions}
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                    />
                ): null}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Alert 
                alertTitle={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertTitle']} 
                alertMessage={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertMessage']} 
                show={showAlert} 
                onHide={() => {
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    props.onRemoveTemplateConfiguration()
                }}
                onAcceptButtonLabel={strings['pt-br']['templateConfigurationCardRemoveTemplateAlertAcceptButton']}
                />
                <TemplatesConfigurationCardContainer>
                    <TemplatesConfigurationCardContainerHeader>
                        <TemplatesConfigurationCardHeaderButton onClick={e=> setIsFormOpen(true)}>
                            <FontAwesomeIcon icon={'pencil-alt'}/>
                        </TemplatesConfigurationCardHeaderButton>
                        <TemplatesConfigurationCardHeaderButton onClick={e=> setShowAlert(true)}>
                            <FontAwesomeIcon icon={'trash'}/>
                        </TemplatesConfigurationCardHeaderButton>
                    </TemplatesConfigurationCardContainerHeader>
                    <TemplatesConfigurationCardLabel isEmpty={['', null].includes(props.templateConfiguration.display_name)}>
                        {['', null].includes(props.templateConfiguration.display_name) ? 
                        strings['pt-br']['templateConfigurationCardEmptyCardTitleLabel'] : 
                        props.templateConfiguration.display_name}
                    </TemplatesConfigurationCardLabel>
                    {templateThemeType.length > 0 ? (
                        <small>
                            {types('pt-br', 'theme_type', templateThemeType[0].name)}
                        </small>
                    ): ''}
                </TemplatesConfigurationCardContainer>
                <TemplateConfigurationForm 
                types={props.types}
                templateConfiguration={props.templateConfiguration}
                onChangeTemplateConfigurationData={props.onChangeTemplateConfigurationData}
                onCreateOrUpdateTemplateConfiguration={props.onCreateOrUpdateTemplateConfiguration}
                dependentForms={props.dependentForms}
                formulariesOptions={props.formulariesOptions}
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                />
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfigurationCard