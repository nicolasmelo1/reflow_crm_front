import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Nav = () => (
    <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">
            <img src="/images/logo_3.png" width="249" height="72"/>
        </a>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item active"><Link href="#"><a className="nav-link"><FontAwesomeIcon icon="tasks"  ></FontAwesomeIcon>Gestão</a></Link></li>
                <li className="nav-item"><Link href="#"><a className="nav-link"><FontAwesomeIcon icon="chart-bar"  ></FontAwesomeIcon>Dashboard</a></Link></li>
                <li className="nav-item"><Link href="#"><a className="nav-link"><FontAwesomeIcon icon="cog" size="xs" ></FontAwesomeIcon> Configurações</a></Link></li>
                <li className="nav-item"><Link href="#"><a className="nav-link"><FontAwesomeIcon icon="bell"  ></FontAwesomeIcon>aaaaaaaa</a></Link></li>
                <li className="nav-item"><Link href="#"><a className="nav-link"><FontAwesomeIcon icon="circle"  ></FontAwesomeIcon>b</a></Link></li>
            </ul>
        </div>
    </nav>
);

export default Nav;