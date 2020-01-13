import Link from 'next/link';
import NavbarLink from './NavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import CustomToggle from './ConfigDropdown'
const Header = () => (
        <div>
        <Navbar className="navbar-main" expand="lg">
            <Navbar.Brand href="#"><img src="/images/logo_3.png" width="249" height="72" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" activeKey="/gestao">
                    <Link href="/gestao" passHref>
                        <Nav.Link>
                            <NavbarLink icon='tasks' label='headerManagementLabel'>
                            </NavbarLink>
                        </Nav.Link>
                    </Link>
                    <Link href="/dashboard" passHref>
                        <Nav.Link>
                            <NavbarLink icon='chart-bar' label='headerDashboardLabel'>
                            </NavbarLink>
                        </Nav.Link>
                    </Link>
                    
                        <Nav.Link>
                            <Dropdown >
                                <Dropdown.Toggle as={CustomToggle} style={{color:"#444444"}}>
                                    <NavbarLink icon='cog' label='headerSettingsLabel' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as="button">Indicar usuários</Dropdown.Item>
                                    <Dropdown.Item as="button">Empresa</Dropdown.Item>
                                    <Dropdown.Item as="button">Alterar dados</Dropdown.Item>
                                    <Link href="/configuracoes/pagamento" passHref><Dropdown.Item as="button">Pagamentos</Dropdown.Item></Link>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as="button">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav.Link>
                    
                    <Link href="#" passHref>
                        <Nav.Link>
                            <NavbarLink icon='bell' label='headerNotificationLabel'>
                            </NavbarLink>
                        </Nav.Link>
                    </Link>
                    <Link href="#" passHref>
                        <Nav.Link>
                            <NavbarLink icon='circle' label='headerHelplabel'>
                            </NavbarLink>
                        </Nav.Link>
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        </div>
);

export default Header;