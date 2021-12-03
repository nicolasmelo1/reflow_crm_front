import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import agent from '../../utils/agent'
import { strings, paths } from '../../utils/constants'
import { FRONT_END_HOST } from '../../config'
import Styled from './styles'

/**
 * This will display a simplified user modal so the user is able to create a batch of users inside of reflow in a single time.
 * 
 * @param {object} props - The props the Component recieves
 * @param {Array<[string, string]> | undefined} [props.userFullnamesOrEmails=undefined] - An array of arrays where the first index 
 * of the array is the fullname and the second is the email of the user.
 */
const SimplifiedUserModal = (props) => {
    const [users, setUsers] = useState(getDefaultUsers())

    function getDefaultUsers() {
        if (props?.userFullnamesOrEmails !== undefined && props.userFullnamesOrEmails.length > 0) {
            return props.userFullnamesOrEmails.map((options, index) => {
                isValid(index, 'name', options[0])
                isValid(index, 'email', options[1])
                return options
        })
        } else {
            return [['', '']]
        }
    }
    
    /**
     * Checks if a given name or email value are valid.
     * 
     * @param {'name' | 'email'} type - The type can be either a e-mail or name, we will update the list if the index is
     * valid or invalid for the given type.
     * @param {string} value - The value to check if it's valid.
     */
    function isValid(type, value) {
        switch (type) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
            case 'email':
                return ![null, undefined, ''].includes(value) && /\S+@\S+\.\S+/g.test(value)
        }
    }

    /**
     * Changes the name of the user at the given index in the list of user names and emails
     * 
     * @param {number} index - The index of the user you wish to change the name
     * @param {string} value - The FullName of the user.
     */
    const onChangeName = (index, value) => {
        users[index][0] = value
        setUsers([...users])
    }

    /**
     * Changes the email of the user at the given index in the list of user names and emails
     * 
     * @param {number} index - The index of the user you wish to change the email
     * @param {string} value - The email of the user.
     */
    const onChangeEmail = (index, value) => {
        users[index][1] = value
        setUsers([...users])
    }

    /**
     * Function used when the user clicks the trash icon to remove a user.
     * 
     * @param {number} index - The index of the user the user wants to remove from the list
     * and dosn't want to add.
     */
    const onRemoveUser = (index) => {
        users.splice(index, 1)
        setUsers([...users])
    }

    /**
     * Function used to add a new user, so the user can type the email and the full name of the user to add.
     */
    const onAddNewUser = () => {
        users.push(['', ''])
        setUsers([...users])
    }

    /**
     * Submits the users to the backend with it's names and emails.
     */
    const onSubmit = () => {
        const data = []
        for (const user of users) {
            if (user[0] !== '' && user[1] !== '' && isValid('name', user[0]) && isValid('email', user[1])) {  
                data.push({
                    first_name: user[0].split(' ')[0],
                    last_name: user[0].split(' ').slice(1).join(' '),
                    email: user[1],
                    change_password_url: (process.env['APP']=== 'web') ? 
                                            window.location.origin + paths.changepassword().asUrl + '?temp_pass={}' : 
                                            FRONT_END_HOST + paths.changepassword().asUrl + '?temp_pass={}'
                })
            }
        }
        agent.http.USERS.bulkCreateUsers(data).then(response => {
            props.callbackOnSubmit(response)
        })
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.UserModalContainer>
                <Styled.UserModalFormularyContainer>
                    <Styled.UserModalNavigationContainer>
                        <Styled.UserModalNavigationCloseModalButton
                        onClick={() => props.onCloseModal()}
                        >
                            <FontAwesomeIcon icon={"times"}/>
                        </Styled.UserModalNavigationCloseModalButton>
                    </Styled.UserModalNavigationContainer>
                    <Styled.UserModalTitle>
                        {strings['pt-br']['userSimplifiedModalTitle']}
                    </Styled.UserModalTitle>
                    <Styled.UserModalFormularyHeaderContainer>
                        <Styled.UserModalFormularyHeaderLabel>
                            {strings['pt-br']['userSimplifiedModalNameLabel']}
                        </Styled.UserModalFormularyHeaderLabel>
                        <Styled.UserModalFormularyHeaderLabel>
                            {strings['pt-br']['userSimplifiedModalEmailLabel']}
                        </Styled.UserModalFormularyHeaderLabel>
                        {users.length > 1 ? (
                            <div style={{ width: '35px',  }}/>
                        ) : ''}
                    </Styled.UserModalFormularyHeaderContainer>
                    <Styled.UserModalFormularyRowsContainer>
                        {users.map((user, index) => (
                            <div
                            key={index}
                            >
                                <Styled.UserModalFormularyUserInputsRow>
                                    <Styled.UserModalFormularyInput 
                                    autoComplete={'whathever'}
                                    isInvalid={isValid('name', user[0]) === false}
                                    type={'text'}
                                    value={user[0]}
                                    onChange={(e) => onChangeName(index, e.target.value)}
                                    />
                                    <Styled.UserModalFormularyInput 
                                    autoComplete={'whathever'}
                                    isInvalid={isValid('email', user[1]) === false}
                                    type={'text'}
                                    value={user[1]}
                                    onChange={(e) => onChangeEmail(index, e.target.value)}
                                    />
                                    {index !== 0 ? (
                                        <Styled.UserModalFormularyExcludeUserButton
                                        onClick={(e) => onRemoveUser(index)}
                                        >
                                            <Styled.UserModalFormularyExcludeIcon 
                                            icon={'trash'}
                                            />
                                        </Styled.UserModalFormularyExcludeUserButton>
                                    ) : ''}
                                </Styled.UserModalFormularyUserInputsRow>
                                <Styled.UserModalFormularyUserInputsErrorsRow>
                                    <Styled.UserModalFormularyUserInputsErrorLabel>
                                        {isValid('name', user[0]) === false ? strings['pt-br']['userSimplifiedModalNameErrorMessage'] : ''}
                                    </Styled.UserModalFormularyUserInputsErrorLabel>
                                    <Styled.UserModalFormularyUserInputsErrorLabel>
                                        {isValid('email', user[1]) === false ? strings['pt-br']['userSimplifiedModalEmailErrorMessage'] : ''}
                                    </Styled.UserModalFormularyUserInputsErrorLabel>
                                    {users.length > 1 ? (
                                        <div style={{ width: '35px',  }}/>
                                    ) : ''}
                                </Styled.UserModalFormularyUserInputsErrorsRow>
                            </div>
                        ))}
                    </Styled.UserModalFormularyRowsContainer>
                    <Styled.UserModalFormularyButtonsContainer>
                        <Styled.UserModalFormularyAddUserButton
                        onClick={(e) => onAddNewUser()}
                        >
                            {strings['pt-br']['userSimplifiedModalAddNewUserButtonLabel']}
                        </Styled.UserModalFormularyAddUserButton>
                        <Styled.UserModalFormularySaveButton
                        onClick={(e) => onSubmit()}
                        >
                            {strings['pt-br']['userSimplifiedModalSubmitButtonLabel']}
                        </Styled.UserModalFormularySaveButton>
                    </Styled.UserModalFormularyButtonsContainer>
                </Styled.UserModalFormularyContainer>
            </Styled.UserModalContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SimplifiedUserModal