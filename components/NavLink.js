import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";


const NavbarLink = React.forwardRef((props, _) =>{
    props = {...props}
    return (
        <span className="navbar-span">
            <FontAwesomeIcon className="navbar-icon" icon={ props.icon }></FontAwesomeIcon>
            <p className="navbar-label">{props.label}</p>
        </span>
    )
});

export default NavbarLink;