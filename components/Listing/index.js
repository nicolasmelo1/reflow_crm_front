import { Row, Col } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import ListagemTable from './ListagemTable'
import ListingFilter from './ListingFilter'
import ListingTotalCardGroup from './ListingTotalCardGroup'
import ListingColumnSelectButton from './ListingColumnSelectButton'
import { ListingTotalLabel, ListingFilterButton } from 'styles/Listing'

class Listing extends React.Component {
    constructor(props) {
        super(props)

        const params = {
            from: '25/11/2019',
            to: '03/03/2020',
            page: 1
        }
        
        this.props.onGetData(params, this.props.query.form)
        this.props.onGetHeader(this.props.query.form),
        this.props.onGetTotal(params, this.props.query.form)
    }


    render() {
        return (
            <>
                <Row>
                    <ListingTotalLabel>Totais</ListingTotalLabel>
                </Row>
                <Row>
                    <ListingTotalCardGroup cards={this.props.list.totals} />
                </Row>
                <Row>
                    <Col>
                        <ListingFilter onGetData={this.props.onGetData} headers={this.props.list.header} />
                    </Col>
                    <Col>
                        <ListingFilterButton size="sm" >Extrair</ListingFilterButton>
                    </Col>
                    <Col>
                        <ListingColumnSelectButton headers={this.props.list.header} onUpdateSelected={this.props.onUpdateSelected} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListagemTable heading={this.props.list.header} elements={this.props.list.data} setFormularyId={this.props.setFormularyId} />
                    </Col>
                </Row>
            </>
        )
    }
}

export default connect(state => ({ list: state.home.list }), actions)(Listing)