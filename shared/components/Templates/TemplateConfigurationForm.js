import React, { useState, useEffect } from 'react'
import { Modal, Switch, Text, View, ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Select } from '../Utils'
import { types, strings, errors } from '../../utils/constants'
import {
    TemplateConfigurationFormContainer,
    TemplateConfigurationFormCheckboxesContainer,
    TemplateConfigurationFormCheckboxText,
    TemplateConfigurationFormFieldContainer,
    TemplateConfigurationFormFieldLabel,
    TemplateConfigurationFormFieldLabelRequired,
    TemplateConfigurationFormFieldInput,
    TemplateConfigurationFormFieldTextArea,
    TemplateConfigurationFormSelectContainer,
    TemplateConfigurationFormFormularySelectContainer,
    TemplateConfigurationFormAddFormulariesButton,
    TemplateConfigurationFormAddFormulariesButtonLabel,
    TemplateConfigurationFormDependencyLabel, 
    TemplateConfigurationFormSaveButton,
    TemplateConfigurationFormSaveLabel,
    TemplatesHeader,
    TemplatesGoBackButton
} from '../../styles/Templates'


/**
 * This component holds the template configuration formulary. It is mostly a really basic and straight forward formulary.
 * The problem resides on adding formularies/pages to the template. Our logic is that all of the templates formularies is "written on stone".
 * 
 * What this means is, you cannot edit templates formularies UNLESS you add them all again. You can't add new formularies, can't edit formularies.
 * Template formularies is like a ctrl+c / ctrl+v of the formulary data of the user. You cannot edit it because it becomes easier for us. The user only has
 * ONE WAY of editing formularies (in the FormularyEdit component). He has only one way of editing notifications, only one way of editing kanban, only one way
 * of editing dashboards and so on.
 * 
 * If it was possible to edit formularies from the theme we should need to create a way for the user to edit everything contained inside of the formulary.
 * 
 * There is one requirement for adding formularies/pages though: Formularies that have `form` field type have dependencies. This means that if i add a formulary
 * that is connected to another we need to add the other formulary to the template also.
 * 
 * 
 * Besides that requirement on formularies, this is just a simple and easy formulary for adding templates.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} templateConfiguration - The template configuration data object. You might want to see `getNewTempalteConfigurationData` function on
 * TemplateConfiguration component to see what this looks like.
 * @param {Function} onChangeTemplateConfigurationData - Used for changing the template configuration state. This changes the object state at a specific index
 * that is used by this component. So this function only is used to change the state of the data, this does not send the data to the backend or something
 * like this.
 * @param {Function} onCreateOrUpdateTemplateConfiguration - Used for creating or updating a template configuration, this is used for SUBMITTING the data
 * to the backend. This actually doesn't change the state.
 * @param {Object} dependentForms - This is a object recieved from the backend, it contains the dependent formularies as keys and the dependencies it has
 * as an array of values on each key. So the keys are formularies ids that have `form` field types, and the ids in the array of each key is the id of
 * the formulary it depends on.
 * @param {Array<Object>} formulariesOptions - Recieves an formatted array of objects. This object follows the Select component guidelines. Each object has a
 * `value` key with ids, and a `label` with the formulary label_name.
 * @param {Boolean} isOpen - Defines if the formulary is open or closed. So True for open and False for closed.
 * @param {Function} setIsOpen - sets and changes the isOpen state in the parent component
 */
const TemplateConfigurationForm = (props) => {
    const descriptionInputRef = React.useRef(null)
    const [formErrors, setFormErrors] = useState({})
    const [selectedFormulariesIds, setSelectedFormulariesIds] = useState([addSelectedFormularyId('', null)])
    const [isOpenAddFormularies, setIsOpenAddFormularies] = useState(false)
    const [isOpenThemeTypeSelect, setIsOpenThemeTypeSelect] = useState(false)
    const [themeTypeOptions, setThemeTypeOptions] = useState([])

    /**
     * This is a handy function to add formularies to `selectedFormulariesIds` state.
     * We use this because each element of the array is an object that contains two things:
     * 
     * - First the value: The value is just the form_id you are adding to the template, nothing fancy.
     * - Second but most important `isDependentFromFormName`: This key holds the formulary label name
     * of which formulary the `form_id` is dependent on. 
     * 
     * The second one might not be that straight forward. Let's imagine two formularies: Companies and Users
     * The Companies formulary has a field of `form` type that is bound to Users. Both formularies have a connection.
     * If we select the Companies formulary to the template then `Users` formulary come as a dependent_form. 
     * 
     * Okay, so when we add Companies formulary `isDependentFromFormId` of this object that holds the id of this formulary
     * will be ''. When we add Users formulary `isDependentFromFormId` will be the id of the Companies formulary. 
     * With this we can display to the user clearly that Users is just being added because it is a dependency of
     * Companies formulary. 
     * 
     * @param {BigInteger} isDependentFromFormId - The formulary id that the form_id you are adding is dependent on
     * we convert this to the actual name of the formulay.
     * @param {BigInteger} value - The formulary id that is seleced. Can be also null if you don't want nothing selected.
     */
    function addSelectedFormularyId(isDependentFromFormId, value) {
        const formularyOption = props.formulariesOptions.filter(formularyOption => formularyOption.value === isDependentFromFormId)
        return {
            isDependentFromFormName: (formularyOption.length > 0) ? formularyOption[0].label : '',
            value: value
        }
    }

    /**
     * What this function does is add the form_ids of the template when the user selects a formulary.
     * When this happen what we need to do is to check if the formulary selected has any dependencies.
     * What does `dependencies` here mean. It means that the formulary you selected is connected to
     * another `form_id` through `form` field types.
     * 
     * Let's think about databases. If we have a table called `company` but this table has a foreign key
     * to a table called `users`. Since this tables are connected to each other they are bound to each other
     * so `company` cannot be deployed or created without the `users` table being also created. The opposite
     * is not true. You can deploy `users` without `company` because it is `company` that has this dependency
     * and not the table `users`. Here works the same way.
     * 
     * @param {BigInteger} index - The index of the form_id you are updating on `selectedFormulariesIds`.
     * @param {Array<BigInteger>} data - This is an array with form_ids, it is just one since the select only accepts
     * one option.
     */
    const onSelectFormularyId = (index, data) => {
        let dependentFormularyIds = []
        let newSelectedFormulariesIds = selectedFormulariesIds
        if (data.length > 0) {
            const formularyId = data[0]
            newSelectedFormulariesIds.splice(index, 1, addSelectedFormularyId('', formularyId))
        } else {
            newSelectedFormulariesIds.splice(index, 1)
        }
        // removes all of the empty values from the array so we do not have any extra empty selects
        // we just need ONE empty select at the END of the selects.
        newSelectedFormulariesIds = newSelectedFormulariesIds
            .filter(selectedFormularyId => selectedFormularyId.value !== null)
            .map(selectedFormularyId => ({ ...selectedFormularyId, isDependentFromFormName: '' }))
        
        // This is responsible for checking if all of the selected formularies ids
        // are dependent or not.
        // The implementation is kinda tricky but it makes some sense.
        // `formularyIdsToVerifyIfDependent` is a variable that holds an array of formularies ids.
        // First this array starts with only one id to validate. if it is dependent we add the dependent form_ids 
        // to the array. After that we remove the first element from the array (since we already checked it.)
        // We need to do this because i might have a formulary that is dependent on another. But this other is dependent
        // on another and so on.
        newSelectedFormulariesIds.forEach(selectedFormularyId => {
            let formularyIdsToVerifyIfDependent = [selectedFormularyId.value]
            while (formularyIdsToVerifyIfDependent.length > 0) {
                if (Object.keys(props.dependentForms).includes(formularyIdsToVerifyIfDependent[0].toString())) {
                    const dependentFormIdsToAdd = props.dependentForms[formularyIdsToVerifyIfDependent[0]]
                    formularyIdsToVerifyIfDependent = formularyIdsToVerifyIfDependent.concat(dependentFormIdsToAdd)
                    // holds the ids that will be concated on selectedFormulariesIds array.
                    let dependentFormIdsToAddWithoutDuplicates = [...new Set(dependentFormIdsToAdd
                        .filter(dependentFormIdToAdd => !dependentFormularyIds.map(dependentFormularyId => dependentFormularyId.value).includes(dependentFormIdToAdd)))]
                    dependentFormIdsToAddWithoutDuplicates = dependentFormIdsToAddWithoutDuplicates.map(dependentFormIdToAdd => (addSelectedFormularyId(formularyIdsToVerifyIfDependent[0], dependentFormIdToAdd)))
                    dependentFormularyIds = dependentFormularyIds.concat(dependentFormIdsToAddWithoutDuplicates)
                }
                formularyIdsToVerifyIfDependent.shift()
            } 
        })
        // So what this does is take out the objects from the array that ARE dependent. This way we force the dependency
        // to always be shown. Otherwise the dependency would not be shown.
        const onlyDependentFormularyIds = dependentFormularyIds.map(dependentFormularyId => dependentFormularyId.value)
        newSelectedFormulariesIds = newSelectedFormulariesIds.filter(selectedFormularyId => !onlyDependentFormularyIds.includes(selectedFormularyId.value))
        newSelectedFormulariesIds = [...newSelectedFormulariesIds, ...dependentFormularyIds]

        // adds a null data at the end so we create an empty select at the end.
        if (newSelectedFormulariesIds.length === 0 || newSelectedFormulariesIds[newSelectedFormulariesIds.length - 1].value !== null) {
            newSelectedFormulariesIds.push(addSelectedFormularyId('', null)) 
        }
        setSelectedFormulariesIds(newSelectedFormulariesIds)
        props.templateConfiguration.form_ids = newSelectedFormulariesIds.filter(selectedFormularyId => selectedFormularyId !== null).map(selectedFormularyId => selectedFormularyId.value)
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    /**
     * Changes the name of the template that will be displayed to the user. 
     * The user can name it whatever he wants.
     * 
     * @param {String} data - The new name of the template. Nothing that fancy.
     */
    const onChangeTemplateName = (data) => {
        props.templateConfiguration.display_name = data
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    /**
     * Changes if the template is public or not. Public templates are shared to the community.
     * 
     * @param {Boolean} isPublic - True if the template is public and false if not
     */
    const onChangeTemplateIsPublic = (isPublic) => {
        props.templateConfiguration.is_public = isPublic
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    /**
     * Changes the description of the template. Description is supposed to be simple.
     * Most description must be written by topics.
     * 
     * @param {String} data - The description of the template. 
     */
    const onChangeTemplateDescription = (data) => {
        props.templateConfiguration.description = data
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    /**
     * Changes theme type. The themetype is from what group is the theme from. It can be a template for design,
     * a template for sales, a template for hr.
     * 
     * @param {Array<BigInteger>} data - This recieves an array with just a number or an empty array. The number
     * is an theme_type id. Check types for reference
     */
    const onChangeThemeType = (data) => {
        const themeTypeId = data.length > 0 ? data[0] : null
        props.templateConfiguration.theme_type = themeTypeId
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    /**
     * Responsible for submitting the data to the backend, you will notice that this call a function on
     * TemplateConfiguration component. We do this because after we save on the backend we need to all of the templates
     * data again to be loaded on the grid view.
     * 
     * On this function on the other hand we just close the formulary after it has been saved.
     */
    const onSubmit = () => {
        props.onCreateOrUpdateTemplateConfiguration(props.templateConfiguration).then(response => {
            if (response && response.status === 200) {
                setFormErrors({})
                onCloseFormulary()
            } else {
                if (Object.keys(response.data.error).every(error=> Object.keys(props.templateConfiguration).includes(error))) {
                    // its a error with one of the fields
                    const error = JSON.parse(JSON.stringify(response.data.error))
                    Object.keys(response.data.error).forEach(errorKey => {
                        // might need to add new cases in the future, this only chacks blank fields
                        error[errorKey] = (error[errorKey][0] === 'blank') ? errors('pt-br', 'blank_field') : errors('pt-br', 'unknown_field')
                    })
                    setFormErrors(error)
                } else if (response.data.error.reason && response.data.error.reason.includes('form_ids_should_be_defined_when_creating')) {
                    formErrors['form_ids'] = strings['pt-br']['templateConfigurationFormularyFormIdsShouldBeDefinedWhenCreatingError']
                    setFormErrors({...formErrors})
                }
            }
        })
    }

    /**
     * Used for closing the formulary, the most important thing you need to notice is that
     * when we close the formulary we reset the `selectedFormulariesIds` state inside of this component.
     * 
     * If you understand well, this state is responsible for holding all of the formularies/pages this template contains.
     * It doesn't matter if you are editing a theme or saving a new theme, formularies are always subscribed.
     */
    const onCloseFormulary = () => {
        setIsOpenAddFormularies(false)
        setSelectedFormulariesIds([addSelectedFormularyId('', null)])
        setFormErrors({})
        props.setIsOpen(false)
    }

    /**
     * WEB ONLY
     * This is used for WEB only for resizing the text input while the user types.
     * 
     * @param {Object} e - The event
     */
    const resizeDescriptionTextArea = (e) => {
        descriptionInputRef.current.style.height = 'auto';
        descriptionInputRef.current.style.height = (descriptionInputRef.current.scrollHeight) + 'px';
    }

    useEffect(() => {
        // sets the theme options that the user can select from the types we recieve.
        // with this you can have a further reference on what are theme types. 
        // On options the id of the theme type is the value and the label is a text e define internally.
        setThemeTypeOptions(props.types.defaults.theme_type.map(themeType => (
            { 
                value: themeType.id, 
                label: types('pt-br', 'theme_type', themeType.name) 
            })
        ))
    }, [props.types])

    useEffect(() => {
        // This adds an event listener for resizing the text area while the user types on the description text input
        if (process.env['APP'] === 'web') descriptionInputRef.current.addEventListener('input', resizeDescriptionTextArea)
        return () => {
            if (descriptionInputRef.current) {
                if (process.env['APP'] === 'web') descriptionInputRef.current.removeEventListener('input', resizeDescriptionTextArea)
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <Modal animationType="slide">
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <TemplateConfigurationFormContainer>
                        <TemplatesHeader>
                            <TemplatesGoBackButton onPress={e=> onCloseFormulary()}>
                                <FontAwesomeIcon icon={'times'} />
                            </TemplatesGoBackButton>
                        </TemplatesHeader>
                        <TemplateConfigurationFormFieldContainer>
                            <TemplateConfigurationFormCheckboxesContainer>
                                <Switch value={props.templateConfiguration.is_public} onValueChange={e => onChangeTemplateIsPublic(!props.templateConfiguration.is_public)}/>
                                <TemplateConfigurationFormCheckboxText>
                                    {' ' + strings['pt-br']['templateConfigurationFormularyIsPublicFieldLabel']}
                                </TemplateConfigurationFormCheckboxText>
                                <Text style={{ color: '#bfbfbf', fontSize: 12}}>
                                    {strings['pt-br']['templateConfigurationFormularyIsPublicTemplateExplanation']}
                                </Text> 
                            </TemplateConfigurationFormCheckboxesContainer>
                        </TemplateConfigurationFormFieldContainer>
                        <TemplateConfigurationFormFieldContainer>
                            <TemplateConfigurationFormFieldLabel>
                                {strings['pt-br']['templateConfigurationFormularyNameFieldLabel']}
                                <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                            </TemplateConfigurationFormFieldLabel>
                            <TemplateConfigurationFormFieldInput
                            errors={formErrors.display_name}
                            type={'text'}
                            onChange={e=>onChangeTemplateName(e.nativeEvent.text)}
                            value={props.templateConfiguration.display_name}
                            />
                        </TemplateConfigurationFormFieldContainer>
                        <TemplateConfigurationFormFieldContainer>
                            <TemplateConfigurationFormFieldLabel>
                                {strings['pt-br']['templateConfigurationFormularyDescriptionFieldLabel']}
                                <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                            </TemplateConfigurationFormFieldLabel>
                            <TemplateConfigurationFormFieldTextArea
                            errors={formErrors.description}
                            multiline={true}
                            numberOfLines={10}
                            ref={descriptionInputRef}
                            onChange={e=>onChangeTemplateDescription(e.nativeEvent.text)}
                            value={props.templateConfiguration.description}
                            />
                        </TemplateConfigurationFormFieldContainer>
                        <TemplateConfigurationFormFieldContainer>
                            <TemplateConfigurationFormFieldLabel>
                                {strings['pt-br']['templateConfigurationFormularyThemeTypeSelectorFieldLabel']}
                                <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                            </TemplateConfigurationFormFieldLabel>
                            <TemplateConfigurationFormSelectContainer isOpen={isOpenThemeTypeSelect} errors={formErrors.theme_type}>
                                <Select
                                options={themeTypeOptions}
                                initialValues={themeTypeOptions.filter(themeTypeOption => themeTypeOption.value === props.templateConfiguration.theme_type)}
                                onChange={onChangeThemeType}
                                setIsOpen={setIsOpenThemeTypeSelect}
                                isOpen={isOpenThemeTypeSelect}
                                />
                            </TemplateConfigurationFormSelectContainer>
                        </TemplateConfigurationFormFieldContainer>
                        {formErrors.form_ids ? (
                            <Text style={{ color: 'red', fontSize: 12 }}>
                                {formErrors.form_ids}
                            </Text> 
                        ) : null}
                        {isOpenAddFormularies ? (
                            <TemplateConfigurationFormFieldContainer>
                                <TemplateConfigurationFormFieldLabel>
                                    {strings['pt-br']['templateConfigurationFormularyFormularySelectorFieldLabel']}
                                </TemplateConfigurationFormFieldLabel>
                                {selectedFormulariesIds.map((selectedFormularyId, index) => (
                                    <TemplateConfigurationFormFormularySelectContainer key={selectedFormularyId.value ? selectedFormularyId.value: -1}>
                                        <TemplateConfigurationFormSelectContainer>
                                            <Select
                                            options={props.formulariesOptions.filter(formularyOption => !selectedFormulariesIds.map(selectedFormularyId => selectedFormularyId.value).includes(formularyOption.value))}
                                            initialValues={props.formulariesOptions.filter(formularyOption => formularyOption.value === selectedFormularyId.value)}
                                            onChange={(data) => onSelectFormularyId(index, data)}
                                            />
                                        </TemplateConfigurationFormSelectContainer>
                                        {!['', null].includes(selectedFormularyId.isDependentFromFormName) ? (
                                            <View style={{ display: 'flex', flexDirection: 'row'}}>
                                                <TemplateConfigurationFormDependencyLabel>
                                                    {strings['pt-br']['templateConfigurationFormularyDependencyFromAlert']}
                                                </TemplateConfigurationFormDependencyLabel>
                                                <TemplateConfigurationFormDependencyLabel isDependencyLabel={true}>
                                                    {selectedFormularyId.isDependentFromFormName}
                                                </TemplateConfigurationFormDependencyLabel>
                                            </View>
                                        ): null}
                                    </TemplateConfigurationFormFormularySelectContainer>
                                ))}
                            </TemplateConfigurationFormFieldContainer>    
                        ) : (
                            <View>
                                {!['', null].includes(props.templateConfiguration.id) ? (
                                    <Text style={{ fontSize: 12, color: '#bfbfbf', marginTop: 0, marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                                        {strings['pt-br']['templateConfigurationFormularyFormulariesWrittenInStoneAlert']}
                                    </Text> 
                                ) : null}
                                <TemplateConfigurationFormAddFormulariesButton onPress={e=> setIsOpenAddFormularies(true)}>
                                    <TemplateConfigurationFormAddFormulariesButtonLabel>
                                        {strings['pt-br']['templateConfigurationFormularyAddFormulariesButtonLabel']}
                                    </TemplateConfigurationFormAddFormulariesButtonLabel>
                                </TemplateConfigurationFormAddFormulariesButton>
                            </View>
                        )}
                        <TemplateConfigurationFormSaveButton onPress={e => onSubmit()}>
                            <TemplateConfigurationFormSaveLabel>
                                {strings['pt-br']['templateConfigurationFormularySaveButtonLabel']}
                            </TemplateConfigurationFormSaveLabel>
                        </TemplateConfigurationFormSaveButton>
                    </TemplateConfigurationFormContainer>
                </ScrollView>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <TemplateConfigurationFormContainer isOpen={props.isOpen}>
                <TemplatesHeader>
                    <TemplatesGoBackButton onClick={e=> onCloseFormulary()}>
                        <FontAwesomeIcon icon={'chevron-left'} />&nbsp;{strings['pt-br']['templateGoBackButtonLabel']}
                    </TemplatesGoBackButton>
                </TemplatesHeader>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormCheckboxesContainer>
                        <input type='checkbox' checked={props.templateConfiguration.is_public} onChange={e => onChangeTemplateIsPublic(!props.templateConfiguration.is_public)}/>
                        <TemplateConfigurationFormCheckboxText>
                            &nbsp;{strings['pt-br']['templateConfigurationFormularyIsPublicFieldLabel']}
                        </TemplateConfigurationFormCheckboxText>
                        <small style={{ color: '#bfbfbf', display: 'block' }}>
                            {strings['pt-br']['templateConfigurationFormularyIsPublicTemplateExplanation']}
                        </small> 
                    </TemplateConfigurationFormCheckboxesContainer>
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {strings['pt-br']['templateConfigurationFormularyNameFieldLabel']}
                        <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormFieldInput
                    errors={formErrors.display_name}
                    type={'text'}
                    onChange={e=>onChangeTemplateName(e.target.value)}
                    value={props.templateConfiguration.display_name}
                    />
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {strings['pt-br']['templateConfigurationFormularyDescriptionFieldLabel']}
                        <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormFieldTextArea
                    errors={formErrors.description}
                    ref={descriptionInputRef}
                    onChange={e=>onChangeTemplateDescription(e.target.value)}
                    value={props.templateConfiguration.description}
                    />
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {strings['pt-br']['templateConfigurationFormularyThemeTypeSelectorFieldLabel']}
                        <TemplateConfigurationFormFieldLabelRequired>*</TemplateConfigurationFormFieldLabelRequired>
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormSelectContainer isOpen={isOpenThemeTypeSelect} errors={formErrors.theme_type}>
                        <Select
                        options={themeTypeOptions}
                        initialValues={themeTypeOptions.filter(themeTypeOption => themeTypeOption.value === props.templateConfiguration.theme_type)}
                        onChange={onChangeThemeType}
                        setIsOpen={setIsOpenThemeTypeSelect}
                        isOpen={isOpenThemeTypeSelect}
                        />
                    </TemplateConfigurationFormSelectContainer>
                </TemplateConfigurationFormFieldContainer>
                {formErrors.form_ids ? (
                    <small style={{ color: 'red' }}>
                        {formErrors.form_ids}
                    </small> 
                ) : ''}
                {isOpenAddFormularies ? (
                    <TemplateConfigurationFormFieldContainer>
                        <TemplateConfigurationFormFieldLabel>
                            {strings['pt-br']['templateConfigurationFormularyFormularySelectorFieldLabel']}
                        </TemplateConfigurationFormFieldLabel>
                        {selectedFormulariesIds.map((selectedFormularyId, index) => (
                            <TemplateConfigurationFormFormularySelectContainer key={selectedFormularyId.value ? selectedFormularyId.value: -1}>
                                <TemplateConfigurationFormSelectContainer>
                                    <Select
                                    options={props.formulariesOptions.filter(formularyOption => !selectedFormulariesIds.map(selectedFormularyId => selectedFormularyId.value).includes(formularyOption.value))}
                                    initialValues={props.formulariesOptions.filter(formularyOption => formularyOption.value === selectedFormularyId.value)}
                                    onChange={(data) => onSelectFormularyId(index, data)}
                                    />
                                </TemplateConfigurationFormSelectContainer>
                                {!['', null].includes(selectedFormularyId.isDependentFromFormName) ? (
                                    <span>
                                        <TemplateConfigurationFormDependencyLabel>
                                            {strings['pt-br']['templateConfigurationFormularyDependencyFromAlert']}
                                        </TemplateConfigurationFormDependencyLabel>
                                        <TemplateConfigurationFormDependencyLabel isDependencyLabel={true}>
                                            {selectedFormularyId.isDependentFromFormName}
                                        </TemplateConfigurationFormDependencyLabel>
                                    </span>
                                ): ''}
                            </TemplateConfigurationFormFormularySelectContainer>
                        ))}
                    </TemplateConfigurationFormFieldContainer>    
                ) : (
                    <div>
                        {!['', null].includes(props.templateConfiguration.id) ? (
                           <small style={{ color: '#bfbfbf' }}>
                               {strings['pt-br']['templateConfigurationFormularyFormulariesWrittenInStoneAlert']}
                            </small> 
                        ) : ''}
                        <TemplateConfigurationFormAddFormulariesButton onClick={e=> setIsOpenAddFormularies(true)}>
                            <TemplateConfigurationFormAddFormulariesButtonLabel>
                                {strings['pt-br']['templateConfigurationFormularyAddFormulariesButtonLabel']}
                            </TemplateConfigurationFormAddFormulariesButtonLabel>
                        </TemplateConfigurationFormAddFormulariesButton>
                    </div>
                )}
                <TemplateConfigurationFormSaveButton onClick={e => onSubmit()}>
                    <TemplateConfigurationFormSaveLabel>
                        {strings['pt-br']['templateConfigurationFormularySaveButtonLabel']}
                    </TemplateConfigurationFormSaveLabel>
                </TemplateConfigurationFormSaveButton>
            </TemplateConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfigurationForm