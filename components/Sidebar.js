import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
var styles = {

    bmBurgerButton: {
      position: 'relative',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '36px'
    },
    bmBurgerBars: {
      background: '#373a47'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%'
    },
    bmMenu: {
      background: '#444444',
      paddingTop: '44px',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad'
    },
    bmItem: {
      display: 'inline-block'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }




const Sidebar = () => (
  <Row>
    <Col>
    <div id="sidebar-wrapper">
        <Menu disableOverlayClick burgerButtonClassName={ "my-class" } width={ '184px' } pageWrapId="page-wrap" outerContainerId={"App"} noOverlay styles={ styles }>
            <Accordion>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Teste!
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body><Link href="#">aaaaaaaaaaaaa</Link></Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Outro teste!
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body><Link href="#"><a>n sei que que eu faso</a></Link></Card.Body>
                    </Accordion.Collapse>
                </Card>
                
            </Accordion>
            <Button>
                Adicionar Template
            </Button>            
        </Menu>
    </div>
    </Col>
    </Row>
);
        
export default Sidebar;