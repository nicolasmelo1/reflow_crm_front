import React from 'react'
import { connect } from 'react-redux';
import Router from 'next/router';
import actions from '@shared/redux/actions';
import { paths, strings } from '@shared/utils/constants'
import Layout from '@shared/components/Layout'
import Header from '../components/Header'

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
        if (this.checkIfLogged() && !['', null, undefined].includes(this.props.login.primaryForm)) {
            Router.push(paths.home().asUrl, paths.home(this.props.login.primaryForm).asUrl, {shallow: true})
        }
    }
    
    render (){
        return (
            <Layout addTemplates={['', null, undefined].includes(this.props.login.primaryForm)} hideNavBar={true}>
                <Header title={strings['pt-br']['indexPageTitle']}/>
            </Layout>
        )
    }
}

export default connect(state => ({ login: state.login }), actions)(Index);