import React, { useState, useEffect } from 'react'
import { 
    ListingTableHeaderContainer, 
    ListingTableHeaderElement, 
    ListingTableHeaderElementDragger, 
    ListingTableHeaderElementParagraph 
} from 'styles/Listing'


const ListingTableHead = (props) => {
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const [resizeData, setResizeData] = useState({
        pageX: null, 
        currentColumn: null,
        currentColumnWidth: null
    })

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
        }
    } 

    const onMouseUp = () => {
        setResizeData({
            pageX: null, 
            currentColumn: null,
            currentColumnWidth: null
        })
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
                {headers.map(function (data, index) {
                    if (data.user_selected) {
                        return (
                            <ListingTableHeaderContainer key={index}>
                                <ListingTableHeaderElement>
                                    <ListingTableHeaderElementParagraph>
                                        {data.label_name}
                                    </ListingTableHeaderElementParagraph>
                                    <ListingTableHeaderElementDragger onMouseDown={e=> {onMouseDown(e)}}/>
                                </ListingTableHeaderElement>
                            </ListingTableHeaderContainer>
                        )
                    }
                })}
                <ListingTableHeaderContainer>
                    <ListingTableHeaderElement>
                        <ListingTableHeaderElementParagraph>
                            {"Editar"}
                        </ListingTableHeaderElementParagraph>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>
                <ListingTableHeaderContainer>
                    <ListingTableHeaderElement>
                        <ListingTableHeaderElementParagraph>
                            {"Deletar"}
                        </ListingTableHeaderElementParagraph>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>

            </tr>

        </thead>
    )
}

export default ListingTableHead;