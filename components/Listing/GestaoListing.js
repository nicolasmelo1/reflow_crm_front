import { Row, Col, Button } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import ListagemTable from './ListagemTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
        this.props.onGetHeader('negocios')
    }


    render() {
        console.log(this.props);
        return (
            <>
                <Row>
                    <Col sm={{ span: 2 }}>
                        <Button size="sm" style={{ background: "#444444", borderRadius: "20px", width: "126px", padding: "5px 5px" }}> <FontAwesomeIcon icon="filter" style={{ width: "24px", color: "white" }} />Filtro</Button>
                        <Button size="sm" style={{ background: "#444444", borderRadius: "20px", width: "126px", padding: "5px 5px" }}>Extrair</Button>
                    </Col>
                    <Col sm={{ span: 5, offset: 4 }}>
                        <Button size="sm" block style={{ background: "#444444", borderRadius: "20px", padding: "5px 5px" }}>Todas as colunas selecionadas</Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 11 }}>

                        <ListagemTable elements={this.props.listing.data} />
                    </Col>
                </Row>
            </>
        )
    }
}

export default connect(state => ({ listing: state.home.list }), actions)(GestaoListing)