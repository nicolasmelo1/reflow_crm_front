import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary, Listing, Kanban } from 'components';
import { DataTypeHeaderAnchor } from 'styles/Data'
import { connect } from 'react-redux';
import { strings, paths } from 'utils/constants';
import { Button, Row, Col, Nav, Tab } from 'react-bootstrap';
import Router from 'next/router'


/**
 * 
 */
class Data extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visualization: this.props.query.visualization_type,
            formularyId: null,//'51003'
            formularyIsOpen: false,
            search: {
                value: [],
                exact: [],
                field: []
            }
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
        this.setState(state => {
            return {
                ...state,
                formularyIsOpen: isOpen
            }
        })
    }

    setFormularyId = (newValue) => {
        this.setState(state => {
            if (![undefined, null].includes(newValue)) {
                return {
                    ...state,
                    formularyIsOpen: true,
                    formularyId: newValue
                }
            } else {
                return {
                    ...state,
                    formularyId: newValue
                } 
            }
        })
    }

    setSearch = (searchField, searchValue, searchExact) => {
        this.setState(state => {
            return {
                ...state,
                search: {
                    value: searchValue,
                    exact: searchExact,
                    field: searchField
                }
            }
        })
    }

    setVisualization = (visualization) => {
        const route = paths.home(this.props.query.company, visualization, this.props.query.form)
        Router.push('/[company]/home/[visualization_type]/[form]', route, {shallow: true})
        this.setState(state => {
            return {
                ...state,
                visualization: visualization
            }
        })
    }

    renderVisualization = () => {
        switch(this.state.visualization){
            case 'listing': 
                return <Listing query={this.props.query} setFormularyId={this.setFormularyId} setSearch={this.setSearch} search={this.state.search}/>
            case 'kanban':
                return <Kanban query={this.props.query} setFormularyId={this.setFormularyId} setSearch={this.setSearch} search={this.state.search}/>
            default:
                return <Listing query={this.props.query} setFormularyId={this.setFormularyId} setSearch={this.setSearch} search={this.state.search}/>
        }
    }

    render () {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Row>
                    <Col>
                        <DataTypeHeaderAnchor onClick={e=> {this.setVisualization('kanban')}} isSelected={this.state.visualization === 'kanban'}>
                            Kanban    
                        </DataTypeHeaderAnchor>
                        <DataTypeHeaderAnchor onClick={e=> {this.setVisualization('listing')}} isSelected={this.state.visualization === 'listing'}>
                            Listagem
                        </DataTypeHeaderAnchor>  
                    </Col>
                </Row>
                <Formulary 
                query={this.props.query} 
                formularyId={this.state.formularyId} 
                setFormularyId={this.setFormularyId} 
                onOpenOrCloseFormulary={this.onOpenOrCloseFormulary}
                formularyIsOpen={this.state.formularyIsOpen}
                />
                {this.renderVisualization()}
            </Layout>
        )
    }
}

export default connect(state => ({ home: state.home }), actions)(Data)