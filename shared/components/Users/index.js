import React from 'react'
import { View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import axios from 'axios'
import UsersForm from './UsersForm'
import { types, strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import actions from '../../redux/actions'
import Alert from '../Utils/Alert'
import {
    UsersTable,
    UsersEditIcon,
    UsersTrashIcon,
    UsersTableContent,
    UsersTableHeadItem,
    UsersTableHeadText,
    UsersAddNewUserButton
} from '../../styles/Users'

const connect = dynamicImport('reduxConnect', 'default')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component is responsible for configuring users in the reflow software. It's important to understand
 * this users are the ones that the admin of the company define. The user can also edit his own information if he wants
 * BUT he can't update it's own permissions, only admins can update permissions.
 */
class Users extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.scrollHeader = null
        this.scrollElements = []
        this.state = {
            isLoading: false,
            userIdToDelete: null,
            showAlert: false,
            isOpenForm: false,
            userDataToEdit: null
        }
    }

    setIsLoading = (data) => this.setState(state => ({...state, isLoading: data}))
    setShowAlert = (data) => this.setState(state => ({...state, showAlert: data}))
    setUserIdToDelete = (userId) => this.setState(state => ({...state, userIdToDelete: userId}))
    
    /**
     * This function handles when the user clicks to remove a user. When he clicks we show an alert
     * so we can prevent miss click and also set the user id to delete.
     * 
     * @param {BigInteger} userId - The userId you want to delete, it'll be available `on userIdToDelete` state variable.
     */
    onClickRemove = (userId) => {
        this.setState(state => ({
                ...state, 
                showAlert: true,
                userIdToDelete: userId
            })
        )
    }

    /**
     * This is the skeleton of the user data needed to create a new user. We use this to pass this data to the UsersForm.
     */
    onAddNewUser = () => {
        return {
            id: null,
            email: '',
            first_name: '',
            last_name: '',
            has_api_access_key: false,
            profile: null,
            option_accessed_by_user: [],
            form_accessed_by_user: [],
            user_accessed_by_user: []
        }
    }

    /**
     * The formulary is rendered when this component renders because with this we can show an simple animation
     * of it opening from the bottom. Because of this when we open the formulary we need to set the data on this component
     * If no userData is supplied we understand that you are trying to add a new user so we use the `onAddNewUser` function
     * 
     * This state is responsible for opening the formulary and setting the data to edit. 
     * 
     * @param {Object} userData - The user data to edit, if none is supplied we automatically create a new. Usually this data is recieved
     * from the backend for you to load the table.
     */
    onOpenFormulary = (userData=null) => {
        userData = userData ? userData : this.onAddNewUser()
        this.setState(state => ({
            ...state,
            isOpenForm: true,
            userDataToEdit: userData
        }))
    }

    /**
     * Sets the userDataToEdit to null and sets `isOpenForm` state to false. This way we close the formulary and also 
     * reset the data of the formulary.
     */
    onCloseFormulary = () => {
        this.setState(state => ({
            ...state,
            isOpenForm: false,
            userDataToEdit: null
        }))
        // when we close the formulary set the scroll to the initial position
        if (process.env['APP'] !== 'web') {
            this.onScrollRow(0)
        }
    }

    /**
     * This effectively removes the user. If everything goes fine we load the users data again from the backend to repopulate
     * the table of users. 
     * 
     * The exception we handle here is when the user tries to remove himself, obviously this is kinda dumb so we prevent the
     * user from doing this.
     * 
     * @param {BigInteger} userId - The userId to remove.
     */
    onRemoveUser = (userId) => {
        this.setIsLoading(true)
        this.props.onRemoveUsersConfiguration(userId).then(response => {
            if (response && response.status === 200) {
                this.props.onGetUsersConfiguration(this.source).then(response=> {
                    this.setIsLoading(false)
                })
            } else {
                const errorKeys = Array.from(Object.keys(response.data.error))
                if (errorKeys.includes('detail') && response.data.error['detail'].includes('cannot_edit_itself')) {
                    this.props.onAddNotification(strings['pt-br']['userConfigurationCannotEditItselfError'], 'error')
                }
            }
            this.setIsLoading(false)
        })
    }

    /**
     * If an id is defined then we are updating the user, if no id is defined for the data we are creating a new user.
     * 
     * This is actually a pretty dumb function, most of the logic for submiting resides on UsersForm component.
     * 
     * @param {Object} data - The body of the request, usually it follows the same
     * structure defined in `onAddNewUser()` function.
     */
    onSubmitForm = (data) => {
        if (data.id) {
            return this.props.onUpdateUsersConfiguration(data, data.id)
        } else {
            return this.props.onCreateUsersConfiguration(data)
        }
    }

    /**
     * Helper function for retriving the profile name from a profileid. This is handy because profile_type is a type data this means
     * it is a list, this prevents us from doing this code everytime we want the name of the profile based on an profileId
     * 
     * @param {BigInteger} profileId - Usually a profile.id, check the possible options on `types.defaults.profile_type`
     */
    getProfileNameFromId = (profileId) => {
        const filteredProfile = this.props.types.defaults.profile_type.filter(profileType => profileType.id === profileId)
        return filteredProfile.length > 0 ? filteredProfile[0].name : ''
    }

    /**
     * Django is kinda dumb so it forces us to create a firstName and a lastName for the user.
     * The user actually don't know this, instead we show his complete name. This is handy for loading the users in the listing table.
     * 
     * @param {String} firstName - The first name of the user
     * @param {String} lastName - The last name of the user
     */
    getFullName = (firstName, lastName) => {
        return [firstName, lastName].join(' ')
    }

    /**
     * ONLY FOR MOBILE. This is used so we can scroll on the table horizontally and vertically.
     * @param {Object} e - The REACT NATIVE scroll event object
     */
    onScrollRow = (scrollX) => {
        this.scrollHeader.scrollTo({ x: scrollX, animated: false })
        this.scrollElements.forEach(element => {
            if (element) {
                element.scrollTo({ x: scrollX, animated: false })
            }
        })
    }


    /**
     * When we mount the component we get two things: 
     * 1 - The Formulary and Field options, this is what we use so we can build the permissions formulary
     * 2 - The user data as an array. This user data is used to populate the table and also used when editing.
     */
    componentDidMount = () => {
        this.source = this.cancelToken.source()
        this.props.onGetFormularyAndFieldOptions(this.source)
        this.props.onGetUsersConfiguration(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }
    
    renderMobile = () => {
        return (
            <View style={{ height: '100%'}}>
                <Alert 
                alertTitle={strings['pt-br']['userConfigurationDeleteUserAlertTitle']} 
                alertMessage={strings['pt-br']['userConfigurationDeleteUserAlertContent']} 
                show={this.state.showAlert} 
                onHide={() => {
                    this.setShowAlert(false)
                }} 
                onAccept={() => {
                    this.setShowAlert(false)
                    this.onRemoveUser(this.state.userIdToDelete)
                }}
                onAcceptButtonLabel={strings['pt-br']['userConfigurationDeleteUserAlertAcceptButton']}
                />
                <UsersAddNewUserButton 
                onPress={e=> this.onOpenFormulary()}
                >
                    <Text style={{ fontSize: 37, color: '#fff', textAlign: 'center', height: '100%', width: '100%'}}>
                        {'+'}
                    </Text>
                </UsersAddNewUserButton>
                <UsersTable keyboardShouldPersistTaps={'handled'}>
                    <View style={{ flexDirection: "row", borderTopWidth: 1 }}>
                        <ScrollView horizontal={true} scrollEnabled={false} scrollEventThrottle={16} ref={ref => (this.scrollHeader = ref)}>
                            <UsersTableHeadItem>
                                <UsersTableHeadText>
                                    {strings['pt-br']['userConfigurationTableEmailColumnHeaderLabel']}
                                </UsersTableHeadText>
                            </UsersTableHeadItem>
                            <UsersTableHeadItem>
                                <UsersTableHeadText>
                                    {strings['pt-br']['userConfigurationTableNameColumnHeaderLabel']}
                                </UsersTableHeadText>
                            </UsersTableHeadItem>
                            <UsersTableHeadItem>
                                <UsersTableHeadText>
                                    {strings['pt-br']['userConfigurationTableProfileColumnHeaderLabel']}
                                </UsersTableHeadText>
                            </UsersTableHeadItem>
                            <UsersTableHeadItem isEditOrDeleteColumn={true}>
                                <UsersTableHeadText isEditOrDeleteColumn={true}>
                                    {strings['pt-br']['userConfigurationTableEditColumnHeaderLabel']}
                                </UsersTableHeadText>
                            </UsersTableHeadItem>
                            <UsersTableHeadItem isEditOrDeleteColumn={true}>
                                <UsersTableHeadText isEditOrDeleteColumn={true}>
                                    {strings['pt-br']['userConfigurationTableDeleteColumnHeaderLabel']}
                                </UsersTableHeadText>
                            </UsersTableHeadItem>
                        </ScrollView>
                    </View>
                    <FlatList
                    keyExtractor={(user) => user.id.toString()}
                    data={this.props.users.update}
                    renderItem={({ item, index, __ }) => (
                        <View>
                            <ScrollView
                            ref={ref=> this.scrollElements[index] = ref}
                            alwaysBounceHorizontal={false}
                            bounces={false}
                            horizontal={true}
                            scrollEventThrottle={16}
                            onScroll={ e=> this.onScrollRow(e.nativeEvent.contentOffset.x)}
                            >
                                <View key={index} style={{flexDirection: "row"}}>
                                    <UsersTableContent>
                                        <Text>
                                            {item.email}
                                        </Text>
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        <Text>
                                            {this.getFullName(item.first_name, item.last_name)}
                                        </Text>
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        <Text>
                                            {types('pt-br', 'profile_type', this.getProfileNameFromId(item.profile))}
                                        </Text>
                                    </UsersTableContent>
                                    <UsersTableContent isEditOrDeleteColumn={true}>
                                        <TouchableOpacity onPress={e => this.state.isLoading ? null : this.onOpenFormulary(item)}>
                                            {this.state.isLoading ? (
                                                <ActivityIndicator/>
                                            ) : (
                                                <UsersEditIcon icon={'pencil-alt'}/>
                                            )}
                                        </TouchableOpacity>
                                    </UsersTableContent>
                                    <UsersTableContent isEditOrDeleteColumn={true}>
                                        <TouchableOpacity onPress={e=> this.state.isLoading ? null : this.onClickRemove(item.id)}>
                                            {this.state.isLoading ? (
                                                <ActivityIndicator/>
                                            ) : (
                                                <UsersTrashIcon icon={'trash'}/>
                                            )}
                                        </TouchableOpacity>

                                    </UsersTableContent>
                                </View>
                            </ScrollView>
                        </View>
                    )}
                    />
                </UsersTable>
                <UsersForm
                userOptions={this.props.users.update}
                cancelToken={this.cancelToken}
                onAddNotification={this.props.onAddNotification}
                onGetUsersConfiguration={this.props.onGetUsersConfiguration}
                formulariesAndFieldPermissionsOptions={this.props.users.formulariesAndFieldPermissionsOptions}
                isOpen={this.state.isOpenForm}
                onSubmitForm={this.onSubmitForm}
                types={this.props.types}
                userData={this.state.userDataToEdit}
                onCloseFormulary={this.onCloseFormulary}
                />
            </View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <Alert 
                alertTitle={strings['pt-br']['userConfigurationDeleteUserAlertTitle']} 
                alertMessage={strings['pt-br']['userConfigurationDeleteUserAlertContent']} 
                show={this.state.showAlert} 
                onHide={() => {
                    this.setShowAlert(false)
                }} 
                onAccept={() => {
                    this.setShowAlert(false)
                    this.onRemoveUser(this.state.userIdToDelete)
                }}
                onAcceptButtonLabel={strings['pt-br']['userConfigurationDeleteUserAlertAcceptButton']}
                />

                <UsersAddNewUserButton 
                onClick={e=> this.onOpenFormulary()}
                >
                    {strings['pt-br']['userConfigurationAddNewUserButtonLabel']}
                </UsersAddNewUserButton>
                <UsersTable>
                    <table style={{width: '100%'}}>
                        <thead>
                            <tr>
                                <UsersTableHeadItem isFirstColumn={true}>
                                    <UsersTableHeadText>
                                        {strings['pt-br']['userConfigurationTableEmailColumnHeaderLabel']}
                                    </UsersTableHeadText>
                                </UsersTableHeadItem>
                                <UsersTableHeadItem>
                                    <UsersTableHeadText>
                                        {strings['pt-br']['userConfigurationTableNameColumnHeaderLabel']}
                                    </UsersTableHeadText>
                                </UsersTableHeadItem>
                                <UsersTableHeadItem>
                                    <UsersTableHeadText>
                                        {strings['pt-br']['userConfigurationTableProfileColumnHeaderLabel']}
                                    </UsersTableHeadText>
                                </UsersTableHeadItem>
                                <UsersTableHeadItem>
                                    <UsersTableHeadText isEditOrDeleteColumn={true}>
                                        {strings['pt-br']['userConfigurationTableEditColumnHeaderLabel']}
                                    </UsersTableHeadText>
                                </UsersTableHeadItem>
                                <UsersTableHeadItem isLastColumn={true}>
                                    <UsersTableHeadText isEditOrDeleteColumn={true}>
                                        {strings['pt-br']['userConfigurationTableDeleteColumnHeaderLabel']}
                                    </UsersTableHeadText>
                                </UsersTableHeadItem>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.users.update.map((user, index) => (
                                <tr key={index}>
                                    <UsersTableContent>
                                        {user.email}
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        {this.getFullName(user.first_name, user.last_name)}
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        {types('pt-br', 'profile_type', this.getProfileNameFromId(user.profile))}
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        {this.state.isLoading ? (
                                            <Spinner animation="border" size="sm"/>
                                        ) : (
                                            <UsersEditIcon icon={'pencil-alt'} onClick={e => this.onOpenFormulary(user)}/>
                                        )}
                                    </UsersTableContent>
                                    <UsersTableContent>
                                        {this.state.isLoading ? (
                                            <Spinner animation="border" size="sm"/>
                                        ) : (
                                            <UsersTrashIcon icon={'trash'} onClick={e=> this.onClickRemove(user.id)}/>
                                        )}
                                    </UsersTableContent>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </UsersTable>
                <UsersForm 
                cancelToken={this.cancelToken}
                userOptions={this.props.users.update}
                onAddNotification={this.props.onAddNotification}
                onGetUsersConfiguration={this.props.onGetUsersConfiguration}
                formulariesAndFieldPermissionsOptions={this.props.users.formulariesAndFieldPermissionsOptions}
                isOpen={this.state.isOpenForm}
                onSubmitForm={this.onSubmitForm}
                types={this.props.types}
                userData={this.state.userDataToEdit}
                onCloseFormulary={this.onCloseFormulary}
                />
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({types: state.login.types, users: state.users}), actions)(Users)