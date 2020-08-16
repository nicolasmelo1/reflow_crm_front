import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import { types } from '../../utils/constants'
import {
    UsersFormularyContainer,
    UsersFormularyPermissionSelectionButton,
    UsersFormularyPermissionsIcon,
    UsersFormularyFieldInput,
    UsersFormularyFieldSelectContainer,
    UsersFormularyFieldLabel,
    UsersFormularyFieldContainer,
    UsersFormularyGoBackButton,
    UsersFormularyFieldsAndPermissionContainer,
    UsersFormularyPermissionTemplateTitle,
    UsersFormularyPermissionFormularyTitle,
    UsersFormularyPermissionFormularyContainer,
    UsersFormularyPermissionFieldTitle,
    UsersFormularyPermissionFieldContainer,
    UsersFormularyPermissionOptionTitle,
    UsersFormularyPermissionOptionContainer
} from '../../styles/Users'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const UsersForm = (props) => {
    const [profileTypeOptions, setProfileTypeOptions] = useState([])
    const [templatesUserHaveAccess, setTemplatesUserHaveAccess] = useState([])
    const [formulariesUserHaveAccess, setFormulariesUserHaveAccess] = useState([])
    const [optionsUserHaveAccess, setOptionsUserHaveAccess] = useState([])
    const [userId, setUserId] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileId, setProfileId] = useState(null)
    const [profileSelectorIsOpen, setProfileSelectorIsOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [userData, setUserData] = useState({
        id: null,
        username: '',
        first_name: '',
        last_name: '',
        profile_id: null,
        option_accessed_by_user: [],
        form_accessed_by_user: []
    })
    
    const errorMessages = {
        name: 'Insira o nome completo',
        email: 'Verifique esse e-mail é um e-mail válido'
    }

    const isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
            case 'email':
                return ![null, undefined, ''].includes(value) && /@\w+\./g.test(value)
            default:
                return true
        }
    }

    const onValidate = (field, value) => {
        const isValidValue = isValid(field, value)
        if (!isValidValue) {
            errors[field] = errorMessages[field]
        } else {
            delete errors[field]
        }
        setErrors({...errors})
        return isValidValue
    }
    
    const onChangeName = (value) => {
        onValidate('name', value)
        setName(value)
    }

    const onChangeEmail = (value) => {
        onValidate('email', value)
        setEmail(value)
    }

    const onChangeProfile = (data) => {
        setProfileId(data ? data[0]: null)
    }

    const onSelectOptionPermission = (id) => {
        if (optionsUserHaveAccess.includes(id)) {
            const indexToRemove = optionsUserHaveAccess.indexOf(id)
            optionsUserHaveAccess.splice(indexToRemove, 1)
        } else {
            optionsUserHaveAccess.push(id)
        }
        setOptionsUserHaveAccess([...optionsUserHaveAccess])
    }

    const onSelectFormularyPermission = (id) => {
        if (formulariesUserHaveAccess.includes(id)) {
            const indexToRemove = formulariesUserHaveAccess.indexOf(id)
            const templateToRemove = props.formulariesAndFieldPermissionsOptions.filter(template=> template.form_group.map(form => form.id).includes(id))
            const formToRemove = templateToRemove[0].form_group.filter(form=> form.id === id)
            const optionsToRemove = [].concat.apply(
                [],
                formToRemove[0].form_fields.map(field => 
                    [].concat.apply(
                        [], 
                        field.field_option.map(option=> option.id)
                    )
                )
            )

            const filteredSelectedOptionIds = optionsUserHaveAccess.filter(optionId => !optionsToRemove.includes(optionId))  

            setOptionsUserHaveAccess([...filteredSelectedOptionIds])
                      
            formulariesUserHaveAccess.splice(indexToRemove, 1)
        } else {
            formulariesUserHaveAccess.push(id)
        }
        setFormulariesUserHaveAccess([...formulariesUserHaveAccess])
    }

    const onSelectTemplatePermission = (id) => {
        if (templatesUserHaveAccess.includes(id)) {
            const indexToRemove = templatesUserHaveAccess.indexOf(id)
            const templateToRemove = props.formulariesAndFieldPermissionsOptions.filter(template=> template.id === id)
            const formIdsToRemove = templateToRemove[0].form_group.map(form => form.id)
            const optionsToRemove = [].concat.apply(
                [], 
                templateToRemove[0].form_group.map(form => 
                    [].concat.apply(
                        [],
                        form.form_fields.map(field => 
                            [].concat.apply(
                                [], 
                                field.field_option.map(option=> option.id)
                            )
                        )
                    )
                )
            )
            const filteredSelectedOptionIds = optionsUserHaveAccess.filter(optionId => !optionsToRemove.includes(optionId))                        
            const filteredSelectedFormIds = formulariesUserHaveAccess.filter(formId => !formIdsToRemove.includes(formId))
            
            setOptionsUserHaveAccess([...filteredSelectedOptionIds])
            setFormulariesUserHaveAccess([...filteredSelectedFormIds])
            
            templatesUserHaveAccess.splice(indexToRemove, 1)
        } else {
            //changeFormularyIdsUserHaveAccessTo([].concat.apply([], props.formulariesAndFieldPermissionsOptions.filter(template=> template.id === id).map(template => template.form_group.map(form => form.id))))
            templatesUserHaveAccess.push(id)
        }
        setTemplatesUserHaveAccess([...templatesUserHaveAccess])
    }

    const onSubmit = () => {
        const data = {
            id: userId,
            username: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            profile_id: profileId,
            option_accessed_by_user: optionsUserHaveAccess.map(optionAccessedBy => ({field_option_id: optionAccessedBy})),
            form_accessed_by_user: formulariesUserHaveAccess.map(formularyAccessedBy => ({form_id: formularyAccessedBy}))
        }
        props.submitForm(data)
    }

    useEffect(() => {
        if (props.isOpen) {
            const formularyIdsAccessedByUser = props.userData.form_accessed_by_user.map(formAccessedBy => formAccessedBy.form_id)
            const optionIdsAccessedByUser = props.userData.option_accessed_by_user.map(optionAccessedBy => optionAccessedBy.field_option_id)
            const userSelectedTemplates = props.formulariesAndFieldPermissionsOptions
                                            .filter(template => template.form_group.filter(form=> formularyIdsAccessedByUser.includes(form.id)).length > 0)
                                            .map(template => template.id)
            setTemplatesUserHaveAccess([...userSelectedTemplates])
            setOptionsUserHaveAccess([...optionIdsAccessedByUser])
            setFormulariesUserHaveAccess([...formularyIdsAccessedByUser])
            setName(`${props.userData.first_name} ${props.userData.last_name}`)
            setEmail(`${props.userData.username}`)
            setUserId(props.userData.id)
            if (props.userData.profile_id === null) {
                const profileId = props.types.defaults.profile_type.filter(profileType => profileType.name === 'admin')[0].id
                setProfileId(profileId)
            } else {
                setProfileId(props.userData.profile_id)
            }
            //setUserData(props.userData)
        }
    }, [props.isOpen, props.userData])

    useEffect(() => {
        setProfileTypeOptions(
            props.types.defaults.profile_type.map(profileType => ({ 
                value: profileType.id, 
                label: types('pt-br', 'profile_type', profileType.name) 
            }))
        )
    }, [props.types])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <UsersFormularyContainer isOpen={props.isOpen}>
                <div style={{width: '100%', marginBottom: '10px'}}>
                    <UsersFormularyGoBackButton onClick={e=> {props.onCloseFormulary()}}>
                        {'< Voltar'}
                    </UsersFormularyGoBackButton>
                </div>
                <UsersFormularyFieldsAndPermissionContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            Nome
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldInput 
                        errors={errors.hasOwnProperty('name')} 
                        type={'text'} 
                        onChange={e => {onChangeName(e.target.value)}}
                        value={name}
                        />
                    </UsersFormularyFieldContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            E-mail
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldInput 
                        type={'text'} 
                        errors={errors.hasOwnProperty('email')} 
                        onChange={e => {onChangeEmail(e.target.value)}}
                        value={email}
                        />
                    </UsersFormularyFieldContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            Perfil
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldSelectContainer isOpen={profileSelectorIsOpen}>
                            <Select 
                            options={profileTypeOptions}
                            initialValues={profileTypeOptions.filter(profileTypeOption => profileTypeOption.value === profileId)} 
                            onChange={onChangeProfile}
                            isOpen={profileSelectorIsOpen}
                            setIsOpen={setProfileSelectorIsOpen}
                            />
                        </UsersFormularyFieldSelectContainer>
                    </UsersFormularyFieldContainer>
                    <h2>
                        {formulariesUserHaveAccess.length > 0 ? 'Selecione as opções que o usuário pode acessar' : templatesUserHaveAccess.length > 0 ? 'Quais páginas o usuário deve ter acesso?' : 'Quais templates o usuário deve ter acesso?'}
                    </h2>
                    {props.formulariesAndFieldPermissionsOptions.map(template => (
                        <div key={template.id}>
                            <UsersFormularyPermissionSelectionButton 
                            isSelected={templatesUserHaveAccess.includes(template.id)}
                            onClick={e=> onSelectTemplatePermission(template.id)}
                            >
                                {templatesUserHaveAccess.includes(template.id)}
                                <UsersFormularyPermissionsIcon 
                                icon={(templatesUserHaveAccess.includes(template.id)) ? 'check' : 'times'}
                                isSelected={templatesUserHaveAccess.includes(template.id)}
                                />
                                <UsersFormularyPermissionTemplateTitle>
                                    {template.name}
                                </UsersFormularyPermissionTemplateTitle>
                            </UsersFormularyPermissionSelectionButton>
                            {templatesUserHaveAccess.includes(template.id) ? template.form_group.map(formulary => (
                                <div key={formulary.id}>
                                    <UsersFormularyPermissionSelectionButton
                                    isSelected={formulariesUserHaveAccess.includes(formulary.id)}
                                    onClick={e => onSelectFormularyPermission(formulary.id)}
                                    >
                                        <UsersFormularyPermissionFormularyContainer>
                                            <UsersFormularyPermissionsIcon 
                                            icon={(formulariesUserHaveAccess.includes(formulary.id)) ? 'check' : 'times'}
                                            isSelected={formulariesUserHaveAccess.includes(formulary.id)}
                                            />
                                            <UsersFormularyPermissionFormularyTitle>
                                                {formulary.label_name}
                                            </UsersFormularyPermissionFormularyTitle>
                                        </UsersFormularyPermissionFormularyContainer>
                                    </UsersFormularyPermissionSelectionButton>
                                    {formulariesUserHaveAccess.includes(formulary.id) ? formulary.form_fields.map((field, index) => (
                                        <div key={index}>
                                            <UsersFormularyPermissionFieldContainer>
                                                <UsersFormularyPermissionFieldTitle>
                                                    {field.label_name}
                                                </UsersFormularyPermissionFieldTitle>
                                            </UsersFormularyPermissionFieldContainer>
                                            {field.field_option.map(option => (
                                                <UsersFormularyPermissionSelectionButton 
                                                key={option.id} 
                                                isSelected={optionsUserHaveAccess.includes(option.id)}
                                                onClick={e => onSelectOptionPermission(option.id)}
                                                style={{ padding: '5px 0'}}
                                                >
                                                    <UsersFormularyPermissionOptionContainer>
                                                        <UsersFormularyPermissionsIcon 
                                                        icon={(optionsUserHaveAccess.includes(option.id)) ? 'check' : 'times'}
                                                        isSelected={optionsUserHaveAccess.includes(option.id)}
                                                        />
                                                        <UsersFormularyPermissionOptionTitle>
                                                            {option.option}
                                                        </UsersFormularyPermissionOptionTitle>
                                                    </UsersFormularyPermissionOptionContainer>
                                                </UsersFormularyPermissionSelectionButton>
                                            ))}
                                        </div>
                                    )) : ''}
                                </div>
                            )) : ''}
                        </div>
                    ))}
                    <button onClick={e=> onSubmit()}>Salvar</button>
                </UsersFormularyFieldsAndPermissionContainer>
            </UsersFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default UsersForm