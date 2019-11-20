import Link from 'next/link';
import NavbarLink from './NavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = () => (
    <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">
            <img src="/images/logo_3.png" width="249" height="72"/>
        </a>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item active"><Link href="#"><NavbarLink icon='tasks' label='headerManagementLabel'></NavbarLink></Link></li>
                <li className="nav-item"><Link href="#"><NavbarLink icon='chart-bar' label='headerDashboardLabel'></NavbarLink></Link></li>
                <li className="nav-item"><Link href="#"><NavbarLink icon='cog' label='headerSettingsLabel'></NavbarLink></Link></li>
                <li className="nav-item"><Link href="#"><NavbarLink icon='bell' label='headerNotificationLabel'></NavbarLink></Link></li>
            </ul>
        </div>
    </nav>
);

export default Header;