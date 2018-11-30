import React, {Component} from 'react';

export default class Header extends Component{
    render(){
        return <nav className="navbar navbar-default">
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
                            <li><a className="dropdown-item"
                                   href="{% url 'pipeline' company_name %}">Pipeline</a></li>
                            <li role="separator" className="divider"></li>
                            <li><a className="dropdown-item"
                                   href="{% url 'business_plan' company_name %}">Business Plan</a></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="{% url 'protocolos' company_name %}">
                            Protocolos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" style={{Color: "#ffffff"}} href="{% url 'dashboard' company_name %}">
                            Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="{% url 'logout' %}">
                            Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    }
}