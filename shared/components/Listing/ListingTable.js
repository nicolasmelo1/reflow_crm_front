import React, { useState, useEffect } from 'react'
import ListingTableContent from './ListingTableContent'
import ListingTableHeader from './ListingTableHeader'
import mobilecheck from '../../utils/mobilecheck'
import dynamicImport from '../../utils/dynamicImport'
import { 
    ListingTableContainer, 
    ListingTableLoaderContainer 
} from '../../styles/Listing'

const Table = dynamicImport('react-bootstrap', 'Table')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component holds most of the logic from the table component, with it`s headers and content.
 * 
 * @param {Function} onSort - the function to sort the data, this function changes the `params`object
 * this function also updates the `data` array, since it makes a call to the backend to retrieve the sorted data.
 * @param {Function} setFormularyId - This function is actually retrieved from the page, this function retrieved 
 * from the Data page sets a FormularyId when the user clicks the pencil button to edit and open the formulary.
 * @param {Function} getParams - Function for retrieving the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can know the sorted field.
 * @param {Array(Object)} fieldHeaders - array containing primarly all of the fields in the header.
 * @param {Array<Object>} data - The data to display on the table.
 */
const ListingTable = (props) => {
    const isMobile = mobilecheck()
    const isMountedRef = React.useRef(false)
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)
    const paginationRef = React.useRef({
        current: 1,
        total: 1
    })
    const tableRef = React.useRef(null)
    const scrollWrapperRef = React.useRef(null)
    const scrollRef = React.useRef(null)
    const data = (props.data) ? props.data: []

    // Check Components/Utils/Select for reference and explanation
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data;
        _setHasFiredRequestForNewPage(data);
    }

    const defineScrollWidth = (e) => {
        if (tableRef && tableRef.current && scrollWrapperRef.current && scrollRef.current) {
            if (tableRef.current.scrollWidth > tableRef.current.clientWidth) {
                scrollWrapperRef.current.style.display = 'block'
                if (scrollRef.current) scrollRef.current.style.width = tableRef.current.scrollWidth + 8 + 'px'
            } else {
                scrollWrapperRef.current.style.display = 'none'
            }
        }
    }

    const onScrollerScroll = (scrollWrapper) => {
        tableRef.current.scrollLeft = scrollWrapper.scrollLeft
    }

    const onScrollTable = (table) => {  
        if (scrollWrapperRef.current) scrollWrapperRef.current.scrollLeft = table.scrollLeft
        if (!hasFiredRequestForNewPageRef.current && props.pagination.current < props.pagination.total && table.scrollTop >= (table.scrollHeight - table.offsetHeight))  {
            setHasFiredRequestForNewPage(true) 
            const page = props.pagination.current + 1
            props.setPageParam(page).then(response=> {
                if (response && isMountedRef.current && response.status === 200) {
                    setHasFiredRequestForNewPage(false) 
                }
            })
        }
    }

    useEffect(() => {
        isMountedRef.current = true
 
        defineScrollWidth()
        window.addEventListener('resize', defineScrollWidth)

        return function () {
            isMountedRef.current = false
            window.removeEventListener('resize', defineScrollWidth)
        }
    }, [])

    useEffect(() => {
        paginationRef.current = props.pagination
    }, [props.pagination])

    return (
        <div>
            {!isMobile ? (
                <div style={{ width: '100%', overflowY: 'hidden', overflowX: 'scroll', height:'20px' }} 
                ref={scrollWrapperRef} 
                onScroll={(e) => onScrollerScroll(e.target)}
                >
                    <div style={{ height:'20px'}} ref={scrollRef}></div>
                </div>
            ): ''}
            <ListingTableContainer ref={tableRef} onScroll={(e) => onScrollTable(e.target)} isMobile={isMobile}>
                <Table>
                    <ListingTableHeader 
                    isLoadingData={props.isLoadingData}
                    setIsLoadingData={props.setIsLoadingData}
                    fieldHeaders={props.fieldHeaders} 
                    getParams={props.getParams} 
                    onSort={props.onSort} 
                    defineScrollWidth={defineScrollWidth}
                    />
                    <ListingTableContent fieldHeaders={props.fieldHeaders} pagination={props.pagination} data={data} setFormularyId={props.setFormularyId} onRemoveData={props.onRemoveData}/>
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

export default ListingTable