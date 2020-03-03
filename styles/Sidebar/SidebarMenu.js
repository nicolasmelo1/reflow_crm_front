import { push as Menu } from 'react-burger-menu'
import React from 'react'
import styled from 'styled-components'


export default styled(({sidebarIsOpen, ...rest}) => <nav {...rest}/>)`
    justify-content: center;
    background: #444;
    height: calc(100vh - 3.25rem);
    overflow-y: auto;
    text-align: auto;
    padding: 0 0 2rem 0;
    position: absolute;
    top: 0;
    z-index: 10;
    transition: width 0.3s ease-in-out;
    box-shadow: 0 4px 20px 0 #444444;
    width: ${({ sidebarIsOpen }) => sidebarIsOpen ? '310px' : '0'};
`

/*const styles = {
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

export default SidebarMenu*/