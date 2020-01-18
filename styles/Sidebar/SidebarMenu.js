import { push as Menu } from 'react-burger-menu'
import React from 'react'

const styles = {
    bmBurgerButton: {
      position: 'relative',
      width: '40px',
      left: '0px',
      top: '10px',
      padding: '0 5px',
      color: '#0dbf7e',
      borderRadius: '0 20px 20px 0',
      background: '#444444'
    },
    bmBurgerBars: {
      background: '#373a47'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
      left: '0px',
      color: '#0dbf7e'
    },
    bmCross: {
      background: 'transparent'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      left: '0px',
      height: '80%'
    },
    bmMenu: {
      background: '#444444',
      paddingTop: '44px',
      fontSize: '1.0em'
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
  
  
  
const SidebarMenu = (props) => (
    <Menu customBurgerIcon={ <p> >>> </p> } customCrossIcon={ <p> &lt;&lt;&lt; </p> } pageWrapId={props.pageWrapId} outerContainerId={props.outerContainerId} noOverlay styles={styles}>
        {props.children}
    </Menu>
)

export default SidebarMenu