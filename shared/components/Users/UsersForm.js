import React, { useState, useEffect } from 'react'
import { View, Modal, SafeAreaView, Text, ActivityIndicator } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Select } from '../Utils'
import { FRONT_END_HOST } from '../../config'
import dynamicImport from '../../utils/dynamicImport'
import { types, paths, strings } from '../../utils/constants'
import {
    UsersFormularyDuplicateButton,
    UsersFormularyDuplicateButtonText,
    UsersFormularyContainer,
    UsersFormularyPermissionSelectionButton,
    UsersFormularyPermissionsIcon,
    UsersFormularyFieldInput,
    UsersFormularyFieldSelectContainer,
    UsersFormularyFieldLabel,
    UsersFormularyFieldContainer,
    UsersFormularyFieldError,
    UsersFormularyGoBackButton,
    UsersFormularySaveButton,
    UsersFormularySaveButtonText,
    UsersFormularyFieldsAndPermissionContainer,
    UsersFormularyPermissionTemplateTitle,
    UsersFormularyPermissionFormularyTitle,
    UsersFormularyPermissionFormularyContainer,
    UsersFormularyPermissionFieldTitle,
    UsersFormularyPermissionFieldContainer,
    UsersFormularyPermissionOptionTitle,
    UsersFormularyPermissionOptionContainer
} from '../../styles/Users'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component is used for effectively create or update a new user. This is the formulary that the admin sees
 * to add new users or edit it.
 * 
 * We can separate this formulary on two parts: 
 * - The first is the user data. This data is its name, its profile and its email.
 * - The second part is the user permissions
 * 
 * "Wait, what? what is a profile? What is a permission?"
 * A profile is what the user CAN acces in our system, if he's an admin he can see the billing, can edit the company information and also
 * this component to edit users. Other types of users cannot access this.
 * 
 * Permissions is HOW we filter the information for the user. So can he access this formulary, what data can he access on this formulary?
 * And so on.
 * 
 * @param {Object} cancelToken - A axios cancel token. We use this so we can cancel a request and the promise when the user unmounts a component,
 * before the data is retrieved
 * @param {Function} onAddNotification - Redux action for adding a new notification to the top of the page. This is more of an alert but it doesn't
 * stop the user from doing wathever he's doing
 * @param {Function} onGetUsersConfiguration - Redux action used for retriving the list of users so we can mount the table. We use this data to edit
 * so we don't need to make any api call here in this template.
 * @param {Array<Object>} formulariesAndFieldPermissionsOptions - This is an array of objects containing an array of objects.
 * This follow the hyerarchy in our system. So it is an array of options, WHITHIN (inside) and array of fields, WITHIN an array of formularies
 * and lastly an array of tempalates. Yep many arrays, but this is what we use to mount the hyerarchy structure. 
 * This is used to show the options the user can select in the permissions.
 * @param {Boolean} isOpen - if True then the formulary is open, if false then it is closed
 * @param {Function} onSubmitForm - A simple function from the parent component that effectively handles if we need to 
 * update or create a new user.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} userData - The user data, nothing much to say here. Check `onAddNewUser` function in the parent component to see how
 * it should look like
 * @param {Function} onCloseFormulary - Function from the parent component used to close the user formulary.
 */
const UsersForm = (props) => {
    console.log(props?.types?.defaults?.profile_type )
    // Instead of updating the userData recieved directly we actually separate in different states in this component, this way we keep things
    // separated from the parent component and this component
    const isMountedRef = React.useRef()
    const sourceRef = React.useRef(null)
    const [profileTypeOptions, setProfileTypeOptions] = useState((props?.types?.defaults?.profile_type || []).map(profileType => ({ 
        value: profileType.id, 
        label: types('pt-br', 'profile_type', profileType.name) 
    })))
    const [templatesUserHaveAccess, setTemplatesUserHaveAccess] = useState([])
    const [formulariesUserHaveAccess, setFormulariesUserHaveAccess] = useState([])
    const [optionsUserHaveAccess, setOptionsUserHaveAccess] = useState([])
    const [userId, setUserId] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileId, setProfileId] = useState(null)
    const [profileSelectorIsOpen, setProfileSelectorIsOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    
    // The error messages we show to the user when he is updating a users information.
    const errorMessages = {
        name: strings['pt-br']['userConfigurationFormularyInvalidNameError'],
        email: strings['pt-br']['userConfigurationFormularyInvalidEmailError'],
        unique_email: strings['pt-br']['userConfigurationFormularyUniqueEmailError'],
        profile: strings['pt-br']['userConfigurationFormularyInvalidProfileError']
    }

    /**
     * This function is used for validating if the data the user inserted in a field is valid or not.
     * @param {String} name - The name is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
    const isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
            case 'email':
                return ![null, undefined, ''].includes(value) && /@[A-z\-]+\./g.test(value)
            case 'profile':
                return ![null, undefined, ''].includes(value) && value.length > 0
            default:
                return true
        }
    }

    /**
     * This does two things:
     * - Checks if a field is valid and 
     * - Sets an error key with its message if the value of the field is invalid.
     * @param {String} field - The field is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
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
    
    /**
     * Changes the name of the user and validates if the name he has typed is valid in real time while he's typing
     * 
     * @param {String} value - The name of the user
     */
    const onChangeName = (value) => {
        onValidate('name', value)
        setName(value)
    }

    /**
     * Changes the email of the user and validates if the email he has typed is valid in real time while he's typing
     * 
     * @param {String} value - The email of the user
     */
    const onChangeEmail = (value) => {
        onValidate('email', value)
        setEmail(value)
    }

    /**
     * Used for changing the profile of the user and also validating if the profile selected is valid or not
     * 
     * @param {Array<BigInteger>} data - Array containing the selected profile id
     */
    const onChangeProfile = (data) => {
        onValidate('profile', data)
        setProfileId(data.length > 0 ? data[0]: null)
    }

    /**
     * This just adds a new option accessed by the user or removes it from the list.
     * 
     * It does not have any case similar to `onSelectFormularyPermission` and `onSelectTemplatePermission` when the
     * user diselect an option because this is actually the leaf of the permission hierarchy (if you think it like a tree)
     * 
     * @param {BigInteger} id - The option id to add to the list or to remove from the list
     */
    const onSelectOptionPermission = (id) => {
        if (optionsUserHaveAccess.includes(id)) {
            const indexToRemove = optionsUserHaveAccess.indexOf(id)
            optionsUserHaveAccess.splice(indexToRemove, 1)
        } else {
            optionsUserHaveAccess.push(id)
        }
        setOptionsUserHaveAccess([...optionsUserHaveAccess])
    }

    /**
     * This function is used to add the formulary to the list of permitted pages the user can access.
     * This list is used to build the `form_accessed_by_user` key on the request when saving or editing a user.
     * 
     * Similar on what happens on `onSelectTemplatePermission`, when we unselect a formulary we actually remove all 
     * of the options of this formulary.
     * 
     * @param {BigInteger} id - The id of the formulary.
     */
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

    /**
     * This function is used to select a template in the permission. This actually doesn't change
     * anything it's just for visualization. When the user selects a template we collapse a list of 
     * formularies/pages he can see inside of this template. If he doesn't have any template selected we show a message
     * for him to select the template. When he selects his first template than we change the message to show him to select a
     * page/formulary.
     * 
     * Besides that, when the user diselects a template we actually reset the visualization. So if he diselects a template 
     * we remove all of the optionIds contained inside of this template and all of the options in this template. With this
     * it becomes easier for the user and easier for the backend to manage and handle
     * 
     * @param {BigInteger} id - The template id that the user is selecting or unselecting 
     */
    const onSelectTemplatePermission = (id) => {
        if (templatesUserHaveAccess.includes(id)) {
            const indexToRemove = templatesUserHaveAccess.indexOf(id)
            const templateToRemove = props.formulariesAndFieldPermissionsOptions.filter(template=> template.id === id)
            const formIdsToRemove = templateToRemove[0].form_group.map(form => form.id)
            // reference on why i do [].concat.apply https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
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
            templatesUserHaveAccess.push(id)
        }
        setTemplatesUserHaveAccess([...templatesUserHaveAccess])
    }

    /**
     * This function is used to submit the user data to the backend. First things first. When we submit we acually
     * mounts the body object inside here. Yep this might duplicate some code and you need to be aware of future object changes
     * that the backend expect.
     * 
     * But this actually make it easier for us to manage most stuff in this formulary.
     * 
     * We also need to send the url to change the password. We prevent the backend from knowing anything about this application
     * as Tame Impala would have said "The less i know the better". If we ever change the url or anything the backend doesn't need to know anything.
     * 
     * We use this url so the user can change his password to start using the system.
     * 
     * @param {BigInteger} userId - If defined you are editing a user, if not defined you are actually creating a new user.
     * That's how we can easily duplicate the data from a user to another.
     */
    const onSubmit = (userId=null) => {
        setIsLoading(true)
        const data = {
            id: userId,
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            profile: profileId,
            option_accessed_by_user: optionsUserHaveAccess.map(optionAccessedBy => ({field_option_id: optionAccessedBy})),
            form_accessed_by_user: formulariesUserHaveAccess.map(formularyAccessedBy => ({form_id: formularyAccessedBy})),
            change_password_url: (process.env['APP']=== 'web') ? window.location.origin + paths.changepassword().asUrl + '?temp_pass={}' : 
                                  FRONT_END_HOST + paths.changepassword().asUrl + '?temp_pass={}'
        }
        props.onSubmitForm(data).then(response => {
            if (response && response.status === 200) {
                props.onGetUsersConfiguration(sourceRef.current).then(response=> {
                    setIsLoading(false)
                    if (response && response.status === 200) {
                        props.onCloseFormulary()
                    }
                })
            } else {
                const errorKeys = Array.from(Object.keys(response.data.error))
                if (errorKeys.includes('email')) {
                    errors['email'] = errorMessages['email']
                } else if (errorKeys.includes('first_name') || errorKeys.includes('last_name')) {
                    errors['name'] = errorMessages['name']
                } else if (errorKeys.includes('detail') && response.data.error['detail'].includes('profile')) {
                    errors['profile'] = errorMessages['profile']
                } else if (errorKeys.includes('detail') && response.data.error['detail'].includes('email')) {
                    errors['email'] = errorMessages['unique_email']
                } else if (errorKeys.includes('detail') && response.data.error['detail'].includes('cannot_edit_itself')) {
                    props.onAddNotification(strings['pt-br']['userConfigurationCannotEditItselfError'], 'error')
                    props.onCloseFormulary()
                } else if (errorKeys.includes('detail') && response.data.error['detail'].includes('failed_to_update_payment_gateway')) {
                    props.onAddNotification(strings['pt-br']['userConfigurationPaymentGatewayError'], 'error')
                    props.onCloseFormulary()
                }
                setErrors({...errors})
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        // We just change stuff when the formulary is open. 
        // As said earlier we actually use this state directly, most of the keys of the userData object is
        // a single state in this component.
        // - When the profile is not defined we automatically define the user as an ADMIN.
        // - We don't have the templates selected by the user as a default, so we need to map all of the formularies selected
        // by the user and see which template does it match to. We use this data so we can display a nice and concise permission formulary
        // with an hierarchy.
        if (props.isOpen) {
            const formularyIdsAccessedByUser = props.userData.form_accessed_by_user.map(formAccessedBy => formAccessedBy.form_id)
            const optionIdsAccessedByUser = props.userData.option_accessed_by_user.map(optionAccessedBy => optionAccessedBy.field_option_id)
            const userSelectedTemplates = props.formulariesAndFieldPermissionsOptions
                                            .filter(template => template.form_group.filter(form=> formularyIdsAccessedByUser.includes(form.id)).length > 0)
                                            .map(template => template.id)
            setTemplatesUserHaveAccess([...userSelectedTemplates])
            setOptionsUserHaveAccess([...optionIdsAccessedByUser])
            setFormulariesUserHaveAccess([...formularyIdsAccessedByUser])
            setName(!['', null].includes(props.userData.last_name) ? `${props.userData.first_name} ${props.userData.last_name}` : `${props.userData.first_name}`)
            setEmail(`${props.userData.email}`)
            setUserId(props.userData.id)
            if (props.userData.profile === null) {
                const profileId = props.types.defaults.profile_type.filter(profileType => profileType.name === 'admin')[0].id
                setProfileId(profileId)
            } else {
                setProfileId(props.userData.profile)
            }
        }
    }, [props.isOpen, props.userData])

    useEffect(() => {
        // set the profileType options for the select component
        if (isMountedRef.current) {
            setProfileTypeOptions(
                (props?.types?.defaults?.profile_type || []).map(profileType => ({ 
                    value: profileType.id, 
                    label: types('pt-br', 'profile_type', profileType.name) 
                }))
            )
        }
    }, [props.types])

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <Modal animationType={'slide'} visible={props.isOpen}>
                <SafeAreaView>
                    <View style={{ direction: 'rtl' }}>
                        <UsersFormularyGoBackButton onPress={e=> {props.onCloseFormulary()}}>
                            <FontAwesomeIcon icon={'times'}/>
                        </UsersFormularyGoBackButton>
                    </View>
                    <UsersFormularyFieldsAndPermissionContainer>
                        <UsersFormularyFieldContainer>
                            <UsersFormularyFieldLabel>
                                {strings['pt-br']['userConfigurationFormularyNameLabel']}
                            </UsersFormularyFieldLabel>
                            <UsersFormularyFieldInput 
                            errors={errors.hasOwnProperty('name')} 
                            type={'text'} 
                            onChange={e => {onChangeName(e.nativeEvent.text)}}
                            value={name}
                            />
                            {errors.hasOwnProperty('name') ? (
                                <UsersFormularyFieldError>
                                    {errors.name}
                                </UsersFormularyFieldError>
                            ) : null}
                        </UsersFormularyFieldContainer>
                        <UsersFormularyFieldContainer>
                            <UsersFormularyFieldLabel>
                                {strings['pt-br']['userConfigurationFormularyEmailLabel']}
                            </UsersFormularyFieldLabel>
                            <UsersFormularyFieldInput 
                            type={'text'} 
                            autoCapitalize='none'
                            errors={errors.hasOwnProperty('email')} 
                            onChange={e => {onChangeEmail(e.nativeEvent.text)}}
                            value={email}
                            />
                            {errors.hasOwnProperty('email') ? (
                                <UsersFormularyFieldError>
                                    {errors.email}
                                </UsersFormularyFieldError>
                            ) : null}
                        </UsersFormularyFieldContainer>
                        <UsersFormularyFieldContainer>
                            <UsersFormularyFieldLabel>
                                {strings['pt-br']['userConfigurationFormularyProfileLabel']}
                            </UsersFormularyFieldLabel>
                            <UsersFormularyFieldSelectContainer isOpen={profileSelectorIsOpen} errors={errors.hasOwnProperty('profile')}>
                                <Select 
                                options={profileTypeOptions}
                                initialValues={profileTypeOptions.filter(profileTypeOption => profileTypeOption.value === profileId)} 
                                onChange={onChangeProfile}
                                isOpen={profileSelectorIsOpen}
                                setIsOpen={setProfileSelectorIsOpen}
                                />
                            </UsersFormularyFieldSelectContainer>
                            {errors.hasOwnProperty('profile') ? (
                                <UsersFormularyFieldError>
                                    {errors.profile}
                                </UsersFormularyFieldError>
                            ) : null}
                        </UsersFormularyFieldContainer>
                        <Text style={{ fontSize: 30, marginLeft: 10, marginRight: 10, marginBottom: 15 }}>
                        {formulariesUserHaveAccess.length > 0 ? 
                            strings['pt-br']['userConfigurationFormularyPermissionOptionSelectLabel'] : 
                            templatesUserHaveAccess.length > 0 ? 
                                strings['pt-br']['userConfigurationFormularyPermissionPageSelectLabel'] : 
                                strings['pt-br']['userConfigurationFormularyPermissionTemplateSelectLabel']
                        }
                        </Text>
                        {props.formulariesAndFieldPermissionsOptions.map(template => (
                            <View key={template.id}>
                                <UsersFormularyPermissionSelectionButton 
                                onPress={e=> onSelectTemplatePermission(template.id)}
                                >
                                    {templatesUserHaveAccess.includes(template.id)}
                                    <UsersFormularyPermissionsIcon 
                                    icon={(templatesUserHaveAccess.includes(template.id)) ? 'check' : 'times'}
                                    isSelected={templatesUserHaveAccess.includes(template.id)}
                                    />
                                    <UsersFormularyPermissionTemplateTitle
                                    isSelected={templatesUserHaveAccess.includes(template.id)}
                                    >
                                        {template.name}
                                    </UsersFormularyPermissionTemplateTitle>
                                </UsersFormularyPermissionSelectionButton>
                                {templatesUserHaveAccess.includes(template.id) ? template.form_group.map(formulary => (
                                    <View key={formulary.id}>
                                        <UsersFormularyPermissionSelectionButton
                                        onPress={e => onSelectFormularyPermission(formulary.id)}
                                        >
                                            <UsersFormularyPermissionFormularyContainer>
                                                <UsersFormularyPermissionsIcon 
                                                icon={(formulariesUserHaveAccess.includes(formulary.id)) ? 'check' : 'times'}
                                                isSelected={formulariesUserHaveAccess.includes(formulary.id)}
                                                />
                                                <UsersFormularyPermissionFormularyTitle
                                                isSelected={formulariesUserHaveAccess.includes(formulary.id)}
                                                >
                                                    {formulary.label_name}
                                                </UsersFormularyPermissionFormularyTitle>
                                            </UsersFormularyPermissionFormularyContainer>
                                        </UsersFormularyPermissionSelectionButton>
                                        {formulariesUserHaveAccess.includes(formulary.id) ? formulary.form_fields.map((field, index) => (
                                            <View key={index}>
                                                <UsersFormularyPermissionFieldContainer>
                                                    <UsersFormularyPermissionFieldTitle>
                                                        {field.label_name}
                                                    </UsersFormularyPermissionFieldTitle>
                                                </UsersFormularyPermissionFieldContainer>
                                                {field.field_option.map(option => (
                                                    <UsersFormularyPermissionSelectionButton 
                                                    key={option.id} 
                                                    onPress={e => onSelectOptionPermission(option.id)}
                                                    >
                                                        <UsersFormularyPermissionOptionContainer>
                                                            <UsersFormularyPermissionsIcon 
                                                            icon={(optionsUserHaveAccess.includes(option.id)) ? 'check' : 'times'}
                                                            isSelected={optionsUserHaveAccess.includes(option.id)}
                                                            />
                                                            <UsersFormularyPermissionOptionTitle
                                                            isSelected={optionsUserHaveAccess.includes(option.id)}
                                                            >
                                                                {option.option}
                                                            </UsersFormularyPermissionOptionTitle>
                                                        </UsersFormularyPermissionOptionContainer>
                                                    </UsersFormularyPermissionSelectionButton>
                                                ))}
                                            </View>
                                        )) : null}
                                    </View>
                                )) : null}
                            </View>
                        ))}
                        <UsersFormularySaveButton onPress={e => isLoading ? null : onSubmit(userId)}>
                            {isLoading ? (
                                <ActivityIndicator/>
                            ) : (
                                <UsersFormularySaveButtonText>
                                    {strings['pt-br']['userConfigurationFormularySaveButtonLabel']}
                                </UsersFormularySaveButtonText>
                            )}
                        </UsersFormularySaveButton>
                        {userId ? (
                            <UsersFormularyDuplicateButton onPress={e => isLoading ? null : onSubmit(null)}>
                                {isLoading ? (
                                    <ActivityIndicator/>
                                ) : (
                                    <UsersFormularyDuplicateButtonText>
                                        {strings['pt-br']['userConfigurationFormularyDuplicateButtonLabel']}
                                    </UsersFormularyDuplicateButtonText>
                                )}
                            </UsersFormularyDuplicateButton>
                        ) : null}
                    </UsersFormularyFieldsAndPermissionContainer>
                </SafeAreaView>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <UsersFormularyContainer isOpen={props.isOpen}>
                <div style={{width: '100%', marginBottom: '10px'}}>
                    <UsersFormularyGoBackButton onClick={e=> {props.onCloseFormulary()}}>
                        <FontAwesomeIcon icon={'chevron-left'}/>&nbsp;{strings['pt-br']['userConfigurationFormularyGoBackButton']}
                    </UsersFormularyGoBackButton>
                </div>
                <UsersFormularyFieldsAndPermissionContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            {strings['pt-br']['userConfigurationFormularyNameLabel']}
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldInput 
                        errors={errors.hasOwnProperty('name')} 
                        type={'text'} 
                        onChange={e => {onChangeName(e.target.value)}}
                        value={name}
                        />
                        {errors.hasOwnProperty('name') ? (
                            <UsersFormularyFieldError>
                                {errors.name}
                            </UsersFormularyFieldError>
                        ) : ''}
                    </UsersFormularyFieldContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            {strings['pt-br']['userConfigurationFormularyEmailLabel']}
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldInput 
                        type={'text'} 
                        errors={errors.hasOwnProperty('email')} 
                        onChange={e => {onChangeEmail(e.target.value)}}
                        value={email}
                        />
                        {errors.hasOwnProperty('email') ? (
                            <UsersFormularyFieldError>
                                {errors.email}
                            </UsersFormularyFieldError>
                        ) : ''}
                    </UsersFormularyFieldContainer>
                    <UsersFormularyFieldContainer>
                        <UsersFormularyFieldLabel>
                            {strings['pt-br']['userConfigurationFormularyProfileLabel']}
                        </UsersFormularyFieldLabel>
                        <UsersFormularyFieldSelectContainer isOpen={profileSelectorIsOpen} errors={errors.hasOwnProperty('profile')}>
                            <Select 
                            options={profileTypeOptions}
                            initialValues={profileTypeOptions.filter(profileTypeOption => profileTypeOption.value === profileId)} 
                            onChange={onChangeProfile}
                            isOpen={profileSelectorIsOpen}
                            setIsOpen={setProfileSelectorIsOpen}
                            />
                        </UsersFormularyFieldSelectContainer>
                        {errors.hasOwnProperty('profile') ? (
                            <UsersFormularyFieldError>
                                {errors.profile}
                            </UsersFormularyFieldError>
                        ) : ''}
                    </UsersFormularyFieldContainer>
                    <h2>
                        {formulariesUserHaveAccess.length > 0 ? 
                            strings['pt-br']['userConfigurationFormularyPermissionOptionSelectLabel'] : 
                            templatesUserHaveAccess.length > 0 ? 
                                strings['pt-br']['userConfigurationFormularyPermissionPageSelectLabel'] : 
                                strings['pt-br']['userConfigurationFormularyPermissionTemplateSelectLabel']
                        }
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
                    <UsersFormularySaveButton onClick={e=> isLoading ? null : onSubmit(userId)}>
                        {isLoading ? (
                            <Spinner animation="border"/>
                        ) : (
                            <UsersFormularySaveButtonText>
                                {strings['pt-br']['userConfigurationFormularySaveButtonLabel']}
                            </UsersFormularySaveButtonText>
                        )}
                    </UsersFormularySaveButton>
                    {userId ? (
                        <UsersFormularyDuplicateButton onClick={e=> isLoading ? null : onSubmit(null)}>
                            {isLoading ? (
                                <Spinner animation="border"/>
                            ) : (
                                <UsersFormularyDuplicateButtonText>
                                    {strings['pt-br']['userConfigurationFormularyDuplicateButtonLabel']}
                                </UsersFormularyDuplicateButtonText>
                            )}
                        </UsersFormularyDuplicateButton>
                    ) : ''}
                </UsersFormularyFieldsAndPermissionContainer>
            </UsersFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default UsersForm