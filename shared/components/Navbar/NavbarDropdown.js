import React, { useState } from 'react'
import { NavDropdown } from 'react-bootstrap'
import NavbarLink from './NavbarLink'
import { NavbarDropdownContentContainer, NavbarLinkIcon, NavbarLinkLabel, NavbarDropdownContainer, NavbarDropdownItem, NavbarDropdownButton, NavbarDropdownArrowIcon , NavbarLinkIconContainer} from '../../styles/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const NavbarDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <NavbarDropdownContainer>
            <NavbarDropdownButton isOpen={isOpen} onClick={e=> {
                e.preventDefault()
                setIsOpen(!isOpen)
            }}>
                <NavbarLinkIconContainer>
                    <NavbarLinkIcon icon={props.icon} />
                </NavbarLinkIconContainer>
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
                <NavbarDropdownArrowIcon icon={isOpen ? 'chevron-up' : 'chevron-down'} />
            </NavbarDropdownButton>
            {isOpen ? (
                <NavbarDropdownContentContainer>
                    {props.items.map((item, index)=> (
                        <NavbarDropdownItem key={index} href={item.href} onClick={e => { (item.onClick) ? item.onClick(e): null }}>
                            {item.label}
                        </NavbarDropdownItem>
                    ))}
                </NavbarDropdownContentContainer>
            ) : ''}
        </NavbarDropdownContainer>
    )
}

export default NavbarDropdown