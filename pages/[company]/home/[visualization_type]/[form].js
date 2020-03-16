import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary, DataContainer } from 'components';
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button } from 'react-bootstrap';
import { Router, useRouter } from 'next/router'
import GestaoTab from 'components/Gestao/GestaoTab'

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

    render() {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Formulary />
                <Button type="submit" onClick={e => this.handleLogout(e)}>Logout</Button>
                <GestaoTab defaultActive='kanban' />

                <DataContainer visualization='kanban' />
            </Layout>
        )
    }
}

export default connect(state => ({ home: state.home }), actions)(Data)