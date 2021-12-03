import React, { useEffect, useState, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Modal } from 'react-native'
import { types, strings } from '../../utils/constants'
import TemplatePreview from './TemplatePreview'
import { 
    TemplatesContainer, 
    TemplatesGoBackButton, 
    TemplatesHeader, 
    TemplatesSelectionContainer,
    TemplatesSelectionCard,
    TemplatesSelectionText,
    TemplatesContentContainer,
    TemplatesTemplateTypeSelectionContainer,
    TemplatesTemplateTypeSelectionTitle,
    TemplatesTypeSelectionButtonsContainer,
    TemplatesTypeSelectionButtons,
    TemplatesTypeSelectionButtonsText,
    TemplatesTemplateFilterTypeButtonsContainer,
    TemplatesTemplateFilterTypeButtonsText,
    TemplatesTemplateFilterTypeButtons
} from '../../styles/Templates'

/**
 * This component is responsible for displaying to the user a screen so he can select and preview
 * templates.
 * 
 * To create pages/formularies the user needs to do it inside of a group/template (the ones that show in the sidebar).
 * 
 * This component is responsible for showing the user an intuitive interface so he can select the templates
 * he wants to use. We separate templates by two dimensions: 
 * 
 * - First are 3 big groups: `Reflow`, `Community` and `Company`. The first are templates created and mantained by reflow,
 * so templates that have been created by `reflow@reflow.com.br` account. The second are templates created and mantained by
 * the users of reflow, those are templates that the user set to be PUBLIC. And the last is templates from and for the company
 * that are not set to be public.
 * 
 * - Second there are the theme_types: `Design`, `HR`, `Marketing`, `Sales` and so on. We separate each template on common cases 
 * the users might use our platform for.
 * 
 * This needs to be really intuitive because it always show on the onboarding, after the user makes his first sign-in, this
 * component is loaded before he is able to do any action in the platform.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff.
 * @param {Array<Object>} groups - An array of objects, this is the state data that is used to load the sidebar data.
 * So each data in the array are the group and inside of each group there are the formularies it contains.
 * @param {Array<Object>} templates - This array contains each of the templates that we display to the user for selection.
 * Those templates are the templates of the "Big Groups" and from each theme type.
 * @param {Object} loadedTemplate - The loaded template data. This data holds stuff like description, the form_ids it contains
 * and so on.
 * @param {Object} source - This is actually an axios source that holds a token, every request we make will have this source.
 * this way we can cancel a request if the user unmounts a company or on other ocasions.
 * @param {Object} cancelToken - A axios cancel token. We use this so we can cancel a request and the promise when the user unmounts a component,
 * before the data is retrieved
 * @param {Function} onGetForms - A redux action function used to retrieve the formularies that is used on the sidebar (this retrieves
 * the `groups` data)
 * @param {Function} onGetTemplate - A redux action function used to retrive the `loadedTemplate` data.
 * @param {Function} onGetTemplateFormulary - A redux action function used to retrieve the data of a theme formulary. This way
 * we can preview the formulary to the user before selection.
 * @param {Function} onGetTemplates - A redux action function to retrieve the `templates` data.
 * @param {Function} onSelectTemplate - A redux action function that does not change the state, instead it just "tells" the backend
 * which theme has been select so it can begin constructing the data for the user based on the templates.
 * @param {Function} setAddTemplates - This is not a redux function, this function needs to be set on the parent component that uses 
 * this component. (not the Template component, the parent of Template component) We need this because we mount this component
 * on the hole screen, so every other component is unmounted when TemplateSelect is mounted.
 */
const TemplateSelect = (props) => {
    const [selectedThemeType, setSelectedThemeType] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState(-1)

    /**
     * Function used to change the selected template. selectedTemplate state
     * holds the id of the template. When the selectedTemplate is -1 there is no template
     * selected.
     * 
     * @param {BigInteger} selectedTemplateId - The id of the selected template or -1 if no template is selected.
     */
    const onChangeSelectedTemplate = (selectedTemplateId) => {
        selectedTemplateId = (selectedTemplate === selectedTemplateId) ? -1 : selectedTemplateId
        setSelectedTemplate(selectedTemplateId)
    }

    /**
     * Function responsible to change the theme_type. Theme types holds the type of the theme.
     * Can be something like `design`, 'marketing' and so on. So, theme types are groups of themes
     * that defines for what area or activity this template is for.
     * 
     * When the user defines a new theme_type obviosly we get net data from the backend.
     * 
     * @param {BigInteger} themeTypeId - The id of the selected theme type.
     */
    const onChangeSelectedThemeType = (themeTypeId) => {
        if (selectedThemeType !== themeTypeId) {
            props.onGetTemplates(props.source, themeTypeId, 1, 'reflow')
            setSelectedThemeType(themeTypeId)
        }
    }

    /**
     * This function is used to check if the sidebar has already been loaded or not.
     * 
     * If the sidebar have already been loaded then we don't need to retrieve the templates/sidebar data
     * otherwise e load all of the formularies the user has access to.
     */
    const isInitialDefined = () => {
        return props.groups.length > 0 
    }

    /**
     * Check if theme_type object exists. Since it retrive the types on login and also the templates opens
     * on login. we need to check if the types was already been retrieved.
     */
    const isThemeTypesDefined = () => {
        return props.types && props.types.defaults && props.types.defaults.theme_type
    }

    useEffect(() => {
        // when we mount this component we first select the first theme_type we find
        // Then if the sidebar hasn't been loaded we retrieve the formularies the user 
        // has access to again
        if (isThemeTypesDefined() && props.types.defaults.theme_type.length > 0) {
            const selected = props.types.defaults.theme_type[0].name
            onChangeSelectedThemeType(selected)
        }
        if (!isInitialDefined()) {
            props.onGetForms(props.source)
        }
    }, [])

    const renderMobile = () => {
        return (
            <Modal
            animationType="slide"
            >
                <TemplatesContainer>
                    {selectedTemplate !== -1 ? (
                        <TemplatePreview 
                        groups={props.groups}
                        data={props.loadedTemplate}
                        cancelToken={props.cancelToken}
                        onGetTemplate={props.onGetTemplate}
                        selectedTemplateId={selectedTemplate} 
                        onSelectTemplate={props.onSelectTemplate}
                        setAddTemplates={props.setAddTemplates}
                        onChangeSelectedTemplate={onChangeSelectedTemplate}
                        onGetTemplateFormulary={props.onGetTemplateFormulary}
                        />
                    ) : null}
                    <TemplatesHeader>
                        {props.groups.length > 0 ? (
                            <TemplatesGoBackButton onPress={e=>props.setAddTemplates(false)}>
                                <FontAwesomeIcon icon={'times'} />
                            </TemplatesGoBackButton>
                        ) : null}
                    </TemplatesHeader>
                    <TemplatesContentContainer>
                        <TemplatesTemplateTypeSelectionContainer>
                            <TemplatesTemplateTypeSelectionTitle>
                                {strings['pt-br']['templateTypeSelectionTitleLabel']}
                            </TemplatesTemplateTypeSelectionTitle>
                            {/*
                            <TemplatesTemplateFilterTypeButtonsContainer>
                                {['reflow', 'community', 'company'].map((templateFilterType, index)=> (
                                    <TemplatesTemplateFilterTypeButtons key={index}>
                                        <TemplatesTemplateFilterTypeButtonsText>
                                            {templateFilterType}
                                        </TemplatesTemplateFilterTypeButtonsText>
                                    </TemplatesTemplateFilterTypeButtons>
                                ))}
                            </TemplatesTemplateFilterTypeButtonsContainer>
                            */}
                            <TemplatesTypeSelectionButtonsContainer horizontal={true}>
                                {isThemeTypesDefined() ? props.types.defaults.theme_type.map((themeType, index) => (
                                    <TemplatesTypeSelectionButtons key={index} isSelected={themeType.name === selectedThemeType} onPress={e=> onChangeSelectedThemeType(themeType.name)}>
                                        <TemplatesTypeSelectionButtonsText isSelected={themeType.name === selectedThemeType}>
                                            {types('pt-br', 'theme_type', themeType.name)}
                                        </TemplatesTypeSelectionButtonsText>
                                    </TemplatesTypeSelectionButtons>
                                )) : null}
                            </TemplatesTypeSelectionButtonsContainer>
                        </TemplatesTemplateTypeSelectionContainer>
                        <TemplatesSelectionContainer
                            data={props.templates['reflow'].data}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <TemplatesSelectionCard
                                onPress={e=> onChangeSelectedTemplate(item.id)}
                                >
                                    <TemplatesSelectionText>
                                        {item.display_name}
                                    </TemplatesSelectionText>
                                </TemplatesSelectionCard>
                            )}
                        />
                    </TemplatesContentContainer>
                </TemplatesContainer>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesContainer>
                <TemplatePreview 
                groups={props.groups}
                data={props.loadedTemplate}
                cancelToken={props.cancelToken}
                onGetTemplate={props.onGetTemplate}
                selectedTemplateId={selectedTemplate} 
                onSelectTemplate={props.onSelectTemplate}
                setAddTemplates={props.setAddTemplates}
                onChangeSelectedTemplate={onChangeSelectedTemplate}
                onGetTemplateFormulary={props.onGetTemplateFormulary}
                />
                <TemplatesHeader>
                    <TemplatesGoBackButton onClick={e=>{
                        console.log(props.setAddTemplates)
                        props.setAddTemplates(false)
                    }}>
                        <FontAwesomeIcon icon={'chevron-left'} />&nbsp;{strings['pt-br']['templateGoBackButtonLabel']}
                    </TemplatesGoBackButton>
                </TemplatesHeader>
                <TemplatesContentContainer>
                    <TemplatesTemplateTypeSelectionContainer>
                        <TemplatesTemplateTypeSelectionTitle>
                            {strings['pt-br']['templateTypeSelectionTitleLabel']}
                        </TemplatesTemplateTypeSelectionTitle>
                        {/*
                        <TemplatesTemplateFilterTypeButtonsContainer>
                            {['reflow', 'community', 'company'].map((templateFilterType, index)=> (
                                <TemplatesTemplateFilterTypeButtons key={index}>
                                    <TemplatesTemplateFilterTypeButtonsText>
                                        {templateFilterType}
                                    </TemplatesTemplateFilterTypeButtonsText>
                                </TemplatesTemplateFilterTypeButtons>
                            ))}
                        </TemplatesTemplateFilterTypeButtonsContainer>
                        */}
                        <TemplatesTypeSelectionButtonsContainer>
                            {isThemeTypesDefined() ?  props.types.defaults.theme_type.map((themeType, index) => (
                                <TemplatesTypeSelectionButtons key={index} isSelected={themeType.name === selectedThemeType} onClick={e=> onChangeSelectedThemeType(themeType.name)}>
                                    <TemplatesTypeSelectionButtonsText isSelected={themeType.name === selectedThemeType}>
                                        {types('pt-br', 'theme_type', themeType.name)}
                                    </TemplatesTypeSelectionButtonsText>
                                </TemplatesTypeSelectionButtons>
                            )) : null}
                        </TemplatesTypeSelectionButtonsContainer>
                    </TemplatesTemplateTypeSelectionContainer>
                    <TemplatesSelectionContainer>
                        {props.templates['reflow'].data.map((template, index) => (
                            <TemplatesSelectionCard key={index} 
                            onClick={e=> onChangeSelectedTemplate(template.id)}>
                                <TemplatesSelectionText>
                                    {template.display_name}
                                </TemplatesSelectionText>
                            </TemplatesSelectionCard>
                        ))}
                    </TemplatesSelectionContainer>
                </TemplatesContentContainer>
            </TemplatesContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateSelect