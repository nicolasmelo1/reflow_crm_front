import React from 'react'
import Router from 'next/router';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { AsyncStorage, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform, View } from 'react-native'
import Header from './Header'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notify from './Notify'
import Templates from './Templates'
import actions from '../redux/actions'
import agent from '../utils/agent'
import { pathsAsArray } from '../utils/constants/paths'
import { paths, errors } from '../utils/constants'
import { setStorageToken } from '../utils/agent/utils'
import ContentContainer from '../styles/ContentContainer'
import Body from '../styles/Body'
import isAdmin from '../utils/isAdmin'
import { 
    faInfoCircle,
    faTasks,
    faArrowDown, 
    faCalendarAlt,  
    faPencilAlt, 
    faClock, 
    faTrash, 
    faCog, 
    faBell, 
    faArrowsAlt, 
    faArrowLeft,
    faBars,
    faPen, 
    faFilter, 
    faSortAmountDown, 
    faEye, 
    faEyeSlash,
    faChevronLeft, 
    faChevronRight, 
    faChevronUp, 
    faChevronDown, 
    faPlusCircle,
    faFileUpload,
    faTimes,
    faTimesCircle,
    faCheck
} from '@fortawesome/free-solid-svg-icons'


library.add(
    faInfoCircle,
    faTasks,
    faArrowDown, 
    faCalendarAlt,  
    faPencilAlt, 
    faClock, 
    faTrash, 
    faCog, 
    faBell, 
    faArrowsAlt, 
    faArrowLeft,
    faBars,
    faPen, 
    faFilter, 
    faSortAmountDown, 
    faEye, 
    faEyeSlash,
    faChevronLeft, 
    faChevronRight, 
    faChevronUp, 
    faChevronDown, 
    faPlusCircle,
    faFileUpload,
    faTimes,
    faTimesCircle,
    faCheck
)

/*** 
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * @param {String} title - (ONLY WEB) - Defines the title tag of the page
 * @param {Boolean} isNotLogged - (ONLY MOBILE) - Defines that the user is not logged in.
 * @param {Boolean} addTemplates - If set to true we will load a modal for the user to select the templates, otherwise we show the contents normally.
 * @param {Boolean} hideNavBar - (optional) (ONLY WEB) - Hides the navbar header
 * @param {Boolean} showSideBar - (optional) - Shows the sidebar with groups and formularies
 * */
class Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addTemplates: (this.props.addTemplates) ? this.props.addTemplates : false,
            tokenLoaded: false,
            sidebarIsOpen: false
        }
    }

    setSidebarIsOpen = () => (this._ismounted) ? this.setState(state => state.sidebarIsOpen = !state.sidebarIsOpen) : null
    setAddTemplates = (data) => (this._ismounted) ? this.setState(state => state.addTemplates = data) : null

    setToken = async () => {
        let token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
        if (!token || token === '') {
            if (this._ismounted) {
                this.setLogout(true)
            }
        }

        // this is probably an anti-pattern, i don't know actually, read here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (this._ismounted) {
            this.setState(state => state.tokenLoaded = true)
        }
        return token
    }

    checkIfUserInAdminUrl = () => {
        if (!isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user)) {
            let currentUrl = ''
            if (process.env['APP'] === 'web') {
                currentUrl = Router.pathname
            } else {
                // TODO: HANDLE MOBILE
            }
            if (pathsAsArray.filter(path => path.adminOnly === true).map(path => path.asUrl).includes(currentUrl)) {
                if (process.env['APP'] === 'web') {
                    Router.push(paths.empty().asUrl, paths.empty().asUrl,{ shallow: true })
                } else {
                    // TODO: HANDLE MOBILE
                }
            }
        }
    }
    
    permissionsHandler = async (requestStatusCode, reason) => {
        if (['not_permitted', 'invalid_billing'].includes(reason)) {
            if (this._ismounted){
                this.props.onAddNotification(errors('pt-br', reason), 'error')
            }
        } else if (requestStatusCode === 403 && reason === 'free_trial_ended') {
            // we just redirect the user if he is on the web, otherwise we just redirect him to the login page.
            if (isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user) && process.env['APP'] === 'web') {
                Router.push(paths.billing().asUrl, paths.billing().asUrl,{ shallow: true })
            } else {
                await setStorageToken('token', '')
                await setStorageToken('refreshToken', '')
                if (this._ismounted){
                    this.props.onAddNotification(errors('pt-br', reason), 'error')
                }
                this.setLogout(true)
            }
        }
    }

    setLogout = (data) => {
        if (data && !this.props.isNotLogged) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login().asUrl, paths.login().asUrl,{ shallow: true })
            } else {
                this.props.setIsAuthenticated(false)
            }
        }
        this.props.onDeauthenticate()
    }

    componentDidUpdate = () => {
        agent.setCompanyId(this.props.login.companyId)
    }

    componentDidMount = () => {
        this._ismounted = true
        this.checkIfUserInAdminUrl()
        agent.setCompanyId(this.props.login.companyId)
        agent.setLogout(this.setLogout)
        agent.setPermissionsHandler(this.permissionsHandler)
        this.props.getDataTypes()
        this.setToken()
    }

    componentWillUnmount = () => {
        this._ismounted = false
    }

    renderMobile = () => {
        const Content = () => (
            <View>
                <Notify/> 
                {(this.state.addTemplates || this.props.addTemplates) && isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user) ? (
                    <Templates setAddTemplates={this.setAddTemplates}/>
                ) : (
                    <SafeAreaView style={{ height: '100%', backgroundColor:'#fff'}}>
                        {this.props.showSideBar ?
                            <Sidebar 
                            setAddTemplates={this.state.setAddTemplates}
                            sidebarIsOpen={this.state.sidebarIsOpen} 
                            setSidebarIsOpen={this.setSidebarIsOpen} 
                            children={this.props.children} 
                            setAddTemplates={this.setAddTemplates}
                            />
                        : this.props.children}
                    </SafeAreaView>
                )}
            </View>
        )

        return (
            <SafeAreaView style={{ height: '100%', paddingTop: Platform.OS === 'android' ? 25 : 0}}>
                {this.state.tokenLoaded ? (
                    <Body>
                        {this.props.isNotLogged ? (
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <View>
                                    {Content()}
                                </View>
                            </TouchableWithoutFeedback>
                        ) : (
                            <View>
                                {Content()}
                            </View>
                        )}
                    </Body>
                ) : null }
            </SafeAreaView>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <Header title={this.props.title}/>
                {this.state.tokenLoaded ? (
                    <Body>
                        
                        <Notify/> 
                        {(this.state.addTemplates || this.props.addTemplates) && isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user) ? (
                            <Templates setAddTemplates={this.setAddTemplates}/>
                        ) : (
                            <div id="main-container">
                                {this.props.hideNavBar ? '' : <Navbar onDeauthenticate={this.props.onDeauthenticate} />}
                                {this.props.showSideBar ? <Sidebar sidebarIsOpen={this.state.sidebarIsOpen} setSidebarIsOpen={this.setSidebarIsOpen} setAddTemplates={this.setAddTemplates}/> : ''}
                                <ContentContainer sidebarIsOpen={this.state.sidebarIsOpen} showSideBar={this.props.showSideBar} isNotLogged={this.props.isNotLogged}>
                                    {this.props.children}
                                </ContentContainer>
                            </div>
                        )}
                        
                    </Body>
                ): ''}
            </div>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login }), actions)(Layout);
