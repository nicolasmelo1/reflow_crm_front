import Link from 'next/link';
import NavbarLink from './NavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

const Header = () => (
        <div>
        <Navbar className="navbar-main" expand="lg">
            <Navbar.Brand href="#"><img src="/images/logo_3.png" width="249" height="72" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" activeKey="">
                    <Link href="#" passHref><Nav.Link><NavbarLink icon='tasks' label='headerManagementLabel'></NavbarLink></Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link><NavbarLink icon='chart-bar' label='headerDashboardLabel'></NavbarLink></Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link><NavbarLink icon='cog' label='headerSettingsLabel'></NavbarLink></Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link><NavbarLink icon='bell' label='headerNotificationLabel'></NavbarLink></Nav.Link></Link>
                    <Link href="#" passHref><Nav.Link><NavbarLink icon='circle' label='headerHelplabel'></NavbarLink></Nav.Link></Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        </div>
);

export default Header;