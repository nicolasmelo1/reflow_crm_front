import { connect } from 'react-redux';
import actions from '../redux/actions';
import React from 'react'
import Router from 'next/router';
import { paths, strings } from 'utils/constants'
import Layout from 'components/Layout'

/*** 
 * The empty page, this only redirects the user to a certain page depending if he is logged or not
 * */
class Index extends React.Component {
    constructor(props){
        super(props)

    }
    checkIfLogged() {
        return !(!window.localStorage.getItem('token') || window.localStorage.getItem('token') === '')
    }
    componentDidMount() {
        if (this.checkIfLogged()) {
            Router.push(paths.home(this.props.login.companyId, this.props.login.primaryForm))
        }
    }
    render (){
        return (
            <Layout title={strings['pt-br']['indexPageTitle']}/>
        )
    }
}

export default connect(state => ({ login: state.login }), actions)(Index);