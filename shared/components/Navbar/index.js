import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios'
import NavbarLink from './NavbarLink' 
import NavbarDropdown from './NavbarDropdown'
import { strings, paths } from '../../utils/constants'
import actions from '../../redux/actions'
import isAdmin from '../../utils/isAdmin'
import { 
    NavbarFreeTrialAlertButton, 
    NavbarFreeTrialAlertText,
    NavbarLogo, 
    NavbarToggleButton, 
    NavbarItemsContainer, 
    NavbarContainer 
} from '../../styles/Navbar'

/** 
 * On the browser this component is called inside of the Layout component, but since React Navigation works differently, on mobile 
 * we need to call it on the App.js component since it needs to be on the root of the page.
 * 
 * Since this component is called everytime the user is logged in you can make requests here to retrieve specific data from logged 
 * users
 */
class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isOpen: false,
            notifications: null
        }
    }

    setIsOpen = (isOpen) => {
        this.setState(state=> state.isOpen = isOpen)
    }

    handleLogout = (e) => {
        Router.push(paths.login().asUrl, paths.login().asUrl,{ shallow: true })
        this.props.onDeauthenticate()
    }

    handleOldVersion = () => {
        Object.assign(document.createElement('a'), { target: '_blank', href: `${process.env['OLD_APP_HOST']}`}).click();
    }

    handleBilling = () => {
        Router.push(paths.billing().asUrl, paths.billing().asUrl, { shallow: true })
    }

    handleUsers = () => {
        Router.push(paths.users().asUrl, paths.users().asUrl, { shallow: true })
    }

    handleCompany = () => {
        Router.push(paths.company().asUrl, paths.company().asUrl, { shallow: true })
    }

    freeTrialRemainingDays = () => {
        const createdAt = new Date(this.props.company.created_at)
        const freeTrialDueDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate() + this.props.company.free_trial_days)
        const today = new Date()
        return Math.ceil((freeTrialDueDate - today) / (1000 * 60 * 60 * 24))
    }

    isFreeTrial = () => {
        if (this.props.company.created_at && !this.props.company.is_paying_company) {
            const freeDaysLeft = this.freeTrialRemainingDays()
            if (0 <= freeDaysLeft) {
                return true
            }
        }
        return false
    }

    configDropdown = isAdmin(this.props.login.types?.defaults?.profile_type, this.props.login.user) ? 
    [
        /*{
            label: strings['pt-br']['headerRefferalLabel'],
            href: '#'
        },*/
        {
            label: 'Versão antiga',
            href: '#',
            onClick: this.handleOldVersion
        },
        {
            label: strings['pt-br']['headerCompanyLabel'],
            href: '#',
            onClick: this.handleCompany
        },
        /*{
            label: strings['pt-br']['headerChangeDataLabel'],
            href: '#'
        },*/
        {
            label: strings['pt-br']['headerBillingLabel'],
            href: '#',
            onClick: this.handleBilling
        },
        {
            label: strings['pt-br']['headerUsersLabel'],
            href:'#',
            onClick: this.handleUsers
        },
        {
            label: strings['pt-br']['headerLogoutLabel'],
            href: '#',
            onClick: this.handleLogout
        }
    ] : [
        /*{
            label: strings['pt-br']['headerRefferalLabel'],
            href: '#'
        },*/
        {
            label: 'Versão antiga',
            href: '#',
            onClick: this.handleOldVersion
        },
        /*{
            label: strings['pt-br']['headerChangeDataLabel'],
            href: '#'
        },*/
        {
            label: strings['pt-br']['headerLogoutLabel'],
            href: '#',
            onClick: this.handleLogout
        }
    ]

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onGetNewNotifications(this.source)
        this.props.onGetCompanyData(this.source)
    }
    
    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderWeb = () => {
        return (
            <NavbarContainer>
                <NavbarLogo src="/complete_logo.png"/>
                {this.isFreeTrial() && isAdmin(this.props.login.types?.defaults?.profile_type, this.props.login.user) ? (
                    <NavbarFreeTrialAlertButton onClick={e=> {this.handleBilling()}}>
                        <NavbarFreeTrialAlertText isBold={true}>
                            {`${this.freeTrialRemainingDays()}`}
                        </NavbarFreeTrialAlertText>
                        <NavbarFreeTrialAlertText>
                            {strings['pt-br']['headerFreeTrialAlertDaysLabel']}
                        </NavbarFreeTrialAlertText>
                        <NavbarFreeTrialAlertText isBold={true}>
                            {strings['pt-br']['headerFreeTrialUpdateNowLabel']}
                        </NavbarFreeTrialAlertText>
                    </NavbarFreeTrialAlertButton>
                ) : ''}
                <NavbarToggleButton onClick={e=> {this.setIsOpen(!this.state.isOpen)}}>
                    <FontAwesomeIcon icon={this.state.isOpen ? 'times' : 'bars'}/>
                </NavbarToggleButton>
                <NavbarItemsContainer isOpen={this.state.isOpen}>
                    <NavbarLink link={paths.home(this.props.login.primaryForm).asUrl} slug={paths.home().asUrl} icon='tasks' label={strings['pt-br']['headerGestaoLabel']}/>
                    <NavbarLink badge={this.props.notificationBadge > 0 ? this.props.notificationBadge : null} link={paths.notifications().asUrl} slug={paths.notifications().asUrl} icon='bell' label={strings['pt-br']['headerNotificationLabel']}/>
                    <NavbarDropdown icon='cog' label={strings['pt-br']['headerSettingsLabel']} items={this.configDropdown}/>
                </NavbarItemsContainer>
            </NavbarContainer>
        )
    }


    renderMobile() {
        const Tab = this.props.Tab
        return (
            <Tab.Navigator initialRouteName={'home'}>
                <Tab.Screen name="home" component={this.props.HomeComponent}/>
                <Tab.Screen name="notifications" component={this.props.NotificationComponent}/>
                <Tab.Screen name="configurations" component={this.props.ConfigurationComponent}/>
            </Tab.Navigator>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
};

export default connect(store => ({login: store.login, company: store.company, notificationBadge: store.notification.notification.badge }), actions)(Navbar)