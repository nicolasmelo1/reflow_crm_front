import NavbarLink from './NavbarLink'
import NavbarDropdown from './NavbarDropdown'
import { strings, paths } from 'utils/constants'
import { NavbarBrand, NavbarList, NavbarMain, NavbarCollapse, NavbarToggle } from 'styles/Navbar'
import Router from 'next/router'


const Navbar = (props) => {

    const handleLogout = (e) => {
        e.preventDefault()
        console.log('testes')
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

    return (
        <NavbarMain expand="lg">
            <NavbarBrand href="#">
                <img src="/images/logo_reflow_navbar.png" width="249" height="72" />
            </NavbarBrand>
            <NavbarToggle aria-controls="basic-navbar-nav" />
            <NavbarCollapse id="basic-navbar-nav">
                <NavbarList className="ml-auto" activeKey="1">
                    <NavbarLink link='#' icon='tasks' label={strings['pt-br']['headerGestaoLabel']}/>
                    <NavbarLink link='#' icon='chart-bar' label={strings['pt-br']['headerDashboardLabel']}/>
                    <NavbarLink link='#' icon='bell' label={strings['pt-br']['headerNotificationLabel']}/>
                    <NavbarLink link='#' icon='circle' label={strings['pt-br']['headerHelpLabel']}/>
                    <NavbarDropdown icon='cog' label={strings['pt-br']['headerSettingsLabel']} items={configDropdown}/>
                </NavbarList>
            </NavbarCollapse>
        </NavbarMain>
    )
};

export default Navbar;