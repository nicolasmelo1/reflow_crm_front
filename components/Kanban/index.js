import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/actions'
import { strings } from 'utils/constants'
import KanbanConfigurationForm from './KanbanConfigurationForm'
import KanbanTable from './KanbanTable'
import Filter from 'components/Filter'
import { KanbanFilterIcon, KanbanFilterHolder, KanbanFilterContainer, KanbanFilterButton, KanbanConfigurationButton } from 'styles/Kanban'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

/**
 * This controls everything from the Kanban component, this component holds the Kanban table (with it's dimension and cards),
 * the kanban configuration form and also the filter, that is shared with other visualization types.
 * 
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Object} query - The object containing all of the parameters of the current url, you may find it
 * with the Router object in next.js
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Boolean} formularyHasBeenUpdated - this boolean is explained in the data page. This Boolean works like 
 * a signal, the value is not important.
 * @param {Function} setSearch - this function is to set search data, the search data is shared between visualization
 * types, that's why we use this.
 * @param {Object} search - object that is used to share between search data between search data.
 */
class Kanban extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            configurationIsOpen: false,
            params: {
                page: 1,
                search_value: this.props.search.value,
                search_exact: this.props.search.exact,
                search_field: this.props.search.field
            }
        }
    }


    setParams = async (params) => {
        if (this.props.kanban.initial.default_dimension_field_id && this.props.kanban.initial.default_kanban_card_id) {
            this.source = this.CancelToken.source()
            this.props.onGetKanbanData(this.source, params ,this.props.query.form)
        }

        this.setState(state => {
            return {
                ...state,
                params: params
            }
        })
    }

    onFilter = (searchInstances) => {
        const params = {
            ...this.state.params,
            search_value: [],
            search_exact: [],
            search_field: []
        }
        searchInstances.forEach(searchInstance => {
            if (searchInstance.value !== '' && searchInstance.field_name !== '') {
                params.search_value.push(searchInstance.value)
                params.search_field.push(searchInstance.field_name)
                params.search_exact.push(0)
            }
        })
        this.props.setSearch(params.search_field, params.search_value, params.search_exact)
        this.setParams({...params})
    }

    setConfigurationIsOpen = (configurationIsOpen) => {
        this.setState(state=> {
            return {
                ...state,
                configurationIsOpen: configurationIsOpen
            }
        })
    }

    canUpdateKanbanData = (oldProps) => {
        return this.props.formularyHasBeenUpdated !== oldProps.formularyHasBeenUpdated && this.props.kanban.initial && this.props.kanban.initial.default_kanban_card_id && this.props.kanban.initial.default_dimension_field_id
    }
    
    componentDidMount() {
        this.source = this.CancelToken.source()
        this.props.onRenderKanban(this.source, this.props.query.form)
        this.props.onGetCards(this.source, this.props.query.form)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.query.form !== this.props.query.form) { 
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onChangeDimensionOrdersState([])
            this.props.onRenderKanban(this.source, this.props.query.form)
            this.props.onGetCards(this.source, this.props.query.form)
        }
        if (this.canUpdateKanbanData(prevProps)) {
            this.source = this.CancelToken.source()
            this.props.onGetKanbanData(this.source, this.state.params, this.props.query.form)
        }
    }

    componentWillUnmount() {
        if (this.source) {
            this.source.cancel()
        }
    }
    
    render() {
        const selectedCard = (this.props.kanban.initial && this.props.kanban.cards) ? this.props.kanban.cards.filter(card => card.id === this.props.kanban.initial.default_kanban_card_id) : []

        return (
            <div>
                {this.props.kanban.initial.formName !== this.props.query.form ? '' : (
                    <div>
                        {!this.props.kanban.initial || this.props.kanban.initial.dimension_fields.length === 0 ? (
                            <p>
                                {strings['pt-br']['kanbanCannotBuildMessage']}
                            </p>
                        ) : (
                            <div>
                                <Row>
                                    <Col>
                                        <KanbanConfigurationButton onClick={e=> {this.setConfigurationIsOpen(!this.state.configurationIsOpen)}}>
                                            {this.state.configurationIsOpen ? strings['pt-br']['kanbanObligatorySettingIsOpenButtonLabel'] :  strings['pt-br']['kanbanObligatorySettingIsClosedButtonLabel']}
                                        </KanbanConfigurationButton>
                                        {this.state.configurationIsOpen ? '' : (
                                            <Filter
                                            fields={(this.props.kanban.initial.fields) ? this.props.kanban.initial.fields.map(field=> ({ name: field.name, label: field.label_name, type: field.type })) : []}
                                            params={this.state.params} 
                                            onFilter={this.onFilter}
                                            types={this.props.types}
                                            container={KanbanFilterHolder}
                                            filterButton={KanbanFilterButton}
                                            filterContainer={KanbanFilterContainer}
                                            filterButtonIcon={<KanbanFilterIcon icon="filter"/>}
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <Row style={{ margin: '10px -15px 0 -15px' }}>
                                    <Col>
                                        {this.state.configurationIsOpen ? (
                                            <KanbanConfigurationForm 
                                            formName={this.props.query.form}
                                            onRemoveCard={this.props.onRemoveCard}
                                            onChangeDefaultState={this.props.onChangeDefaultState}
                                            onCreateOrUpdateCard={this.props.onCreateOrUpdateCard}
                                            onChangeCardsState={this.props.onChangeCardsState}
                                            fields={this.props.kanban.initial.fields}
                                            dimensionFields={this.props.kanban.initial.dimension_fields}
                                            defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                                            defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                            cards={this.props.kanban.cards}
                                            />
                                        ): (
                                            <KanbanTable
                                            formName={this.props.query.form}
                                            cancelToken={this.CancelToken}
                                            params={this.state.params}
                                            dimensionOrders={this.props.kanban.dimension_order}
                                            defaultFormName={this.props.kanban.initial.formName}
                                            defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                            defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                                            onGetDimensionOrders={this.props.onGetDimensionOrders}
                                            card={(selectedCard.length > 0) ? selectedCard[0] : null}
                                            data={this.props.kanban.data}
                                            onGetKanbanData={this.props.onGetKanbanData}
                                            onChangeKanbanData={this.props.onChangeKanbanData}
                                            setFormularyDefaultData={this.props.setFormularyDefaultData}
                                            setFormularyId={this.props.setFormularyId}
                                            onChangeDimensionOrdersState={this.props.onChangeDimensionOrdersState}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )

    }
}

export default connect(state => ({ kanban: state.home.kanban, types: state.login.types }), actions)(Kanban)