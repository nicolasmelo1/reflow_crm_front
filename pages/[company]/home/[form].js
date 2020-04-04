import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary, Listing, Kanban } from 'components';
import { DataTypeHeaderAnchor } from 'styles/Data'
import { connect } from 'react-redux';
import { strings, types, paths } from 'utils/constants';
import { Button, Row, Col } from 'react-bootstrap';
import { withRouter } from 'next/router'


/**
 * 
 */
class Data extends React.Component {

    constructor(props) {
        super(props)

        // the `formularyHasBeenUpdated` variable works like a signal. It doesn't matter if it's true or false
        // what it metters for us is if it has changed it's value. If the value has changed it means the formulary
        // has been updated
        this.state = {
            formularyId: null,//'51003'
            formularyDefaultData: [],
            formularyHasBeenUpdated: false,
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

    onOpenOrCloseFormulary = (isOpen) => {
        this.props.onOpenFormulary(isOpen)
    }

    setFormularyDefaultData = (defaults) => {
        this.setState(state => {
            return {
                ...state,
                formularyDefaultData: defaults
            }
        })
    }

    setFormularyHasBeenUpdated = () => {
        this.setState(state => {
            return {
                ...state,
                formularyHasBeenUpdated: !this.state.formularyHasBeenUpdated
            }
        })
    }

    setFormularyId = (newValue) => {
        this.setState(state => {
            if (![undefined, null].includes(newValue)) {
                return {
                    ...state,
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

    openFormularyId = (value) => {
        this.setFormularyId(value)

        setTimeout(() => {
            this.onOpenOrCloseFormulary(true)
        }, 300)
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

    getDataType = (dataTypeId) => {
        return  this.props.login.types ? this.props.login.types.default.data_type.filter(dataType => dataType.id === dataTypeId) : 'listing'
    }
    

    setVisualization = (dataTypeId) => {
        this.props.login.user.data_type = dataTypeId
        this.props.onUpdateUser({...this.props.login.user})
    }

    renderVisualization = () => {
        const dataType = this.props.login.user && this.getDataType(this.props.login.user.data_type).length > 0 ? this.getDataType(this.props.login.user.data_type)[0].name : 'listing'
        switch(dataType){
            case 'listing': 
                return <Listing 
                        query={this.props.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
            case 'kanban':
                return <Kanban 
                        query={this.props.query} 
                        setFormularyId={this.openFormularyId}
                        setFormularyDefaultData={this.setFormularyDefaultData}
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        setSearch={this.setSearch} 
                        search={this.state.search}
                        />
            default:
                return <Listing 
                        query={this.props.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
        }
    }


    render () {
        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                <Row>
                    <Col>
                        {this.props.login.types && this.props.login.types.default ? this.props.login.types.default.data_type.map(dataType => (
                            <DataTypeHeaderAnchor key={dataType.id} onClick={e=> {this.setVisualization(dataType.id)}} isSelected={this.props.login.user.data_type === dataType.id}>
                                {types('pt-br','data_type', dataType.name)}    
                            </DataTypeHeaderAnchor> 
                        )) : ''}
                    </Col>
                </Row>
                <Formulary 
                query={this.props.query} 
                formularyId={this.state.formularyId} 
                setFormularyId={this.setFormularyId} 
                setFormularyHasBeenUpdated={this.setFormularyHasBeenUpdated}
                setFormularyDefaultData={this.setFormularyDefaultData}
                formularyDefaultData={this.state.formularyDefaultData}
                onOpenOrCloseFormulary={this.onOpenOrCloseFormulary}
                />
                {this.renderVisualization()}
            </Layout>
        )
    }
}

export default connect(state => ({ login: state.login }), actions)(withRouter(Data))