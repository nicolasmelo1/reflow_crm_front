import React from 'react';
import actions from 'redux/actions';
import Layout from 'components/Layout';
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button } from 'react-bootstrap';
import Router from 'next/router'

class Data extends React.Component {
    constructor(props) {
        super(props)
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
                  <Button type="submit" onClick={e => this.handleLogout(e)}>Logout</Button>
            </Layout>
        )
    }
}

export default  connect(state => state, actions)(Data)