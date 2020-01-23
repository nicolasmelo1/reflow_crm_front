import Link from 'next/link';
import NavbarLink from './NavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import { connect } from 'react-redux';
import { paths } from 'utils/constants'
import { strings } from 'utils/constants'
import actions from 'redux/actions'
import { NavbarList, NavbarMain, NavbarCollapse, NavbarToggle, NavbarDropdownToggle } from 'styles/Navbar'


const NavBar = (props) => {

    return (

        <div>
            <NavbarMain expand="lg">
                <Navbar.Brand href="#"><img src="/images/logo_reflow_navbar.png" width="249" height="72" /></Navbar.Brand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <NavbarList className="ml-auto" activeKey="1">
                        <Link href="/gestao" passHref>
                            <Nav.Link eventKey={1}>
                                <NavbarLink icon='tasks' label={strings['pt-br']['headerGestaoLabel']}>
                                </NavbarLink>
                            </Nav.Link>
                        </Link>
                        <Link href="/dashboard" passHref>
                            <Nav.Link eventKey={2}>
                                <NavbarLink icon='chart-bar' label={strings['pt-br']['headerDashboardLabel']}>
                                </NavbarLink>
                            </Nav.Link>
                        </Link>

                        <Nav.Link eventKey={3}>
                            <Dropdown >
                                <NavbarDropdownToggle>
                                    <NavbarLink icon='cog' label={strings['pt-br']['headerSettingsLabel']} />
                                </NavbarDropdownToggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as="button" >{strings['pt-br']['headerRefferalLabel']}</Dropdown.Item>
                                    <Dropdown.Item as="button">{strings['pt-br']['headerCompanyLabel']}</Dropdown.Item>
                                    <Dropdown.Item as="button">{strings['pt-br']['headerChangeDataLabel']}</Dropdown.Item>
                                    <Link href="/configuracoes/pagamento" passHref><Dropdown.Item as="button">{strings['pt-br']['headerBillingLabel']}</Dropdown.Item></Link>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as="button">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav.Link>

                        <Link href="#" passHref>
                            <Nav.Link eventKey={4}>
                                <NavbarLink icon='bell' label={strings['pt-br']['headerNotificationLabel']}>
                                </NavbarLink>
                            </Nav.Link>
                        </Link>
                        <Link href="#" passHref>
                            <Nav.Link eventKey={5}>
                                <NavbarLink icon='circle' label={strings['pt-br']['headerHelpLabel']}>
                                </NavbarLink>
                            </Nav.Link>
                        </Link>
                    </NavbarList>
                </NavbarCollapse>
            </NavbarMain>
        </div>
    )




};

export default NavBar;