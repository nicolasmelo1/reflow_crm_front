import { Row, Col } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import KanbanPane from './KanbanPane';
import KanbanConfigButton from './KanbanConfigButton';


class GestaoKanban extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.props.onGetCardFields('negocios')

        // this.props.onGetDimensionOrder('negocios')
        // const card_name_array = this.props.kanban.dimension_order.map(function (dim) {
        //     return dim.options;
        // })
        // console.log(card_name_array)
        // for (dim in card_name_array) {
        //     return this.props.onGetDataKanban({
        //         from: '03/01/2020',
        //         to: '02/03/2020',
        //         page: 1,
        //         search_field: [''],
        //         fields: card_name_array,
        //         search_exact: ['1'],
        //         search_value: [dim.options]
        //     }, 'negocios')


    }

}


render() {
    console.log(this.props.kanban);
    return (
        <>
            <Button></Button>
            <KanbanConfigButton onGetDimensionOrder={this.props.onGetDimensionOrder} onGetDataKanban={this.props.onGetDataKanban} forms={this.props.forms.initial} card_options={this.props.kanban.card_fields} />
        </>
    )


}
}

export default connect(state => ({ kanban: state.home.kanban, forms: state.home.sidebar }), actions)(GestaoKanban)