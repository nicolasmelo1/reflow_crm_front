import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/actions'
import KanbanConfigurationForm from './KanbanConfigurationForm'
import KanbanTable from './KanbanTable'
import Filter from 'components/Filter'
import { KanbanFilterIcon, KanbanFilterHolder, KanbanFilterContainer, KanbanFilterButton, KanbanConfigurationButton } from 'styles/Kanban'
import { Row, Col } from 'react-bootstrap'

class Kanban extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            configurationIsOpen: false,
            params: {
                from: '25/11/2019',
                to: '03/03/2020',
                search_value: this.props.search.value,
                search_exact: this.props.search.exact,
                search_field: this.props.search.field
            }
        }
        this.props.onRenderKanban(this.props.query.form)
        this.props.onGetCards(this.props.query.form)
        this.props.onGetKanbanData(this.state.params, this.props.query.form)
    }

    getDimensionOrders = () =>{
        if (this.props.kanban.initial.default_dimension_field_id && this.props.kanban.initial.default_kanban_card_id) {
            this.props.onGetDimensionOrders(this.props.query.form, this.props.kanban.initial.default_dimension_field_id)
        }
    }

    setParams = async (params) => {
        const response = await this.props.onGetKanbanData(params ,this.props.query.form)
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
     */
    isToUpdateData = (prevProps) => {
        return (
            this.props.kanban.cards.length > 0 && 
            this.props.kanban.dimension_order.length > 0 && 
            (
                JSON.stringify(prevProps.kanban.dimension_order) !== JSON.stringify(this.props.kanban.dimension_order) ||
                prevProps.kanban.initial.default_kanban_card_id !== this.props.kanban.initial.default_kanban_card_id
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

    componentDidUpdate(prevProps) {
        if (prevProps.kanban.initial.default_dimension_field_id !== this.props.kanban.initial.default_dimension_field_id ||
            prevProps.kanban.initial.default_kanban_card_id !== this.props.kanban.initial.default_kanban_card_id) {
            this.getDimensionOrders()
        }
        if (this.isToUpdateData(prevProps)) {
            this.props.onGetKanbanData(this.state.params, this.props.query.form)
        }

    }

    render() {
        const selectedCard = this.props.kanban.cards.filter(card => card.id === this.props.kanban.initial.default_kanban_card_id)
        return (
            <div>
                {this.props.kanban.initial.dimension_fields.length === 0 ? (
                    <p>
                        Não é possivel visualizar os dados desse formulário em formato de kanban.
                    </p>
                ) : (
                    <div>
                        <Row>
                            <Col>
                                <KanbanConfigurationButton onClick={e=> {this.setConfigurationIsOpen(!this.state.configurationIsOpen)}}>
                                    Configurações obrigatórias
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
                                    dimensionOrders={this.props.kanban.dimension_order}
                                    defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                    card={(selectedCard.length > 0) ? selectedCard[0] : null}
                                    data={this.props.kanban.data}
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