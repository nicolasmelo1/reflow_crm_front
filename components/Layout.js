import Header from './Header'
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { faPlusSquare, faEnvelope, faCalendarAlt, faSquareRootAlt, faPhone, faAlignLeft, faPencilAlt, faLink, faCheckSquare, faClipboardList, faParagraph, faFilePdf, faRulerHorizontal, faClock, faTrash, faCircle, faTasks, faChartBar, faCog, faBell, faArrowsAlt, faEdit, faCloudUploadAlt, faBars, faPen, faFilter, faSortAmountDown, faEye, faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faFileUpload} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import React from 'react'
import Body from 'styles/Body'
import Router from 'next/router';
import Sidebar from './Sidebar'
import { paths } from 'utils/constants'
import agent from 'redux/agent'
import Navbar from './Navbar'
import ContentContainer from 'styles/ContentContainer'

library.add(faPlusSquare, faEnvelope, faCalendarAlt, faSquareRootAlt, faPhone, faAlignLeft, faLink, faCheckSquare, faClipboardList, faParagraph, faFilePdf, faRulerHorizontal, faClock, faTrash, faBell, faChartBar, faCircle, faCog, faTasks, faArrowsAlt, faEdit, faCloudUploadAlt, faBars, faPen, faFilter, faSortAmountDown, faEye, faArrowsAlt, faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faFileUpload, faPencilAlt)

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
        agent.setToken(window.localStorage.getItem('token'))
        agent.setCompanyId(this.props.login.companyId)
        if (!window.localStorage.getItem('token') || window.localStorage.getItem('token') === '') {
            Router.push(paths.login())
        }
        this.state = {
            sidebarIsOpen: false
        }
    }

    setSidebarIsOpen = () => {
        this.setState(state => {
            return {
                sidebarIsOpen: !state.sidebarIsOpen
            }
        })
    }

    render() {
        return (
            <Body>
                {this.props.hideNavBar ? '' : ''}
                <Header title={this.props.title}></Header>
                <div className="notifications-container"></div>
                <div id="main-container">
                    {this.props.hideNavBar ? '' : <Navbar />}
                    {this.props.showSideBar ? <Sidebar sidebarIsOpen={this.state.sidebarIsOpen} setSidebarIsOpen={this.setSidebarIsOpen} /> : ''}
                    <ContentContainer sidebarIsOpen={this.state.sidebarIsOpen}>
                        {this.props.children}
                    </ContentContainer>
                </div>
            </Body>
        )
    }
}

export default connect(state => ({ login: state.login }), actions)(Layout);