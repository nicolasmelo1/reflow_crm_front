import React from 'react'
import Link from 'next/link'
import { NavbarLinkIcon, NavbarLinkLabel, NavbarLinkAnchor, NavbarLinkIconContainer } from '../../styles/Navbar'

const NavbarLink = (props) => {
    return (
        <Link href={props.slug ? props.slug : props.link} as={props.link} passHref>
            <NavbarLinkAnchor>
                <NavbarLinkIconContainer badge={props.badge}>
                    <NavbarLinkIcon icon={props.icon} />
                </NavbarLinkIconContainer>
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
            </NavbarLinkAnchor>
        </Link>
    )
};

export default NavbarLink