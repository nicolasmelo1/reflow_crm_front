import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform, View } from 'react-native'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notify from './Notify'
import Survey from './Survey'
import Templates from './Templates'
import actions from '../redux/actions'
import dynamicImport from '../utils/dynamicImport'
import agent from '../utils/agent'
import { pathsAsArray } from '../utils/constants/paths'
import { paths, errors } from '../utils/constants'
import { setStorageToken } from '../utils/agent/utils'
import ContentContainer from '../styles/ContentContainer'
import Body from '../styles/Body'
import isAdmin from '../utils/isAdmin'
import { 
    faPlay,
    faInfoCircle,
    faTasks,
    faBorderAll,
    faArrowDown, 
    faCalendarAlt,  
    faPencilAlt, 
    faClock, 
    faTrash, 
    faUser,
    faCopy,
    faCog, 
    faBell, 
    faFileAlt,
    faShareAlt,
    faFilePdf,
    faArrowsAlt, 
    faArrowLeft,
    faBars,
    faPen, 
    faFont,
    faImage,
    faList,
    faPaperclip,
    faTable,
    faFilter, 
    faSortAmountDown, 
    faEye, 
    faEyeSlash,
    faChevronLeft, 
    faShapes,
    faFileExcel,
    faLink,
    faChevronRight, 
    faChevronUp, 
    faChevronDown, 
    faPlusCircle,
    faFileUpload,
    faTimes,
    faTimesCircle,
    faCheck,
    faCheckDouble,
    faUserCheck,
    faStopwatch,
    faRobot,
    faAlignLeft,
    faAlignCenter,
    faAlignRight
} from '@fortawesome/free-solid-svg-icons'

const connect = dynamicImport('reduxConnect', 'default')
const Router = dynamicImport('next/router')

library.add(
    faPlay,
    faPaperclip,
    faInfoCircle,
    faTasks,
    faArrowDown, 
    faCalendarAlt,  
    faPencilAlt, 
    faClock, 
    faTrash,
    faUser,
    faCopy, 
    faCog, 
    faBell, 
    faBorderAll,
    faArrowsAlt, 
    faShareAlt,
    faArrowLeft,
    faBars,
    faPen, 
    faLink,
    faFont,
    faList,
    faFileAlt,
    faFilePdf,
    faImage,
    faTable,
    faFilter, 
    faSortAmountDown, 
    faEye, 
    faEyeSlash,
    faChevronLeft, 
    faShapes,
    faFileExcel,
    faChevronRight, 
    faChevronUp, 
    faChevronDown, 
    faPlusCircle,
    faFileUpload,
    faTimes,
    faTimesCircle,
    faCheck,
    faCheckDouble,
    faStopwatch,
    faRobot,
    faUserCheck,
    faAlignLeft,
    faAlignCenter,
    faAlignRight
)

/*** 
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * @param {String} title - (ONLY WEB) - Defines the title tag of the page
 * @param {String} companyId - (Optional). Defines the companyId, usually this is retrieved when the user logs in, so no need for this props.
 * But sometimes the user is not logged in and we might want to display a formulary or some other thing to the user, on those times we can send a props
 * so with it we automatically set the companyId.
 * @param {String} publicAccessKey - Optional.
 * @param {Boolean} isNotLogged - (ONLY MOBILE) - Defines that the user is not logged in.
 * @param {Boolean} addTemplates - If set to true we will load a modal for the user to select the templates, otherwise we show the contents normally.
 * @param {Boolean} hideNavBar - (optional) (ONLY WEB) - Hides the navbar header
 * @param {Boolean} showSideBar - (optional) - Shows the sidebar with groups and formularies
 * */
class Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            surveyId: null,
            addTemplates: (this.props.addTemplates) ? this.props.addTemplates : false,
            tokenLoaded: false,
            sidebarIsOpen: false
        }
    }

    setSurveyId = (surveyId) => {
        this.setState(state => ({ 
            ...this.state,
            surveyId: surveyId
        }))
    }
    setSidebarIsOpen = () => (this._ismounted) ? this.setState(state => state.sidebarIsOpen = !state.sidebarIsOpen) : null
    setAddTemplates = (data) => (this._ismounted) ? this.setState(state => state.addTemplates = data) : null

    setToken = async () => {
        let token = ''
        if (process.env['APP'] === 'web') {
            token = window.localStorage.getItem('token')
        } else {
            const AsyncStorage = require('react-native').AsyncStorage
            token = await AsyncStorage.getItem('token')
        }
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

    setCompanyId = () => {
        if (this.props.companyId) {
            agent.setCompanyId(this.props.companyId)
        } else if (![null, undefined].includes(this.props?.login?.companyId)) {
            agent.setCompanyId(this.props.login.companyId)
        }
    }

    setupSurveyWebhook = () => {
        if (this.props.login?.user?.id) {
            agent.websocket.ANALYTICS.recieveIsToOpenSurvey({
                userId: this.props.login.user.id,
                callback: (data) => {
                    this.setSurveyId(data.data.survey_id)
                }
            })
        }
    }

    setPublicAccessKey = () => {
        if (this.props.publicAccessKey) {
            agent.setPublicAccessKey(this.props.publicAccessKey)
        }
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

    setLogout = (isToLogout) => {
        const currentUrl = Router.pathname
        if (isToLogout && pathsAsArray.filter(path => path.loginOnly === true).map(path => path.asUrl).includes(currentUrl)) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login().asUrl, paths.login().asUrl,{ shallow: true })
            } else {
                this.props.setIsAuthenticated(false)
            }
        }
        this.props.onDeauthenticate()
    }

    componentDidUpdate = () => {
        this.setCompanyId()
        this.setPublicAccessKey()
    }

    componentDidMount = () => {
        this._ismounted = true
        this.checkIfUserInAdminUrl()
        this.setCompanyId()
        this.setPublicAccessKey()
        this.setupSurveyWebhook()
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
                    <Templates setAddTemplates={this.props.setAddTemplates ? this.props.setAddTemplates : this.setAddTemplates}/>
                ) : (
                    <SafeAreaView style={{ height: '100%', backgroundColor:'#fff'}}>
                        {this.props.showSideBar ?
                            <Sidebar 
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
                {this.state.tokenLoaded ? (
                    <Body>   
                        {this.state.surveyId !== null ? (
                            <Survey 
                            surveyId={this.state.surveyId}
                            onCloseSurvey={() => this.setSurveyId(null)}
                            />
                        ) : ''}
                        {this.props.header}
                        <Notify/> 
                        {(this.state.addTemplates || this.props.addTemplates) && isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user) ? (
                            <Templates setAddTemplates={this.props.setAddTemplates ? this.props.setAddTemplates : this.setAddTemplates}/>
                        ) : (
                            <div id="main-container">
                                {this.props.hideNavBar ? '' : (
                                    <Navbar 
                                    showSideBar={this.props.showSideBar}
                                    onDeauthenticate={this.props.onDeauthenticate} 
                                    />
                                )}
                                {this.props.showSideBar ? (
                                    <Sidebar 
                                    sidebarIsOpen={this.state.sidebarIsOpen} 
                                    setSidebarIsOpen={this.setSidebarIsOpen} 
                                    setAddTemplates={this.setAddTemplates}
                                    />
                                ) : ''}
                                <ContentContainer 
                                sidebarIsOpen={this.state.sidebarIsOpen} 
                                showSideBar={this.props.showSideBar} 
                                hideNavBar={this.props.hideNavBar}
                                >
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

export default connect(state => ({ login: state.login }), actions)(Layout)
