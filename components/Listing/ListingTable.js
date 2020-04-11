import React, { useState, useEffect } from 'react'
import ListingTableContent from './ListingTableContent'
import ListingTableHeader from './ListingTableHeader'
import { ListingTableContainer, ListingTableLoaderContainer, ListingTableLoaderWrapper } from 'styles/Listing'
import { Table, Spinner } from 'react-bootstrap'
import mobilecheck from 'utils/mobilecheck'
/**
 * This component holds most of the logic from the table component, with it`s headers and content.
 * 
 * @param {Function} onSort - the function to sort the data, this function changes the `params`object
 * this function also updates the `data` array, since it makes a call to the backend to retrieve the sorted data.
 * @param {Function} setFormularyId - This function is actually retrieved from the page, this function retrieved 
 * from the Data page sets a FormularyId when the user clicks the pencil button to edit and open the formulary.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can know the sorted field.
 * @param {Object} headers - object containing primarly all of the fields in the header.
 * @param {Array<Object>} data - The data to display on the table.
 */
const ListingTable = (props) => {
    const isMobile = mobilecheck()
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const tableRef = React.useRef()
    const scrollWrapperRef = React.useRef()
    const scrollRef = React.useRef()
    const data = (props.data) ? props.data: []

    // Check Components/Utils/Select for reference and explanation
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data;
        _setHasFiredRequestForNewPage(data);
    }

    const defineScrollWidth = (e) => {
        if (scrollRef.current) scrollRef.current.style.width = tableRef.current.scrollWidth + 20 + 'px'
    }

    const onScrollerScroll = (e) => {
        if (scrollWrapperRef.current) tableRef.current.scrollLeft = scrollWrapperRef.current.scrollLeft
    }

    const onScroll = (e) => {  
        if (scrollWrapperRef.current) scrollWrapperRef.current.scrollLeft = tableRef.current.scrollLeft
        if (!hasFiredRequestForNewPageRef.current && props.pagination.current < props.pagination.total && tableRef.current.scrollTop >= (tableRef.current.scrollHeight - tableRef.current.offsetHeight))  {
            setHasFiredRequestForNewPage(true) 
            props.params.page = props.pagination.current + 1
            props.setParams(props.params).then(response=> {
                if (response.status === 200) {
                    if (response.data.data.length===0) {
                        setLastResponseWasEmpty(true)
                    }
                    setHasFiredRequestForNewPage(false) 
                }
            })
        }
    }

    useEffect(() => {
        defineScrollWidth()
        window.addEventListener('resize', defineScrollWidth)
        if (scrollWrapperRef.current && tableRef.current) {
            scrollWrapperRef.current.addEventListener('scroll', onScrollerScroll)
            tableRef.current.addEventListener('scroll', onScroll)
        }
        return () => {
            window.removeEventListener('resize', defineScrollWidth)
            if (scrollWrapperRef.current && tableRef.current) {
                scrollWrapperRef.current.removeEventListener('scroll', onScrollerScroll)
                tableRef.current.removeEventListener('scroll', onScroll)
            }
        }
    })

    return (
        <div>
            {!isMobile ? (
                <div style={{ width: '100%', overflowY: 'hidden', overflowX: 'scroll', height:'20px' }} ref={scrollWrapperRef}>
                    <div style={{ height:'20px'}} ref={scrollRef}></div>
                </div>
            ): ''}
            <ListingTableContainer ref={tableRef}>
                <Table>
                    <ListingTableHeader headers={headers} params={props.params} onSort={props.onSort} defineScrollWidth={defineScrollWidth}/>
                    <ListingTableContent headers={headers} pagination={props.pagination} data={data} setFormularyId={props.setFormularyId} onRemoveData={props.onRemoveData}/>
                </Table>
                
                {hasFiredRequestForNewPage ? (
                    <ListingTableLoaderContainer>
                        <Spinner animation="border" />
                    </ListingTableLoaderContainer>
                ): ''}
            </ListingTableContainer>
        </div>
    )
}

export default ListingTable;