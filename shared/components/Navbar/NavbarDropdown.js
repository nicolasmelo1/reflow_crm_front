import React, { useState, useEffect } from 'react'
import Styled from './styles'


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
        <Styled.NavbarDropdownContainer ref={dropdownRef}>
            <Styled.NavbarDropdownButton 
            isOpen={isOpen} 
            onClick={e=> {
                e.preventDefault()
                setIsOpen(!isOpen)
            }}>
                <Styled.NavbarLinkIconContainer>
                    <Styled.NavbarLinkIcon icon={props.icon} />
                </Styled.NavbarLinkIconContainer>
                <Styled.NavbarLinkLabel>{props.label}</Styled.NavbarLinkLabel>
                <Styled.NavbarDropdownArrowIcon icon={isOpen ? 'chevron-up' : 'chevron-down'} />
            </Styled.NavbarDropdownButton>
            {isOpen ? (
                <Styled.NavbarDropdownContentContainer>
                    {props.items.map((item, index)=> (
                        <Styled.NavbarDropdownItem 
                        key={index} 
                        href={item.href} 
                        onClick={e => { 
                            e.preventDefault();
                            (item.onClick) ? item.onClick(): null 
                        }}>
                            {item.label}
                        </Styled.NavbarDropdownItem>
                    ))}
                </Styled.NavbarDropdownContentContainer>
            ) : ''}
        </Styled.NavbarDropdownContainer>
    )
}

export default NavbarDropdown