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
                <button onClick={e=> {this.setConfigurationIsOpen(!this.state.configurationIsOpen)}}>Configurações obrigatórias</button>
                <button>Filtro</button>
                <Row>
                    <Col>
                        {this.state.configurationIsOpen ? (
                            <KanbanConfigurationForm 
                            fields={this.props.kanban.initial.fields}
                            dimensionFields={this.props.kanban.initial.dimension_fields}
                            defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                            defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                            cards={this.props.kanban.cards}
                            />
                        ): (
                            <KanbanTable/>
                        )}
                    </Col>
                </Row>
            </div>
        )

    }
}

export default connect(state => ({ kanban: state.home.kanban, types: state.login.types }), actions)(Kanban)