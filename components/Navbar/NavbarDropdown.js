import { NavDropdown } from 'react-bootstrap'
import { NavbarLinkIcon, NavbarLinkLabel} from 'styles/Navbar'


const NavbarDropdown = (props) => {
    return (
        <NavDropdown 
        title={
            <span>
                <NavbarLinkIcon icon={props.icon} />
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
            </span>
        }>
            {props.items.map((item, index)=> (
                <NavDropdown.Item as="button" key={index} href={item.href} onClick={e => { (item.onClick) ? item.onClick(e): null }}>
                    {item.label}
                </NavDropdown.Item>
            ))}
        </NavDropdown>
    )
}

export default NavbarDropdown