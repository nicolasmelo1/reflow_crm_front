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
import { AsyncStorage, View, SafeAreaView, Platform } from 'react-native'
import { 
    faArrowDown, 
    faPlusSquare, 
    faEnvelope, 
    faCalendarAlt, 
    faSquareRootAlt, 
    faPhone, 
    faAlignLeft, 
    faPencilAlt, 
    faLink, 
    faCheckSquare, 
    faClipboardList, 
    faParagraph,
    faRulerHorizontal, 
    faClock, 
    faTrash, 
    faCircle, 
    faTasks, 
    faChartBar, 
    faCog, 
    faBell, 
    faArrowsAlt, 
    faEdit, 
    faArrowLeft,
    faBars,
    faPen, 
    faFilter, 
    faSortAmountDown, 
    faEye, 
    faChevronLeft, 
    faChevronRight, 
    faChevronUp, 
    faChevronDown, 
    faPlusCircle,
    faFileUpload,
    faTimes
} from '@fortawesome/free-solid-svg-icons'


library.add(faTimes, faPlusCircle, faPlusSquare, faEnvelope, faCalendarAlt, faSquareRootAlt, faPhone, faAlignLeft, faLink, faCheckSquare, faClipboardList, faParagraph, faArrowLeft, faRulerHorizontal, faClock, faTrash, faBell, faChartBar, faCircle, faCog, faTasks, faArrowsAlt, faEdit, faBars, faPen, faFilter, faSortAmountDown, faEye, faArrowsAlt, faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faFileUpload, faPencilAlt, faArrowDown)

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
        this.companyId = null
        this.state = {
            addTemplates: (this.props.addTemplates) ? this.props.addTemplates : false,
            tokenLoaded: false,
            sidebarIsOpen: false,
        }
    }

    async setToken() {
        let token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
        token = (token !== null) ? token : ''
        //agent.setToken(token)
        if (!token || token === '') {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login())
            } else {
                this.props.setIsAuthenticated(false)
            }
        }

        // this is probably an anti-pattern, read here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (this._ismounted) {
            this.setState(state => state.tokenLoaded = true)
        }
    }

    setLogout = (data) => {
        if (data) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login())
            } else {
                this.props.setIsAuthenticated(false)
            }
        }
    }
    
    setSidebarIsOpen = () => this.setState(state => state.sidebarIsOpen=!state.sidebarIsOpen)

    setAddTemplates = (data) => this.setState(state => state.addTemplates = data)

    componentDidUpdate = () => {
        agent.setCompanyId(this.props.companyId !== null ? this.props.companyId : '')
    }

    componentDidMount = () => {
        this._ismounted = true
        agent.setCompanyId(this.props.companyId !== null ? this.props.companyId : '')
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
                        {this.state.addTemplates ? (
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
        return (
            <SafeAreaView style={{ height: '100%', paddingTop: Platform.OS === 'android' ? 25 : 0}}>
                {this.state.tokenLoaded ? (
                    <Body>
                        <Notify/> 
                        {this.state.addTemplates ? (
                            <Templates setAddTemplates={this.setAddTemplates}/>
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

export default connect(state => ({ companyId: state.login.companyId, login: state.login }), actions)(Layout);
