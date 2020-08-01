import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notify from './Notify'
import Templates from './Templates'
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { library } from '@fortawesome/fontawesome-svg-core'
import Router from 'next/router';
import { paths } from '../utils/constants'
import agent from '../utils/agent'
import ContentContainer from '../styles/ContentContainer'
import Body from '../styles/Body'
import isAdmin from '../utils/isAdmin'
import { AsyncStorage, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform, View } from 'react-native'
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
    faTimesCircle
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
    faTimesCircle
)

/*** 
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * PROPS:
 * title (String) - Defines the title tag of the page
 * */
class Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addTemplates: (this.props.addTemplates) ? this.props.addTemplates : false,
            tokenLoaded: false,
            sidebarIsOpen: false,
        }
    }

    async setToken() {
        let token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
        if (!token || token === '') {
            this.setLogout(true)
        }

        // this is probably an anti-pattern, read here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (this._ismounted) {
            this.setState(state => state.tokenLoaded = true)
        }
    }

    setLogout = (data) => {
        if (data && !this.props.isNotLogged) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login(), paths.login(),{ shallow: true })
            } else {
                this.props.setIsAuthenticated(false)
            }
        }
        this.props.onDeauthenticate()
    }
    
    setSidebarIsOpen = () => this.setState(state => state.sidebarIsOpen=!state.sidebarIsOpen)

    setAddTemplates = (data) => this.setState(state => state.addTemplates = data)

    componentDidUpdate = () => {
        agent.setCompanyId(this.props.login.companyId)
    }

    componentDidMount = () => {
        this._ismounted = true
        agent.setCompanyId(this.props.login.companyId)
        agent.setLogout(this.setLogout)
        this.props.getDataTypes()
        this.setToken()
    }

    componentWillUnmount = () => {
        this._ismounted = false
    }

    renderWeb() {
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


    renderMobile() {
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


    render() {
        if (process.env['APP'] === 'web') {
            return this.renderWeb()
        } else {
            return this.renderMobile()
        }
    }
}

export default connect(state => ({ login: state.login }), actions)(Layout);
