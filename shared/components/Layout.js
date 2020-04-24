import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notify from './Notify'
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { library } from '@fortawesome/fontawesome-svg-core'
import Router from 'next/router';
import { paths } from '../utils/constants'
import agent from '../redux/agent'
import ContentContainer from '../styles/ContentContainer'
import Body from '../styles/Body'
import { AsyncStorage, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
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
        this.companyId = null
        this.state = {
            tokenLoaded: false,
            sidebarIsOpen: false,
        }
    }

    async setToken() {
        let token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
        token = (token !== null) ? token : ''
        agent.setToken(token)
        if (!token || token === '') {
            if (process.env['APP'] === 'web') {
                Router.push(paths.login())
            } else {
                this.props.setRouter('login')
            }
        }

        // this is probably an anti-pattern, read here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (this._ismounted) {
            this.setState(state => state.tokenLoaded = true)
        }
    }

    setSidebarIsOpen = () => {
        this.setState(state => {
            return {
                sidebarIsOpen: !state.sidebarIsOpen
            }
        })
    } 
    componentDidUpdate = () => {
        agent.setCompanyId(this.props.companyId !== null ? this.props.companyId : '')
    }

    componentDidMount = () => {
        this._ismounted = true
        agent.setCompanyId(this.props.companyId !== null ? this.props.companyId : '')
        this.props.getDataTypes()
        this.setToken()
    }

    componentWillUnmount = () => {
        this._ismounted = false
    }


    renderWeb() {
        return (
            <div>
                {this.state.tokenLoaded ? (
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
                ): ''}
            </div>
        )
    }


    renderMobile() {
        return (
            <View style={{ height: '100%'}}>
                {this.state.tokenLoaded ? (
                    <Body>
                        <Notify/> 
                        <View style={{ height: '100%'}}>
                            {this.props.showSideBar ?
                                <Sidebar sidebarIsOpen={this.state.sidebarIsOpen} setSidebarIsOpen={this.setSidebarIsOpen} children={this.props.children}/>
                            : this.props.children}
                        </View>
                    </Body>
                ) : null }
            </View>
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

export default connect(state => ({ companyId: state.login.companyId }), actions)(Layout);
