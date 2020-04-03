import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/actions'
import { strings } from 'utils/constants'
import KanbanConfigurationForm from './KanbanConfigurationForm'
import KanbanTable from './KanbanTable'
import Filter from 'components/Filter'
import { KanbanFilterIcon, KanbanFilterHolder, KanbanFilterContainer, KanbanFilterButton, KanbanConfigurationButton } from 'styles/Kanban'
import { Row, Col } from 'react-bootstrap'


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

        this.state = {
            configurationIsOpen: false,
            params: {
                page: 1,
                from: '25/11/2019',
                to: '04/04/2020',
                search_value: this.props.search.value,
                search_exact: this.props.search.exact,
                search_field: this.props.search.field
            }
        }
    }


    setParams = async (params) => {
        let response = null
        if (this.props.kanban.initial.default_dimension_field_id && this.props.kanban.initial.default_kanban_card_id) {
            response = await this.props.onGetKanbanData(params ,this.props.query.form)
        }

        this.setState(state => {
            return {
                ...state,
                params: params
            }
        })
        return response
    }

    /**
     * We only get the data when:
     * 
     * 1. The dimension order has changed
     * 2. The selected kanban card has changed
     * 3. A formulary has been updated
     */
    isToUpdateData = (prevProps) => {
        return (
            this.props.kanban.cards.length > 0 && 
            this.props.kanban.dimension_order.length > 0 && 
            this.props.query.form === prevProps.query.form &&
            (
                JSON.stringify(prevProps.kanban.dimension_order) !== JSON.stringify(this.props.kanban.dimension_order) ||
                prevProps.kanban.initial.default_kanban_card_id !== this.props.kanban.initial.default_kanban_card_id ||
                prevProps.formularyHasBeenUpdated !== this.props.formularyHasBeenUpdated 
            )
        )
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

    componentDidMount() {
        this.props.onRenderKanban(this.props.query.form)
        this.props.onGetCards(this.props.query.form)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.query.form !== this.props.query.form) { 
            this.props.onChangeDimensionOrdersState([])
            this.props.onRenderKanban(this.props.query.form)
            this.props.onGetCards(this.props.query.form)
        }
    }

    render() {
        const selectedCard = (this.props.kanban.initial && this.props.kanban.cards) ? this.props.kanban.cards.filter(card => card.id === this.props.kanban.initial.default_kanban_card_id) : []

        return (
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
                                    fields={(this.props.kanban.initial.fields) ? this.props.kanban.initial.fields.map(field=> ({ name: field.name, label: field.label_name })) : []}
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
                        <Row style={{ margin: '10px -15px' }}>
                            <Col>
                                {this.state.configurationIsOpen ? (
                                    <KanbanConfigurationForm 
                                    formName={this.props.query.form}
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
                                    params={this.state.params}
                                    dimensionOrders={this.props.kanban.dimension_order}
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
        )

    }
}

export default connect(state => ({ kanban: state.home.kanban, types: state.login.types }), actions)(Kanban)