import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/actions'
import KanbanConfigurationForm from './KanbanConfigurationForm'
import KanbanTable from './KanbanTable'
import { Row, Col } from 'react-bootstrap'

class Kanban extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configurationIsOpen: false
        }
        this.props.onRenderKanban(this.props.query.form)
        this.props.onGetCards(this.props.query.form)
    }

    getDimensionOrders = () =>{
        if (this.props.kanban.initial.default_dimension_field_id && this.props.kanban.initial.default_kanban_card_id) {
            this.props.onGetDimensionOrders(this.props.query.form, this.props.kanban.initial.default_dimension_field_id)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kanban.initial.default_dimension_field_id !== this.props.kanban.initial.default_dimension_field_id ||
            prevProps.kanban.initial.default_kanban_card_id !== this.props.kanban.initial.default_kanban_card_id) {
          this.getDimensionOrders();
        }
    }


    setConfigurationIsOpen = (configurationIsOpen) => {
        this.setState(state=> {
            return {
                ...state,
                configurationIsOpen: configurationIsOpen
            }
        })
    }

    render() {
        return (
            <div>
                {this.props.kanban.initial.dimension_fields.length === 0 ? (
                    <p>
                        Não é possivel visualizar os dados desse formulário em formato de kanban.
                    </p>
                ) : (
                    <div>
                        <button onClick={e=> {this.setConfigurationIsOpen(!this.state.configurationIsOpen)}}>Configurações obrigatórias</button>
                        <button>Filtro</button>
                        <Row>
                            <Col>
                                {this.state.configurationIsOpen ? (
                                    <KanbanConfigurationForm 
                                    onChangeDefaultState={this.props.onChangeDefaultState}
                                    formName={this.props.query.form}
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
                                    dimensionOrders={this.props.kanban.dimension_order}
                                    defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                                    defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                    cards={this.props.kanban.cards}
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