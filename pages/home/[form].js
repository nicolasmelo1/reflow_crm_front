import React from 'react';
import actions from 'redux/actions';
import { Layout, Formulary, Listing, Kanban, Error404 } from 'components';
import { DataTypeHeaderAnchor } from 'styles/Data'
import { connect } from 'react-redux';
import { strings, types } from 'utils/constants';
import { Row, Col } from 'react-bootstrap';
import { withRouter } from 'next/router'


/**
 * 
 */
class Data extends React.Component {

    constructor(props) {
        super(props)

        // the `formularyHasBeenUpdated` variable works like a signal. It doesn't matter if it's true or false
        // what it metters for us is if it has changed it's value. If the value has changed it means the formulary
        // has been updated, we use this to get new data on listing, kanban or whataver visualization the user is in.
        this.state = {
            fullPageFormulary: false, 
            formularyId: null,
            formularyDefaultData: [],
            formularyHasBeenUpdated: false,
            search: {
                value: [],
                exact: [],
                field: []
            }
        }
    }

    /*static async getInitialProps(context) {
        return { query: context.query }
    }*/

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
                    formularyId: null
                } 
            }
        })
    }

    openFormularyId = (value) => {
        this.props.onOpenFormulary(true).then(_=> {
            this.setFormularyId(value)
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
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
            case 'kanban':
                return <Kanban 
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId}
                        setFormularyDefaultData={this.setFormularyDefaultData}
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        setSearch={this.setSearch} 
                        search={this.state.search}
                        />
            default:
                return <Listing 
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
        }
    }

    componentDidUpdate = (oldProps) => {
        if (oldProps.router.query.form !== this.props.router.query.form) {
            this.setFormularyId(null)
        }
    }

    render () {
        const formNames =  [].concat.apply([],this.props.sidebar.map(group => group.form_group.map(form => form.form_name)))

        return (
            <Layout title={strings['pt-br']['managementPageTitle']} showSideBar={true}>
                {!formNames.includes(this.props.router.query.form) ? (
                    <Error404/>
                ) : (
                    <div>
                        <Row>
                            <Col>
                                {this.props.login.types && this.props.login.types.default && this.props.login.types.default.data_type ? this.props.login.types.default.data_type.map(dataType => (
                                    <DataTypeHeaderAnchor 
                                    key={dataType.id}
                                    onClick={e=> {this.setVisualization(dataType.id)}} 
                                    isSelected={this.props.login.user && this.props.login.user.data_type ? this.props.login.user.data_type === dataType.id: false}
                                    >
                                        {types('pt-br','data_type', dataType.name)}    
                                    </DataTypeHeaderAnchor> 
                                )) : ''}
                            </Col>
                        </Row>
                        <Formulary 
                        router={this.props.router.query} 
                        formularyId={this.state.formularyId} 
                        setFormularyId={this.setFormularyId} 
                        setFormularyHasBeenUpdated={this.setFormularyHasBeenUpdated}
                        setFormularyDefaultData={this.setFormularyDefaultData}
                        formularyDefaultData={this.state.formularyDefaultData}
                        onOpenOrCloseFormulary={this.props.onOpenFormulary}
                        />
                        {this.renderVisualization()}
                    </div>
                )}
            </Layout>
        )
    }
}

export default connect(state => ({ login: state.login, sidebar: state.home.sidebar.initial }), actions)(withRouter(Data))