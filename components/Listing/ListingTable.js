import React, { useState, useEffect } from 'react'
import ListingTableContent from './ListingTableContent'
import ListingTableHeader from './ListingTableHeader'
import { ListingTableContainer } from 'styles/Listing'
import { Table, Spinner } from 'react-bootstrap'

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
    const [lastResponseWasEmpty, _setLastResponseWasEmpty] = useState(false)
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const data = (props.data) ? props.data: []
    const PAGINATION_LENGTH = 25

    const lastResponseWasEmptyRef = React.useRef()
    const setLastResponseWasEmpty = data => {
        lastResponseWasEmptyRef.current = data;
        _setLastResponseWasEmpty(data);
    }

    // Check Components/Utils/Select for reference and explanation
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data;
        _setHasFiredRequestForNewPage(data);
    }

    const onScroll = (e) => {
        if (!hasFiredRequestForNewPageRef.current && (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight)  {
            if (props.params.page * PAGINATION_LENGTH === props.data.length) {
                setHasFiredRequestForNewPage(true) 
                props.params.page = (!lastResponseWasEmptyRef.current) ? props.params.page+1 : props.params.page
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
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    })

    return (
        <ListingTableContainer>
            <Table>
                <ListingTableHeader headers={headers} params={props.params} onSort={props.onSort}/>
                <ListingTableContent headers={headers} data={data} setFormularyId={props.setFormularyId} />
            </Table>
            {hasFiredRequestForNewPage ? (<Spinner animation="border" />) :''}
        </ListingTableContainer>
    )
}

export default ListingTable;