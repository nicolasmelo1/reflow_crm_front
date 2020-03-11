import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary, Listing } from 'components';
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button } from 'react-bootstrap';
import Router from 'next/router'

class Data extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visualization: 'listing',
            formularyId: null,//'51003'
            formularyIsOpen: false,
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

    onOpenOrCloseFormulary = (isOpen) => {
        this.setState(() => {
            return {
                formularyIsOpen: isOpen
            }
        })
    }

    setFormularyId = (newValue) => {
        this.setState(() => {
            if (![undefined, null].includes(newValue)) {
                return {
                    formularyIsOpen: true,
                    formularyId: newValue
                }
            } else {
                return {
                    formularyId: newValue
                } 
            }
        })
    }

    render () {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Formulary 
                query={this.props.query} 
                formularyId={this.state.formularyId} 
                setFormularyId={this.setFormularyId} 
                onOpenOrCloseFormulary={this.onOpenOrCloseFormulary}
                formularyIsOpen={this.state.formularyIsOpen}

                />
                <Button type="submit" onClick={e => this.handleLogout(e)}>Logout</Button>
                {(this.state.visualization == 'listing') ? (
                    <Listing query={this.props.query} setFormularyId={this.setFormularyId}/>
                ) : (
                    ''
                )}
            </Layout>
        )
    }
}

export default connect(state => ({ home: state.home }), actions)(Data)