import React, { useState } from 'react'
import NavbarLink from './NavbarLink' // not implemented in RN
import NavbarDropdown from './NavbarDropdown' // not implemented in RN
import { strings, paths } from '../../utils/constants'
import actions from '../../redux/actions'
import { NavbarLogo, NavbarToggleButton, NavbarItemsContainer, NavbarContainer } from '../../styles/Navbar' // not implemented in RN
import Router from 'next/router'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


// On the browser this component is called inside of the Layout component, but since React Navigation works differently, on mobile we need to call it on the App.js component
// since it needs to be on the root of the page.
class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    setIsOpen = (isOpen) => {
        this.setState(state=> state.isOpen = isOpen)
    }

    handleLogout = (e) => {
        e.preventDefault()
        props.onDeauthenticate()
        Router.push(paths.login())
    }

    configDropdown = [
        {
            label: strings['pt-br']['headerRefferalLabel'],
            href: '#'
        },
        {
            label: strings['pt-br']['headerCompanyLabel'],
            href: '#'
        },
        {
            label: strings['pt-br']['headerChangeDataLabel'],
            href: '#'
        },
        {
            label: strings['pt-br']['headerBillingLabel'],
            href: '#'
        },
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
                <NavbarLogo src="/logo_reflow_navbar.png"/>
                <NavbarToggleButton onClick={e=> {this.setIsOpen(!this.state.isOpen)}}>
                    <FontAwesomeIcon icon={this.state.isOpen ? 'times' : 'bars'}/>
                </NavbarToggleButton>
                <NavbarItemsContainer isOpen={this.state.isOpen}>
                    <NavbarLink link={paths.home(this.props.primaryForm)} slug={paths.home(this.props.primaryForm, true)} icon='tasks' label={strings['pt-br']['headerGestaoLabel']}/>
                    <NavbarLink badge={this.props.notificationBadge > 0 ? this.props.notificationBadge : null} link={paths.notifications()} slug={paths.notifications()} icon='bell' label={strings['pt-br']['headerNotificationLabel']}/>
                    <NavbarDropdown icon='cog' label={strings['pt-br']['headerSettingsLabel']} items={this.configDropdown}/>
                </NavbarItemsContainer>
            </NavbarContainer>
        )
    }


    renderMobile() {
        const Tab = props.Tab

        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={props.HomeComponent} />
                <Tab.Screen name="Notification" component={props.NotificationComponent} />
            </Tab.Navigator>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
};

export default connect(store => ({primaryForm: store.login.primaryForm, notificationBadge: store.notification.notification.badge }), actions)(Navbar)