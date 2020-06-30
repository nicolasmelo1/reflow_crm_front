import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Router, { withRouter } from 'next/router'
import actions from '@shared/redux/actions';
import { Layout, Formulary, Listing, Kanban, Error404, Dashboard } from '@shared/components';
import { DataTypeHeaderAnchor } from '@shared/styles/Data'
import { strings, types, paths } from '@shared/utils/constants';


/**
 * 
 */
class Data extends React.Component {

    constructor(props) {
        super(props)

        // the `formularyHasBeenUpdated` and `formularySettingsHasBeenUpdated` variable works like a signal. It doesn't matter if it's true or false
        // what it metters for us is if it has changed it's value. If the value has changed it means the formulary
        // has been updated, we use this to get new data on listing, kanban or whataver visualization the user is in.
        this.state = {
            fullPageFormulary: false, 
            formularyId: null,
            formularyDefaultData: [],
            formularySettingsHasBeenUpdated: false,
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

    /**
     * Works like a signal for the visualization, like 
     * listing and kanban to load the header and dimensions again
     */
    setFormularySettingsHasBeenUpdated = () => {
        this.setState(state => {
            return {
                ...state,
                formularySettingsHasBeenUpdated: !this.state.formularySettingsHasBeenUpdated
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
        this.setFormularyId(value)
        this.props.onOpenFormulary(true)
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
        return  this.props.types ? this.props.types.defaults.data_type.filter(dataType => dataType.id === dataTypeId) : 'listing'
    }


    setVisualization = (dataTypeId) => {
        this.props.user.data_type = dataTypeId
        this.props.onUpdateUser({...this.props.user})
    }

    renderVisualization = () => {
        const dataType = this.props.user && this.getDataType(this.props.user.data_type).length > 0 ? this.getDataType(this.props.user.data_type)[0].name : 'listing'
        switch(dataType) {
            case 'dashboard':
                return <Dashboard
                        formName={this.props.router.query.form}
                        search={this.state.search}
                        setSearch={this.setSearch} 
                        />
            case 'listing': 
                return <Listing 
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularySettingsHasBeenUpdated={this.state.formularySettingsHasBeenUpdated}
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
            case 'kanban':
                return <Kanban 
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId}
                        setFormularyDefaultData={this.setFormularyDefaultData}
                        formularySettingsHasBeenUpdated={this.state.formularySettingsHasBeenUpdated}
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        setSearch={this.setSearch} 
                        search={this.state.search}
                        />
            default:
                return <Listing 
                        router={this.props.router.query} 
                        setFormularyId={this.openFormularyId} 
                        setSearch={this.setSearch} 
                        formularySettingsHasBeenUpdated={this.state.formularySettingsHasBeenUpdated}
                        formularyHasBeenUpdated={this.state.formularyHasBeenUpdated}
                        search={this.state.search}
                        />
        }
    }

    componentDidMount = () => {
        this.props.onUpdatePrimaryForm(this.props.router.query.form)
        if (this.props.router.query.formId) {
            // we take out the formId parameter of the url because it can cause some weird and non wanted
            // behaviour to the user if it is defined
            Router.push(paths.home(), paths.home(this.props.router.query.form), {shallow: true})            
            this.openFormularyId(this.props.router.query.formId)
        }
    }

    componentDidUpdate = (oldProps) => {
        if (oldProps.router.query.form !== this.props.router.query.form) {
            this.setFormularyId(null)
            this.props.onUpdatePrimaryForm(this.props.router.query.form)
        }
    }

    render () {
        const formNames =  this.props.sidebar ? [].concat.apply([],this.props.sidebar.map(group => group.form_group.map(form => ({ name: form.form_name, label: form.label_name })))) : []
        const currentForm = formNames.filter(form=> form.name === this.props.router.query.form)
        const title = (currentForm.length > 0) ? strings['pt-br']['managementPageTitle'].replace('{}', currentForm[0].label) : 'Não conseguimos encontrar a página / Reflow'
        return (
            <Layout title={title} showSideBar={true}>
                {!formNames.map(form=> form.name).includes(this.props.router.query.form) ? (
                    <Error404/>
                ) : (
                    <div>
                        <Row>
                            <Col>
                                {this.props.types && this.props.types.defaults && this.props.types.defaults.data_type ? this.props.types.defaults.data_type.map(dataType => (
                                    <DataTypeHeaderAnchor 
                                    key={dataType.id}
                                    onClick={e=> {this.setVisualization(dataType.id)}} 
                                    isSelected={this.props.user && this.props.user.data_type ? this.props.user.data_type === dataType.id: false}
                                    >
                                        {types('pt-br','data_type', dataType.name)}    
                                    </DataTypeHeaderAnchor> 
                                )) : ''}
                            </Col>
                        </Row>
                        <Formulary 
                        display='bottom'
                        type='full'
                        formName={this.props.router.query.form} 
                        formularyId={this.state.formularyId} 
                        setFormularyId={this.setFormularyId} 
                        setFormularySettingsHasBeenUpdated={this.setFormularySettingsHasBeenUpdated}
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

export default connect(state => ({ user: state.login.user, company: state.login.company, types: state.login.types, sidebar: state.home.sidebar.initial }), actions)(withRouter(Data))