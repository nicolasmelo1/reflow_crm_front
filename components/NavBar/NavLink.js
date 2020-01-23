import React from "react";
import { NavbarLinkIcon, NavbarLinkLabel, NavbarLinkSpan } from 'styles/Navbar'

const NavbarLink = React.forwardRef((props, _) => {
    props = { ...props }
    return (
        <NavbarLinkSpan>

            <NavbarLinkIcon icon={props.icon} />
            <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
        </NavbarLinkSpan>

    )
});

export default NavbarLink;