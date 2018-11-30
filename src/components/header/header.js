import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class Header extends Component{
    render(){
        return (
            <Router>
                <nav className="navbar navbar-default">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="google.com">
                                <span>
                                    <img className="header-logo img-responsive"
                                         src="https://i.imgur.com/ocwGRJl.png"/>

                                    <p className="header-text">Pipeline</p>
                                </span>
                        </a>
                        <button type="button"
                                className="navbar-toggle collapsed" data-toggle="collapse" data-target="navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="nav-item">
                                <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown"
                                   aria-haspopup="true" aria-expanded="true">
                                    Formulário
                                </a>
                                <ul className="dropdown-menu"
                                    aria-labelledby="dropdownMenu1">
                                    <li><Link to="/">Pipeline</Link></li>
                                    <li role="separator" className="divider"></li>
                                    <li><Link to="/business_plan">Business Plan</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link to="/protocolos">
                                    Protocolos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard">
                                    Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/logout">
                                    Logout</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </Router>
        )
    }
}