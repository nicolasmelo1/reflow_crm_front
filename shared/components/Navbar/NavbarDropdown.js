import React, { useState, useEffect } from 'react'
import { NavbarDropdownContentContainer, NavbarLinkIcon, NavbarLinkLabel, NavbarDropdownContainer, NavbarDropdownItem, NavbarDropdownButton, NavbarDropdownArrowIcon , NavbarLinkIconContainer} from '../../styles/Navbar'

const NavbarDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = React.useRef()

    /**
     * Closes the dropdown when the user clicks outside of the view dropdown container.
     * 
     * @param {SyntheticEvent} e - The event object fired by the mousedown event 
     */
    const closeDropdownWhenClickOutsideWeb = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener('mousedown', closeDropdownWhenClickOutsideWeb)
        }
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener('mousedown', closeDropdownWhenClickOutsideWeb)
            }
        }
    }, [])
    return (
        <NavbarDropdownContainer ref={dropdownRef}>
            <NavbarDropdownButton 
            isOpen={isOpen} 
            onClick={e=> {
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