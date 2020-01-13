import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import planilha1 from './texts/planilha-1'
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
    height: '100%',
    left: '0px'
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




const Sidebar = (props) => (
  <Row>
    <Col>
      <div id="sidebar-wrapper">
        <Menu disableOverlayClick burgerButtonClassName={"my-class"} width={'200px'} pageWrapId="page-wrap" outerContainerId={"App"} noOverlay styles={styles}>
          <Accordion style={{ width: "100%", border: "0" }}>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                {planilha1.name}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <div>
                  <Card.Body><Link href="/gestao/kanban/t1"><a>{planilha1.tabelas.t1.name}</a></Link></Card.Body>
                  <Card.Body><Link href="/gestao/kanban/t2"><a>{planilha1.tabelas.t2.name}</a></Link></Card.Body>
                </div>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Link href="/gestao/templates" passHref>
            <Button>
              Adicionar Template
              </Button>
          </Link>
        </Menu>
      </div>
    </Col>
  </Row>
);

export default Sidebar;