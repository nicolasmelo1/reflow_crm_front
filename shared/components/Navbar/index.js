import React from 'react'
import NavbarLink from './NavbarLink' // not implemented in RN
import NavbarDropdown from './NavbarDropdown' // not implemented in RN
import { strings, paths } from '../../utils/constants'
import { NavbarLogo, NavbarBrand, NavbarList, NavbarMain, NavbarCollapse, NavbarToggle } from '../../styles/Navbar' // not implemented in RN
import Router from 'next/router'
import { useSelector } from 'react-redux'

// On the browser this component is called inside of the Layout component, but since React Navigation works differently, on mobile we need to call it on the App.js component
// since it needs to be on the root of the page.
const Navbar = (props) => {
    const primaryForm = useSelector(store => store.login.primaryForm)

    const handleLogout = (e) => {
        e.preventDefault()
        props.onDeauthenticate()
        Router.push(paths.login())
    }


    const configDropdown = [
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
            onClick: handleLogout
        }

    ]

    const renderWeb = () => {
        return (
            <NavbarMain expand="lg">
                <NavbarBrand href="#">
                    <NavbarLogo src="/logo_reflow_navbar.png" width="249" height="72" />
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <NavbarList className="ml-auto" activeKey="1">
                        <NavbarLink link={paths.home(primaryForm)} slug={paths.home(primaryForm, true)} icon='tasks' label={strings['pt-br']['headerGestaoLabel']}/>
                        <NavbarLink link='#' icon='chart-bar' label={strings['pt-br']['headerDashboardLabel']}/>
                        <NavbarLink link={paths.notifications()} slug={paths.notifications()} icon='bell' label={strings['pt-br']['headerNotificationLabel']}/>
                        <NavbarLink link='#' icon='circle' label={strings['pt-br']['headerHelpLabel']}/>
                        <NavbarDropdown icon='cog' label={strings['pt-br']['headerSettingsLabel']} items={configDropdown}/>
                    </NavbarList>
                </NavbarCollapse>
            </NavbarMain>
        )
    }


    function renderMobile() {
        const Tab = props.Tab

        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={props.HomeComponent} />
            </Tab.Navigator>
        )
    }

    if (process.env['APP'] === 'web') {
        return renderWeb() 
    } else {
        return renderMobile()
    }
};

export default Navbar