import React from 'react'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import ListingTable from './ListingTable'
import ListingExtract from './ListingExtract'
import ListingTotals from './ListingTotals'
import ListingTotalsForm from './ListingTotalsForm'
import ListingColumnSelect from './ListingColumnSelect'
import Filter from 'components/Filter'
import { ListingFilterAndExtractContainer, ListingFilterContainer, ListingFilterIcon, ListingFilterAndExtractButton, ListingTotalLabel, ListingTotalAddNewButton, ListingButtonsContainer } from 'styles/Listing'
import { strings } from 'utils/constants'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

/**
 * This component render all of the listing logic, like the table, the totals, filters and extract
 * 
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Object} query - The object containing all of the parameters of the current url, you may find it
 * with the Router object in next.js
 */
class Listing extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.dataSource = null
        this.renderSource = null
        this.state = {
            isOpenedTotalsForm: false,
            params: {
                page: 1,
                sort_value: [],
                sort_field: [],
                search_value: this.props.search.value,
                search_exact: this.props.search.exact,
                search_field: this.props.search.field
            }
        }
    }

    setIsOpenedTotalsForm = (isOpenedTotalsForm) => {
        this.setState(state => {
            return {
                ...state,
                isOpenedTotalsForm: isOpenedTotalsForm
            }
        })
    }

    setParams = (params) => {
        this.dataSource = this.CancelToken.source();
        this.setState(state => {
            return {
                ...state,
                params: params
            }
        })
        return this.props.onGetListingData(this.dataSource, params, this.props.query.form)
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
        this.props.onGetTotals(this.state.params, this.props.query.form)
        this.props.setSearch(params.search_field, params.search_value, params.search_exact)
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
        if (value === '' || value === 'none') {
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

    componentDidMount = () => {
        this.renderSource = this.CancelToken.source();
        this.dataSource = this.CancelToken.source();
        this.props.onRenderListing(this.renderSource, this.props.query.form)
        this.props.onGetListingData(this.dataSource, this.state.params, this.props.query.form)
        //this.props.onGetTotals(this.state.params, this.props.query.form)
    }

    componentDidUpdate = (prevProps) => {
        this.renderSource = this.CancelToken.source();
        this.dataSource = this.CancelToken.source();
        if (prevProps.query.form !== this.props.query.form) {
            this.props.onRenderListing(this.renderSource, this.props.query.form)
            this.props.onGetListingData(this.dataSource, this.state.params, this.props.query.form)
            //this.props.onGetTotals(this.state.params, this.props.query.form)
        }
        if (this.props.formularyHasBeenUpdated !== prevProps.formularyHasBeenUpdated) {
            this.props.onGetListingData(this.dataSource, this.state.params, this.props.query.form)
            //this.props.onGetTotals(this.state.params, this.props.query.form)    
        }
    }

    componentWillUnmount = () => {
        if (this.renderSource) {
            this.renderSource.cancel()
        }
        if (this.dataSource) {
            this.dataSource.cancel()
        }
    }
    render() {
        return (
            <div>
                {/*<Row>
                    <Col>
                        <ListingTotalLabel>
                            {strings['pt-br']['listingTotalTitleLabel']}
                            {this.state.isOpenedTotalsForm ? '' : (
                                <ListingTotalAddNewButton onClick={e => {this.setIsOpenedTotalsForm(true)}}/>
                            )}
                        </ListingTotalLabel>
                        {this.state.isOpenedTotalsForm ? (
                            <ListingTotalsForm
                            formName={this.props.query.form} 
                            params={this.state.params}
                            headers={this.props.list.header} 
                            onGetTotals={this.props.onGetTotals}
                            onCreateTotal={this.props.onCreateTotal}
                            setIsOpenedTotalsForm={this.setIsOpenedTotalsForm}
                            types={this.props.types}
                            />
                        ): (
                            <ListingTotals 
                            onRemoveTotal={this.props.onRemoveTotal}
                            onUpdateTotals={this.props.onUpdateTotals}
                            totals={this.props.list.totals} 
                            formName={this.props.query.form} 
                            />
                        )}
                    </Col>
                </Row>*/}
                <Row style={{margin: '5px -15px'}}>
                    <ListingButtonsContainer>
                        <Filter
                        fields={(this.props.list.header && this.props.list.header.field_headers) ? 
                                this.props.list.header.field_headers.map(field=> ({name: field.name, label: field.label_name})) : []} 
                        params={this.state.params} 
                        onFilter={this.onFilter}
                        types={this.props.types}
                        container={ListingFilterAndExtractContainer}
                        filterButton={ListingFilterAndExtractButton}
                        filterContainer={ListingFilterContainer}
                        filterButtonIcon={<ListingFilterIcon icon="filter"/>}
                        />
                        <ListingExtract 
                        params={this.state.params} 
                        onExportData={this.props.onExportData} 
                        onGetExportedData={this.props.onGetExportedData} 
                        formName={this.props.query.form}
                        />
                    </ListingButtonsContainer>
                    <ListingButtonsContainer>
                        <ListingColumnSelect
                        headers={this.props.list.header} 
                        onUpdateHeader={this.props.onUpdateHeader}
                        onUpdateSelected={this.props.onUpdateSelected}
                        formName={this.props.query.form}
                        />
                    </ListingButtonsContainer>
                </Row>
                <Row>
                    <Col>
                        <ListingTable 
                        params={this.state.params} 
                        onSort={this.onSort} 
                        setParams={this.setParams}
                        headers={this.props.list.header} 
                        data={this.props.list.data.data}
                        pagination={this.props.list.data.pagination} 
                        setFormularyId={this.props.setFormularyId}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(state => ({ list: state.home.list, types: state.login.types }), actions)(Listing)