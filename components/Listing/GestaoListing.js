import { Row, Col } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import ListagemTable from './ListagemTable'
import ListingFilter from './ListingFilter'
import ListingTotalCardGroup from './ListingTotalCardGroup'
import ListingColumnSelectButton from './ListingColumnSelectButton'
import { ListingTotalLabel, ListingFilterButton } from 'styles/Listing'

class GestaoListing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.props.onGetData({
            from: '25/11/2019',
            to: '23/01/2020',
            page: 1
        }, 'negocios')
        this.props.onGetHeader('negocios'),
            this.props.onGetTotal('negocios')
    }


    render() {
        console.log(this.props.list);


        return (
            <>
                <Row>
                    <ListingTotalLabel> Totais </ListingTotalLabel>
                </Row>
                <Row>
                    <ListingTotalCardGroup cards={this.props.list.totals} />
                </Row>
                <Row>
                    <Col sm={{}}>
                        <ListingFilter onGetData={this.props.onGetData} headers={this.props.list.header} />
                    </Col>
                    <Col>
                        <ListingFilterButton size="sm" >Extrair</ListingFilterButton>
                    </Col>
                    <Col sm={{ span: 5, offset: 4 }}>
                        <ListingColumnSelectButton headers={this.props.list.header} onUpdateSelected={this.props.onUpdateSelected} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 11 }}>

                        <ListagemTable heading={this.props.list.header} elements={this.props.list.data} />
                    </Col>
                </Row>
            </>
        )
    }
}

export default connect(state => ({ list: state.home.list }), actions)(GestaoListing)