import React from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import ListingTable from './ListingTable'
import ListingExtract from './ListingExtract'
import ListingTotals from './ListingTotals'
import ListingTotalsForm from './ListingTotalsForm'
import ListingColumnSelect from './ListingColumnSelect'
import Filter from '../Filter'
import actions from '../../redux/actions'
import { ListingFilterAndExtractContainer, ListingFilterContainer, ListingFilterIcon, ListingFilterAndExtractButton, ListingTotalLabel, ListingTotalAddNewButton, ListingButtonsContainer } from '../../styles/Listing'

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
        this.source = null
        this.state = {
            isOpenedTotalsForm: false,
            isLoadingData: false,
            params: {
                page: 1
            }
        }
    }

    // If the data is being loaded by the visualization
    setIsLoadingData = (isLoading) => {
        this.setState(state => {
            return {
                ...state,
                isLoadingData: isLoading
            }
        })
    }

    setIsOpenedTotalsForm = (isOpenedTotalsForm) => {
        this.setState(state => {
            return {
                ...state,
                isOpenedTotalsForm: isOpenedTotalsForm
            }
        })
    }

    getParams = (page) => {
        return {
            ...this.props.filter,
            page: page
        }
    }

    setPageParam = (page) => {
        this.setState(state => (
            state.params.page = page
        ))
        return this.getNewDataFromUpdatedParams(this.getParams(page))
    }

    getNewDataFromUpdatedParams = (params) => {
        if (this.source) {
            this.source.cancel()
        }
        this.source = this.CancelToken.source()
        return this.props.onGetListingData(this.source, params, this.props.router.form)
    }
    
    onFilter = (searchInstances) => {
        this.setIsLoadingData(true)

        const searchParams = this.props.onSetSearch(searchInstances.map(
            searchInstance => ({
                searchField: searchInstance.field_name,
                searchValue: searchInstance.value,
            })
        ))

        let params = {
            ...searchParams,
            sort_field: this.props.filter.sort_field,
            sort_value: this.props.filter.sort_value,
            page: 1
        }

        this.getNewDataFromUpdatedParams({...params}).then(__ => {
            this.setIsLoadingData(false)
        })
    }

    onSort = (fieldName, value) => {
        this.setIsLoadingData(true)

        const searchParams = this.props.onSetSort(fieldName, value)

        let params = {
            ...searchParams,
            search_field: this.props.filter.search_field,
            search_value: this.props.filter.search_value,
            search_exact: this.props.filter.search_exact,
            page: 1
        }
       
        this.getNewDataFromUpdatedParams({...params}).then(__ => {
            this.setIsLoadingData(false)
        })
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onRenderListing(this.source, this.props.router.form)
        this.props.onGetListingData(this.source, this.getParams(this.state.params.page), this.props.router.form)
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.router.form !== this.props.router.form) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onRenderListing(this.source, this.props.router.form)
            this.props.onGetListingData(this.source, this.getParams(this.state.params.page), this.props.router.form)
        }
        if ( this.props.formularySettingsHasBeenUpdated !== prevProps.formularySettingsHasBeenUpdated) {
            this.source = this.CancelToken.source()
            this.props.onRenderListing(this.source, this.props.router.form)
        }
    }

    componentWillUnmount = () => {
        if (this.source ) {
            this.source.cancel()
        }
    }
    render() {
        return (
            <div>
                <Row style={{margin: '5px -15px'}}>
                    <ListingButtonsContainer>
                        <Filter
                        isLoading={this.state.isLoadingData}
                        fields={(this.props.list.field_headers && this.props.list.field_headers) ? 
                                this.props.list.field_headers.map(field=> ({name: field.field.name, label: field.field.label_name, type: field.field.type})) : []} 
                        params={this.getParams(this.state.params.page)} 
                        onFilter={this.onFilter}
                        types={this.props.types}
                        container={ListingFilterAndExtractContainer}
                        filterButton={ListingFilterAndExtractButton}
                        filterContainer={ListingFilterContainer}
                        filterButtonIcon={<ListingFilterIcon icon="filter"/>}
                        />
                        <ListingExtract 
                        params={this.getParams(this.state.params.page)} 
                        onExportData={this.props.onExportData} 
                        onGetExportedData={this.props.onGetExportedData} 
                        formName={this.props.router.form}
                        />
                    </ListingButtonsContainer>
                    <ListingButtonsContainer>
                        <ListingColumnSelect
                        fieldHeaders={this.props.list.field_headers} 
                        onUpdateHeader={this.props.onUpdateHeader}
                        onUpdateSelected={this.props.onUpdateSelected}
                        formName={this.props.router.form}
                        />
                    </ListingButtonsContainer>
                </Row>
                <Row>
                    <Col>
                        <ListingTable 
                        isLoadingData={this.state.isLoadingData}
                        setIsLoadingData={this.setIsLoadingData}
                        page={this.state.params.page} 
                        onRemoveData={this.props.onRemoveData}
                        onSort={this.onSort} 
                        setPageParam={this.setPageParam}
                        getParams={this.getParams}
                        fieldHeaders={this.props.list.field_headers} 
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

export default connect(state => ({ filter: state.home.filter, list: state.home.list, types: state.login.types }), actions)(Listing)