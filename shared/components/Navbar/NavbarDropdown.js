import React, { useState } from 'react'
import { NavbarDropdownContentContainer, NavbarLinkIcon, NavbarLinkLabel, NavbarDropdownContainer, NavbarDropdownItem, NavbarDropdownButton, NavbarDropdownArrowIcon , NavbarLinkIconContainer} from '../../styles/Navbar'

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
                        <NavbarDropdownItem 
                        key={index} 
                        href={item.href} 
                        onClick={e => { 
                            e.preventDefault();
                            (item.onClick) ? item.onClick(): null 
                        }}>
                            {item.label}
                        </NavbarDropdownItem>
                    ))}
                </NavbarDropdownContentContainer>
            ) : ''}
        </NavbarDropdownContainer>
    )
}

export default NavbarDropdown