import React from 'react'
import Link from 'next/link'
import { Nav } from 'react-bootstrap'
import { NavbarLinkIcon, NavbarLinkLabel } from '../../styles/Navbar'

const NavbarLink = (props) => {
    return (
        <Link href={props.slug ? props.slug : props.link} as={props.link} passHref>
            <Nav.Link eventKey={1}>
                <NavbarLinkIcon icon={props.icon} />
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
            </Nav.Link>
        </Link>
    )
};

export default NavbarLink