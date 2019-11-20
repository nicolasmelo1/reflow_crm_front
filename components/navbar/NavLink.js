import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import strings from '../texts/pt-br'
import React from "react";


const NavbarLink = React.forwardRef((props, _) =>{
    props = {...props}
    return (
        <span className="navbar-span">
            <FontAwesomeIcon className="navbar-icon" icon={ props.icon }></FontAwesomeIcon>
            <p className="navbar-label">{ strings[props.label] }</p>
        </span>
    )
});

export default NavbarLink;