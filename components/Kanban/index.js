import { Row, Col, Button } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import KanbanPane from './KanbanPane';
import KanbanConfigButton from './KanbanConfigButton';


class Kanban extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }


    render() {
        return (
            <div>
                <button>Configurações obrigatórias</button>
                <button>Filtro</button>
                {/*<KanbanConfigButton onGetDimensionOrder={this.props.onGetDimensionOrder} onGetDataKanban={this.props.onGetDataKanban} forms={this.props.forms.initial} card_options={this.props.kanban.card_fields} />*/}
            </div>
        )

    }
}

export default connect(state => ({ kanban: state.home.kanban, types: state.login.types }), actions)(Kanban)