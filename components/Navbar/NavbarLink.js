import React from "react";
import Link from 'next/link';
import { Nav } from 'react-bootstrap'
import { NavbarLinkIcon, NavbarLinkLabel, NavbarLinkSpan } from 'styles/Navbar';

const NavBarLink = (props) => {
    return (
        <Link href={props.link} passHref>
            <Nav.Link eventKey={1}>
                <NavbarLinkIcon icon={props.icon} />
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
            </Nav.Link>
        </Link>
    )
};

export default NavBarLink;