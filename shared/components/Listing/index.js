import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { View } from 'react-native'
import ListingTable from './ListingTable'
import ListingExtract from './ListingExtract'
import ListingColumnSelect from './ListingColumnSelect'
import Filter from '../Filter'
import actions from '../../redux/actions'
import Styled from './styles'

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
            showAlert: false,
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
        // we changed the formulary name, so this means we are changing between pages.
        if (prevProps.router.form !== this.props.router.form) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.state
            this.props.onRenderListing(this.source, this.props.router.form)
            this.props.onGetListingData(this.source, this.getParams(1), this.props.router.form)
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

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <Styled.ListingTopToolbarContainer>
                    <div style={{width: '100%'}}>
                        <Filter
                        isLoading={this.state.isLoadingData}
                        fields={(this.props.list.field_headers && this.props.list.field_headers) ? 
                                this.props.list.field_headers.map(field=> ({name: field.field.name, label: field.field.label_name, type: field.field.type})) : []} 
                        params={this.getParams(this.state.params.page)} 
                        onFilter={this.onFilter}
                        types={this.props.types}
                        container={Styled.ListingFilterAndExtractContainer}
                        filterButton={Styled.ListingFilterAndExtractButton}
                        filterContainer={Styled.ListingFilterContainer}
                        filterButtonIcon={<Styled.ListingFilterIcon icon="filter"/>}
                        />
                        <ListingExtract 
                        onAddNotification={this.props.onAddNotification}
                        params={this.getParams(this.state.params.page)} 
                        dateFormat={this.props.dateFormat}
                        onExportData={this.props.onExportData} 
                        onGetExportedData={this.props.onGetExportedData} 
                        formName={this.props.router.form}
                        />
                    </div>
                    <div style={{width: '100%'}}>
                        <ListingColumnSelect
                        fieldHeaders={this.props.list.field_headers} 
                        onUpdateHeader={this.props.onUpdateHeader}
                        onUpdateSelected={this.props.onUpdateSelected}
                        formName={this.props.router.form}
                        />
                    </div>
                </Styled.ListingTopToolbarContainer>
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
                
            </div>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ filter: state.home.filter, list: state.home.list, dateFormat: state.login.dateFormat, types: state.login.types }), actions)(Listing)