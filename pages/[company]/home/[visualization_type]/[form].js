import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary } from 'components';
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button } from 'react-bootstrap';
import Router from 'next/router'

class Data extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formularyId: null//'51003'
        }
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

    setFormularyId = (newValue) => {
        this.setState(() => {
            return {
                formularyId: newValue
            }
        })
    }

    render () {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Formulary query={this.props.query} formularyId={this.state.formularyId} setFormularyId={this.setFormularyId}/>
                <Button type="submit" onClick={e => this.handleLogout(e)}>Logout</Button>
            </Layout>
        )
    }
}

export default  connect(state => ({home: state.home}), actions)(Data)