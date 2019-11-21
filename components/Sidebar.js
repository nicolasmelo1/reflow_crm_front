import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem, Button} from 'react-bootstrap';
import Head from 'next/head';


const style_sidebar ={

}


const Sidebar = () => (
    <div id="sidebar-menu" className="sideBarMenuContainer"> 
    <style type="text/css">
        {`
        .sideBarMenuContainer {
            position: fixed;
            height: 100%;
        }
        
        .userMenu {
            width: 100%;
            text-align: center;
            margin-right: 0px;
            margin-left: 0px;    
            margin-top: 0px;
        }
        
        nav.sidebar :global(.navbar-brand) :global(.glyphicon) {
            margin-right: 0px;
        }
        
        
        /*Remove rounded coners*/
        nav.sidebar.:global(navbar) {
            border-radius: 0px;
        }
        
        nav.sidebar {
            -webkit-transition: margin 200ms ease-out;
            -moz-transition: margin 200ms ease-out;
            -o-transition: margin 200ms ease-out;
            transition: margin 200ms ease-out;
        }
        
        /* .....NavBar: Icon only with coloring/layout.....*/
        
        /*small/medium side display*/
        @media ( min-width : 768px) {
        
        
            /*Center Brand*/
            nav.sidebar.:global(navbar).sidebar>.container :global(.navbar-brand), :global(.navbar)>:global(.container-fluid) :global(.navbar-brand)
                {
                margin-left: 0px;
            }
            /*Center Brand*/
            nav.sidebar :global(.navbar-brand), nav.sidebar :global(.navbar-header) {
                text-align: center;
                width: 100%;
                margin-left: 0px;
            }
        
            /*Center Icons*/
            nav.sidebar a {
                padding-right: 13px;
            }
        
            /*adds border top to first nav box */
            nav.sidebar :global(.navbar-nav)>li:first-child {
                border-top: 1px #e5e5e5 solid;
            }
        
            /*adds border to bottom nav boxes*/
            nav.sidebar :global(.navbar-nav)>li {
                border-bottom: 1px #e5e5e5 solid;
            }
        
            /* Colors/style dropdown box*/
            nav.sidebar :global(.navbar-nav) :global(.open) :global(.dropdown-menu) {
                position: static;
                float: none;
                width: auto;
                margin-top: 0;
                background-color: transparent;
                border: 0;
                -webkit-box-shadow: none;
                box-shadow: none;
            }
        
            /*allows nav box to use 100% width*/
            nav.sidebar :global(.navbar-collapse), nav.sidebar :global(.container-fluid) {
                padding: 0 0px 0 0px;
            }
        
            /*colors dropdown box text */
            :global(.navbar-inverse) :global(.navbar-nav) :global(.open) :global(.dropdown-menu)>li>a {
                color: #777;
            }
        
            /*gives sidebar width/height*/
            nav.sidebar {
                width: 200px;
                height: 100%;
                margin-left: -160px;
                float: left;
                z-index: 8000;
                margin-bottom: 0px;
            }
        
            /*give sidebar 100% width;*/
            nav.sidebar li {
                width: 100%;
            }
        
            /* Move nav to full on mouse over*/
            nav.sidebar:hover {
                margin-left: 0px;
            }
            /*for hiden things when navbar hidden*/
            :global(.forAnimate) {
                opacity: 0;
            }
        }
        
        /* .....NavBar: Fully showing nav bar..... */
        @media ( min-width : 1330px) {
        
            /*Show all nav*/
            nav.sidebar {
                margin-left: 0px;
                float: left;
            }
            /*Show hidden items on nav*/
            nav.sidebar :global(.forAnimate) {
                opacity: 1;
            }
        }
        
        nav.sidebar :global(.navbar-nav) :global(.open) :global(.dropdown-menu)>li>a:hover, nav.sidebar :global(.navbar-nav) :global(.open) :global(.dropdown-menu)>li>a:focus
            {
            color: #CCC;
            background-color: transparent;
        }
        
        nav:hover :global(.forAnimate) {
            opacity: 1;
        }
        
        section {
            padding-left: 15px;
        }
        `}
    </style>

    <Navbar fluid inverse id="sidebar" className="sidebar">
        <Navbar.Toggle />
        <Navbar.Collapse>
            <Nav>
                <NavDropdown eventKey={1} title="Vendas">
                    <NavDropdown.Item eventKey={1.1} href="#">Pipeline</NavDropdown.Item>
                    <NavDropdown.Item eventKey={1.2} href="#">Clientes</NavDropdown.Item>
                </NavDropdown>
                <NavItem eventKey={2}><Button variant="info">Adicionar Template</Button></NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    </div>
    
)

export default Sidebar;