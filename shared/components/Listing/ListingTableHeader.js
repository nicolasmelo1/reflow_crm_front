import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { strings } from '../../utils/constants'
import { 
    ListingTableHeaderContainer, 
    ListingTableHeaderElement, 
    ListingTableHeaderElementDragger, 
    ListingTableHeaderElementParagraph,
    ListingTableHeaderElementIconContainer,
    ListingTableHeaderElementIconSpinner
} from '../../styles/Listing'

/**
 * Renders the header of the table and most of the table header logic.
 * 
 * @param {Function} onSort - the function to sort the data, this function changes the `params`object
 * this function also updates the `data` array, since it makes a call to the backend to retrieve the sorted data. 
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can know the sorted field.
 * @param {Object} headers - object containing primarly all of the fields in the header.
 */
const ListingTableHead = (props) => {
    const [resizeData, setResizeData] = useState({
        pageX: null, 
        currentColumn: null,
        currentColumnWidth: null
    })
    const sortValues = ['upper', 'down', 'none']

    const sort = {}
    for (let i=0; i<props.params.sort_value.length; i++) {
        sort[props.params.sort_field[i]] = props.params.sort_value[i]
    }

    const onMouseDown = (e) => {
        resizeData.currentColumn = e.target.closest('th')
        resizeData.pageX = e.pageX
        resizeData.currentColumnWidth = resizeData.currentColumn.scrollWidth
        setResizeData({...resizeData})
    }

    const onMouseMove = (e) => {
        if (resizeData.currentColumn) {
            const differenceX = e.pageX - resizeData.pageX;
            resizeData.currentColumn.style.minWidth = (resizeData.currentColumnWidth + differenceX)+'px';
            resizeData.currentColumn.style.width = (resizeData.currentColumnWidth + differenceX)+'px';
            props.defineScrollWidth()
        }
    } 

    const onMouseUp = () => {
        setResizeData({
            pageX: null, 
            currentColumn: null,
            currentColumnWidth: null
        })
    }

    const onSortTable = (fieldName, value) => {
        if (!value) {
            props.onSort(fieldName, sortValues[0])        
        } else {
            const currentValueIndex = sortValues.findIndex(sortValue=> sortValue === value)
            if (currentValueIndex+1 === sortValues.length) {
                props.onSort(fieldName, sortValues[0])
            } else {
                props.onSort(fieldName, sortValues[currentValueIndex+1])
            }
        }
    }

    useEffect (() => {
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
        return () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }
    })
    
    return (
        <thead>
            <tr>
                {props.field_headers.map(function (header_field, index) {
                    if (header_field.is_selected) {
                        return (
                            <ListingTableHeaderContainer key={index}>
                                <ListingTableHeaderElement>
                                    <div>
                                        <ListingTableHeaderElementParagraph>
                                            {header_field.field.label_name}
                                        </ListingTableHeaderElementParagraph>
                                    </div>
                                    <ListingTableHeaderElementIconContainer onClick={e=> {props.isLoadingData ? null : onSortTable(header_field.field.name, sort[header_field.field.name])}}>
                                        {props.isLoadingData ? (
                                            <ListingTableHeaderElementIconSpinner animation="border" size="sm"/>
                                        ) : (
                                            <img 
                                            style={{width: '20px', height: sort[header_field.field.name] && sort[header_field.field.name] !== 'none' ? '20px': '2px', margin: 'auto', display: 'block', filter:'invert(59%) sepia(26%) saturate(1229%) hue-rotate(107deg) brightness(94%) contrast(100%)'}} 
                                            src={sort[header_field.field.name] && sort[header_field.field.name] !== 'none' ? `/${sort[header_field.field.name]}.png` : '/line.png'}/>
                                        )}
                                    </ListingTableHeaderElementIconContainer>
                                    <ListingTableHeaderElementDragger onMouseDown={e=> {onMouseDown(e)}}/>
                                </ListingTableHeaderElement>
                            </ListingTableHeaderContainer>
                        )
                    }
                })}
                <ListingTableHeaderContainer>
                    <ListingTableHeaderElement isTableButton={true}>
                        <ListingTableHeaderElementParagraph>
                            {strings['pt-br']['listingHeaderEditLabel']}
                        </ListingTableHeaderElementParagraph>
                        <ListingTableHeaderElementIconContainer isTableButton={true}/>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>
                <ListingTableHeaderContainer>
                    <ListingTableHeaderElement isTableButton={true}>
                        <ListingTableHeaderElementParagraph>
                            {strings['pt-br']['listingHeaderDeleteLabel']}
                        </ListingTableHeaderElementParagraph>
                        <ListingTableHeaderElementIconContainer isTableButton={true}/>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>
            </tr>
        </thead>
    )
}

export default ListingTableHead;