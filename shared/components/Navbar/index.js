import React, { useState } from 'react'
import NavbarLink from './NavbarLink' // not implemented in RN
import NavbarDropdown from './NavbarDropdown' // not implemented in RN
import { strings, paths } from '../../utils/constants'
import actions from '../../redux/actions'
import { NavbarLogo, NavbarToggleButton, NavbarItemsContainer, NavbarContainer } from '../../styles/Navbar' // not implemented in RN
import Router from 'next/router'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import isAdmin from '../../utils/isAdmin'

// On the browser this component is called inside of the Layout component, but since React Navigation works differently, on mobile 
// we need to call it on the App.js component since it needs to be on the root of the page.
class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            notifications: null
        }
    }

    setIsOpen = (isOpen) => {
        this.setState(state=> state.isOpen = isOpen)
    }

    handleLogout = (e) => {
        e.preventDefault()
        Router.push(paths.login(), paths.login(),{ shallow: true })
        this.props.onDeauthenticate()
    }

    handleOldVersion = (e) => {
        e.preventDefault()
        Object.assign(document.createElement('a'), { target: '_blank', href: `${process.env['OLD_APP_HOST']}`}).click();
    }

    handleBilling = (e) => {
        e.preventDefault()
        Router.push(paths.billing(), paths.billing(), { shallow: true })
    }

    handleUsers = (e) => {
        e.preventDefault()
        Object.assign(document.createElement('a'), { target: '_blank', href: `${process.env['OLD_APP_HOST']}${this.props.login.companyId}/settings/employee/`}).click();
    }

    handleCompany = (e) => {
        e.preventDefault()
        Object.assign(document.createElement('a'), { target: '_blank', href: `${process.env['OLD_APP_HOST']}${this.props.login.companyId}/settings/company/`}).click();
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
            href: '#',
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
        this.props.onGetNewNotifications()
    }

    renderWeb = () => {
        return (
            <NavbarContainer>
                <NavbarLogo src="/complete_logo.png"/>
                <NavbarToggleButton onClick={e=> {this.setIsOpen(!this.state.isOpen)}}>
                    <FontAwesomeIcon icon={this.state.isOpen ? 'times' : 'bars'}/>
                </NavbarToggleButton>
                <NavbarItemsContainer isOpen={this.state.isOpen}>
                    <NavbarLink link={paths.home(this.props.login.primaryForm)} slug={paths.home()} icon='tasks' label={strings['pt-br']['headerGestaoLabel']}/>
                    <NavbarLink badge={this.props.notificationBadge > 0 ? this.props.notificationBadge : null} link={paths.notifications()} slug={paths.notifications()} icon='bell' label={strings['pt-br']['headerNotificationLabel']}/>
                    <NavbarDropdown icon='cog' label={strings['pt-br']['headerSettingsLabel']} items={this.configDropdown}/>
                </NavbarItemsContainer>
            </NavbarContainer>
        )
    }


    renderMobile() {
        const Tab = this.props.Tab
        return (
            <Tab.Navigator>
                <Tab.Screen name="home" component={this.props.HomeComponent} initialParams={{setIsAuthenticated: this.props.setIsAuthenticated}}/>
                <Tab.Screen name="notifications" component={this.props.NotificationComponent} params={{setIsAuthenticated: this.handleLogout}}/>
            </Tab.Navigator>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
};

export default connect(store => ({login: store.login, notificationBadge: store.notification.notification.badge }), actions)(Navbar)