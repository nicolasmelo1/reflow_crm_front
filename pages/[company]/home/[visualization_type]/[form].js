import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary } from 'components';
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button } from 'react-bootstrap';
import Router from 'next/router'
import { useRouter } from 'next/router';

class Data extends React.Component {
    constructor(props) {
        super(props)
    }

    static async getInitialProps(context) {
        return { query: context.query }
    }

    // TEMPORARY
    handleLogout(e) {
        e.preventDefault();
        this.props.onDeauthenticate()
        Router.push(paths.login())
    }

    render () {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Formulary query={this.props.query}/>
                <Button type="submit" onClick={e => this.handleLogout(e)}>Logout</Button>
            </Layout>
        )
    }
}

export default  connect(state => ({home: state.home}), actions)(Data)