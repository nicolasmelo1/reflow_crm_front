import { NavDropdown } from 'react-bootstrap'
import { NavbarLinkIcon, NavbarLinkLabel} from 'styles/Navbar'


const NavBarDropdown = (props) => {
    return (
        <NavDropdown 
        title={
            <span>
                <NavbarLinkIcon icon={props.icon} />
                <NavbarLinkLabel>{props.label}</NavbarLinkLabel>
            </span>
        }>
            {props.items.map((item, index)=> {
                return (
                    <NavDropdown.Item as="button" key={index} href={item.href} onClick={e => { (item.onClick) ? item.onClick(e): null }}>
                        {item.label}
                    </NavDropdown.Item>
                )
            })}
        </NavDropdown>
    )
}

export default NavBarDropdown