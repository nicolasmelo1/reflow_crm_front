import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import { types } from '../../utils/constants'
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
    TemplateConfigurationFormAddFormulariesButtonLabel
} from '../../styles/Templates'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateConfigurationForm = (props) => {
    const descriptionInputRef = React.useRef(null)
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
                if (formularyIdsToVerifyIfDependent[0] in props.dependentForms) {
                    const dependentFormIdsToAdd = props.dependentForms[formularyIdsToVerifyIfDependent[0]].filter(dependentFormularyId => !newSelectedFormulariesIds.map(selectedFormularyId => selectedFormularyId.value).includes(dependentFormularyId))
                    formularyIdsToVerifyIfDependent = formularyIdsToVerifyIfDependent.concat(dependentFormIdsToAdd)
                    // holds the ids that will be concated on selectedFormulariesIds array.
                    dependentFormularyIds = dependentFormularyIds.concat(dependentFormIdsToAdd.map(dependentFormIdToAdd => (addSelectedFormularyId(formularyIdsToVerifyIfDependent[0], dependentFormIdToAdd))))
                }
                formularyIdsToVerifyIfDependent.shift()
            } 
        })
        newSelectedFormulariesIds = newSelectedFormulariesIds.concat(dependentFormularyIds)
        // adds a null data at the end so we create an empty select at the end.
        if (newSelectedFormulariesIds.length === 0 || newSelectedFormulariesIds[newSelectedFormulariesIds.length - 1].value !== null) {
            newSelectedFormulariesIds.push(addSelectedFormularyId('', null)) 
        }
        setSelectedFormulariesIds(newSelectedFormulariesIds)
        props.templateConfiguration.form_ids = newSelectedFormulariesIds.filter(selectedFormularyId => selectedFormularyId !== null)
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

    const onChangeTemplateIsPublic = (isPublic) => {
        props.templateConfiguration.is_public = isPublic
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    const onChangeTemplateDescription = (data) => {
        props.templateConfiguration.description = data
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }

    const onChangeThemeType = (data) => {
        const themeTypeId = data.length > 0 ? data[0] : null
        props.templateConfiguration.theme_type = themeTypeId
        props.onChangeTemplateConfigurationData({...props.templateConfiguration})
    }
        
    const resizeDescriptionTextArea = (e) => {
        descriptionInputRef.current.style.height = 'auto';
        descriptionInputRef.current.style.height = (descriptionInputRef.current.scrollHeight) + 'px';
    }

    useEffect(() => {
        setThemeTypeOptions(props.types.defaults.theme_type.map(themeType => (
            { 
                value: themeType.id, 
                label: types('pt-br', 'theme_type', themeType.name) 
            })
        ))
    }, [props.types])

    useEffect(() => {
        descriptionInputRef.current.addEventListener('input', resizeDescriptionTextArea)
        return () => {
            descriptionInputRef.current.removeEventListener('input', resizeDescriptionTextArea)
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <TemplateConfigurationFormContainer isOpen={props.isOpen}>
                <div style={{ width: '100%', padding: '10px' }}>
                    <button style={{ backgroundColor: 'transparent', color: '#17242D', border: 0 }} onClick={e => {
                        setIsOpenAddFormularies(false)
                        setSelectedFormulariesIds([addSelectedFormularyId('', null)])
                        props.setIsOpen(false)
                    }}>
                        {'< Voltar'}
                    </button>
                </div>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormCheckboxesContainer>
                        <input type='checkbox' checked={props.templateConfiguration.is_public} onChange={e => onChangeTemplateIsPublic(!props.templateConfiguration.is_public)}/>
                        <TemplateConfigurationFormCheckboxText>
                            Esse template é publico?
                        </TemplateConfigurationFormCheckboxText>
                    </TemplateConfigurationFormCheckboxesContainer>
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {'Nome'}
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormFieldInput
                    type={'text'}
                    onChange={e=>onChangeTemplateName(e.target.value)}
                    value={props.templateConfiguration.display_name}
                    />
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {'Descrição'}
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormFieldTextArea
                    ref={descriptionInputRef}
                    onChange={e=>onChangeTemplateDescription(e.target.value)}
                    value={props.templateConfiguration.description}
                    />
                </TemplateConfigurationFormFieldContainer>
                <TemplateConfigurationFormFieldContainer>
                    <TemplateConfigurationFormFieldLabel>
                        {'A Qual grupo esse template se refere?'}
                    </TemplateConfigurationFormFieldLabel>
                    <TemplateConfigurationFormSelectContainer isOpen={isOpenThemeTypeSelect}>
                        <Select
                        options={themeTypeOptions}
                        initialValues={themeTypeOptions.filter(themeTypeOption => themeTypeOption.value === props.templateConfiguration.theme_type)}
                        onChange={onChangeThemeType}
                        setIsOpen={setIsOpenThemeTypeSelect}
                        isOpen={isOpenThemeTypeSelect}
                        />
                    </TemplateConfigurationFormSelectContainer>
                </TemplateConfigurationFormFieldContainer>
                {isOpenAddFormularies ? (
                    <TemplateConfigurationFormFieldContainer>
                        <TemplateConfigurationFormFieldLabel>
                            {'Quais páginas esse template irá conter?'}
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
                                        <small>{'É dependência de: '}</small>
                                        <small style={{ color: '#0dbf7e'}}>{selectedFormularyId.isDependentFromFormName}</small>
                                    </span>
                                ): ''}
                            </TemplateConfigurationFormFormularySelectContainer>
                        ))}
                    </TemplateConfigurationFormFieldContainer>    
                ) : (
                    <TemplateConfigurationFormAddFormulariesButton onClick={e=> setIsOpenAddFormularies(true)}>
                        <TemplateConfigurationFormAddFormulariesButtonLabel>
                            {'Adicionar paginas'}
                        </TemplateConfigurationFormAddFormulariesButtonLabel>
                    </TemplateConfigurationFormAddFormulariesButton>
                )}
            </TemplateConfigurationFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfigurationForm