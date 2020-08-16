import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import actions from '../../redux/actions'
import UsersForm from './UsersForm'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Users extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isOpenForm: false,
            userDataToEdit: null
        }
    }

    onAddNewUser = () => {
        return {
            id: null,
            username: '',
            first_name: '',
            last_name: '',
            profile_id: 3,
            option_accessed_by_user: [],
            form_accessed_by_user: []
        }
    }

    onOpenFormulary = (userData=null) => {
        userData = userData ? userData : this.onAddNewUser()
        this.setState(state => ({
            ...state,
            isOpenForm: true,
            userDataToEdit: userData
        }))
    }

    onCloseFormulary = () => {
        this.setState(state => ({
            ...state,
            isOpenForm: false,
            userDataToEdit: null
        }))
    }

    onSubmitForm = (data) => {
        if (data.id) {

        } else {
            
        }
    }

    getProfileNameFromId = (profileId) => {
        const filteredProfile = this.props.types.defaults.profile_type.filter(profileType => profileType.id === profileId)
        return filteredProfile.length > 0 ? filteredProfile[0].name : ''
    }

    getFullName = (firstName, lastName) => {
        return [firstName, lastName].join(' ')
    }

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
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <table style={{ width: '100%'}}>
                    <thead>
                        <tr>
                            <th>E-mail</th>
                            <th>Nome</th>
                            <th>Perfil</th>
                            <th>Editar</th>
                            <th>Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.update.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    {user.username}
                                </td>
                                <td>
                                    {this.getFullName(user.first_name, user.last_name)}
                                </td>
                                <td>
                                    {this.getProfileNameFromId(user.profile_id)}
                                </td>
                                <td>
                                    <FontAwesomeIcon icon={'pencil-alt'} onClick={e => this.onOpenFormulary(user)}/>
                                </td>
                                <td>
                                    <FontAwesomeIcon icon={'trash'}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <UsersForm 
                formulariesAndFieldPermissionsOptions={this.props.users.formulariesAndFieldPermissionsOptions}
                isOpen={this.state.isOpenForm}
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