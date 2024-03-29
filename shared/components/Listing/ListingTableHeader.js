import React, { useState, useEffect } from 'react'
import dynamicImport from '../../utils/dynamicImport'
import { strings, types } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Styled from './styles'

const OverlayTrigger = dynamicImport('react-bootstrap', 'OverlayTrigger')
const Popover = dynamicImport('react-bootstrap', 'Popover')

const PopoverWithConditionalSectionInformation = React.forwardRef(({conditionals, ...rest}, ref) => {
    return (
        <Popover ref={ref} {...rest}>
            <Popover.Body style={{whiteSpace: 'pre-line'}}>
                <Styled.ListingTableHeaderConditionalPopoverTextTitle>
                    {strings['pt-br']['listingHeaderConditionalFieldColumnPopoverTitle']}
                </Styled.ListingTableHeaderConditionalPopoverTextTitle>
                <span>
                    <small>
                        {strings['pt-br']['listingHeaderConditionalFieldColumnPopoverWhenTheField']}
                    </small>
                    <Styled.ListingTableHeaderConditionalPopoverTextVariable>
                        {`${conditionals.conditional_field_label_name} `}
                    </Styled.ListingTableHeaderConditionalPopoverTextVariable>
                    <small>
                        {strings['pt-br']['listingHeaderConditionalFieldColumnPopoverIsConditionalValue'].replace('{}', types('pt-br', 'conditional_type', conditionals.conditional_type))}
                    </small>
                    <Styled.ListingTableHeaderConditionalPopoverTextVariable>
                        {conditionals.conditional_value}
                    </Styled.ListingTableHeaderConditionalPopoverTextVariable>
                </span>
            </Popover.Body>
        </Popover>
    )
})
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
    for (let i=0; i<props.getParams(0).sort_value.length; i++) {
        sort[props.getParams(0).sort_field[i]] = props.getParams(0).sort_value[i]
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
    
    useEffect(() => {
        props.defineScrollWidth()
    }, [props.fieldHeaders])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <thead>
                <tr>
                    <Styled.ListingTableHeaderContainer>
                        <Styled.ListingTableHeaderElement 
                        isTableButton={true} 
                        isFirstColumn={true}
                        >
                            <Styled.ListingTableHeaderElementParagraph>
                                {strings['pt-br']['listingHeaderEditLabel']}
                            </Styled.ListingTableHeaderElementParagraph>
                            <Styled.ListingTableHeaderElementIconContainer 
                            isTableButton={true} 
                            isFirstColumn={props.fieldHeaders.length === 0}
                            />
                        </Styled.ListingTableHeaderElement>
                    </Styled.ListingTableHeaderContainer>
                    <Styled.ListingTableHeaderContainer>
                        <Styled.ListingTableHeaderElement 
                        isTableButton={true}
                        >
                            <Styled.ListingTableHeaderElementParagraph>
                                {strings['pt-br']['listingHeaderDeleteLabel']}
                            </Styled.ListingTableHeaderElementParagraph>
                            <Styled.ListingTableHeaderElementIconContainer 
                            isTableButton={true}
                            />
                        </Styled.ListingTableHeaderElement>
                    </Styled.ListingTableHeaderContainer>
                    {props.fieldHeaders.map((fieldHeader, index)=> {
                        if (fieldHeader.is_selected) {
                            return (
                                <Styled.ListingTableHeaderContainer 
                                key={fieldHeader.id}
                                >
                                    <Styled.ListingTableHeaderElement 
                                    isLastColumn={index === props.fieldHeaders.length - 1}
                                    >
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Styled.ListingTableHeaderElementParagraph>
                                                {fieldHeader.field.label_name}
                                                {fieldHeader.field.conditional !== null ? (
                                                    <React.Fragment>
                                                        &nbsp;
                                                        <OverlayTrigger 
                                                        trigger={['hover', 'focus']} 
                                                        placement="auto" 
                                                        rootClose={true}
                                                        delay={{ show: 250, hide: 100 }} 
                                                        overlay={<PopoverWithConditionalSectionInformation 
                                                            conditionals={fieldHeader.field.conditional}
                                                            />}
                                                        >        
                                                            <FontAwesomeIcon icon={'link'}/>
                                                        </OverlayTrigger>
                                                    </React.Fragment>
                                                ) : ''}
                                            </Styled.ListingTableHeaderElementParagraph>
                                        </div>
                                        <Styled.ListingTableHeaderElementIconContainer 
                                        onClick={e=> {props.isLoadingData ? null : onSortTable(fieldHeader.field.name, sort[fieldHeader.field.name])}}
                                        >
                                            {props.isLoadingData ? (
                                                <Styled.ListingTableHeaderElementIconSpinner 
                                                animation="border"
                                                 size="sm"/>
                                            ) : (
                                                <img 
                                                style={{
                                                    width: '20px', 
                                                    height: sort[fieldHeader.field.name] && sort[fieldHeader.field.name] !== 'none' ? '20px': '2px', 
                                                    margin: 'auto', 
                                                    display: 'block', 
                                                    filter:'invert(59%) sepia(26%) saturate(1229%) hue-rotate(107deg) brightness(94%) contrast(100%)'
                                                }} 
                                                src={sort[fieldHeader.field.name] && sort[fieldHeader.field.name] !== 'none' ? `/${sort[fieldHeader.field.name]}.png` : '/line.png'}
                                                />
                                            )}
                                        </Styled.ListingTableHeaderElementIconContainer>
                                        <Styled.ListingTableHeaderElementDragger onMouseDown={e=> {onMouseDown(e)}}/>
                                    </Styled.ListingTableHeaderElement>
                                </Styled.ListingTableHeaderContainer>
                            )
                        }
                    })}
                </tr>
            </thead>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ListingTableHead;