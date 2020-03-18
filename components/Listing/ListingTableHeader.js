import React, { useState, useEffect } from 'react'
import { 
    ListingTableHeaderContainer, 
    ListingTableHeaderElement, 
    ListingTableHeaderElementDragger, 
    ListingTableHeaderElementParagraph,
    ListingTableHeaderElementIconContainer
} from 'styles/Listing'


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
                {props.headers.map(function (data, index) {
                    if (data.user_selected) {
                        return (
                            <ListingTableHeaderContainer key={index}>
                                <ListingTableHeaderElement>
                                    <div>
                                        <ListingTableHeaderElementParagraph>
                                            {data.label_name}
                                        </ListingTableHeaderElementParagraph>
                                    </div>
                                    <ListingTableHeaderElementIconContainer onClick={e=> {onSortTable(data.name, sort[data.name])}}>
                                        <img 
                                        style={{width: '20px', height: sort[data.name] && sort[data.name] !== 'none' ? '20px': '2px', margin: 'auto', display: 'block', filter:'invert(59%) sepia(26%) saturate(1229%) hue-rotate(107deg) brightness(94%) contrast(100%)'}} 
                                        src={sort[data.name] && sort[data.name] !== 'none' ? `/${sort[data.name]}.png` : '/line.png'}/>
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
                            {"Editar"}
                        </ListingTableHeaderElementParagraph>
                        <ListingTableHeaderElementIconContainer isTableButton={true}/>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>
                <ListingTableHeaderContainer>
                    <ListingTableHeaderElement isTableButton={true}>
                        <ListingTableHeaderElementParagraph>
                            {"Deletar"}
                        </ListingTableHeaderElementParagraph>
                        <ListingTableHeaderElementIconContainer isTableButton={true}/>
                    </ListingTableHeaderElement>
                </ListingTableHeaderContainer>

            </tr>

        </thead>
    )
}

export default ListingTableHead;