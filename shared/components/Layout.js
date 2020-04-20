import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
//import Navbar from './Navbar' // not implemented in RN
import Notify from './Notify'
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { library } from '@fortawesome/fontawesome-svg-core'
import Router from 'next/router';
import { paths } from '../utils/constants'
import agent from '../redux/agent'
import ContentContainer from '../styles/ContentContainer'
import Body from '../styles/Body'
import { AsyncStorage } from 'react-native'

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
    faFileUpload
} from '@fortawesome/free-solid-svg-icons'


library.add(faPlusSquare, faEnvelope, faCalendarAlt, faSquareRootAlt, faPhone, faAlignLeft, faLink, faCheckSquare, faClipboardList, faParagraph, faArrowLeft, faRulerHorizontal, faClock, faTrash, faBell, faChartBar, faCircle, faCog, faTasks, faArrowsAlt, faEdit, faBars, faPen, faFilter, faSortAmountDown, faEye, faArrowsAlt, faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faFileUpload, faPencilAlt, faArrowDown)

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
            sidebarIsOpen: false,
        }
        this.setToken()
    }

    async setToken() {
        const token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
        console.log(token)
        agent.setToken(token)
        agent.setCompanyId(this.props.login.companyId)
        if (!token || token === '') {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login())
            } else {
                this.props.setRouter('login')
            }
        }
        
        this.props.getDataTypes()
    }

    setSidebarIsOpen = () => {
        this.setState(state => {
            return {
                sidebarIsOpen: !state.sidebarIsOpen
            }
        })
    }

    renderWeb() {
        return (
            <Body>
                <Header title={this.props.title}></Header>
                <Notify/> 
                <div id="main-container">
                    {this.props.hideNavBar ? '' : <Navbar onDeauthenticate={this.props.onDeauthenticate} />}
                    {this.props.showSideBar ? <Sidebar sidebarIsOpen={this.state.sidebarIsOpen} setSidebarIsOpen={this.setSidebarIsOpen} /> : ''}
                    <ContentContainer sidebarIsOpen={this.state.sidebarIsOpen}>
                        {this.props.children}
                    </ContentContainer>
                </div>
            </Body>
        )
    }


    renderMobile() {
        return (
            <Body>
                <Notify/> 
                <ContentContainer>
                    {this.props.showSideBar ? 
                        <Sidebar sidebarIsOpen={this.state.sidebarIsOpen} setSidebarIsOpen={this.setSidebarIsOpen} children={this.props.children}/>
                    : this.props.children}
                </ContentContainer>
            </Body>
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
