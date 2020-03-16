import { Row, Col } from 'react-bootstrap'
import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import ListingTable from './ListingTable'
import ListingFilter from './ListingFilter'
import ListingTotalCardGroup from './ListingTotalCardGroup'
import ListingColumnSelectButton from './ListingColumnSelectButton'
import { ListingTotalLabel, ListingFilterButton } from 'styles/Listing'

class Listing extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            params: {
                from: '25/11/2019',
                to: '03/03/2020',
                page: 1,
                sort_value: [],
                sort_field: [],
                search_value: [],
                search_exact: [],
                search_field: []
            }
        }

        this.props.onGetData(this.state.params, this.props.query.form)
        this.props.onGetHeader(this.props.query.form),
        this.props.onGetTotal(this.state.params, this.props.query.form)
    }

    setParams = (params) => {
        this.props.onGetData(params, this.props.query.form)
        this.setState(state => {
            return {
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
        this.setParams({...params})
    }

    onSort = (fieldName, value) => {
        const params = {...this.state.params}
        if (!fieldName || !value) {
            throw new SyntaxError("onSort() function should recieve a fieldName and a value")
        } 
        if (value && !['down', 'upper', 'none'].includes(value)) {
            throw new SyntaxError("value parameter MUST be one of the both: `upper`, `down` or `none` ")
        }
        if (value === '') {
            const indexToRemove = this.state.params.sort_field.findIndex(sortField=> sortField === fieldName)
            params.sort_value.splice(indexToRemove, 1)
            params.sort_field.splice(indexToRemove, 1)
        } else {
            const indexToUpdate = this.state.params.sort_field.findIndex(sortField=> sortField === fieldName)
            if (indexToUpdate !== -1) {
                params.sort_value[indexToUpdate] = value
                params.sort_field[indexToUpdate] = fieldName
            } else {
                params.sort_value.push(value)
                params.sort_field.push(fieldName)
            }
        }
        this.setParams({...params})
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
                        <ListingFilter 
                        headers={this.props.list.header}
                        params={this.state.params} 
                        onFilter={this.onFilter}
                        />
                        <ListingFilterButton size="sm" >Extrair</ListingFilterButton>
                    </Col>
                    <Col>
                        <ListingColumnSelectButton headers={this.props.list.header} onUpdateSelected={this.props.onUpdateSelected} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListingTable 
                        params={this.state.params} 
                        onSort={this.onSort} 
                        headers={this.props.list.header} 
                        data={this.props.list.data} 
                        setFormularyId={this.props.setFormularyId} />
                    </Col>
                </Row>
            </>
        )
    }
}

export default connect(state => ({ list: state.home.list }), actions)(Listing)