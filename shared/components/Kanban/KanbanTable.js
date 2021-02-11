import React, { useState, useEffect } from 'react'
import KanbanDimension from './KanbanDimension'
import delay from '../../utils/delay'

const makeDelay = delay(500)
let savedScrollPosition = {
    formName: '',
    scrollPosition: 0
}

/**
 * This is a component that is used to control the dimensions.
 * 
 * @param {String} formName - the form name of the current formulary
 * @param {Array<Object>} dimensionOrders - The dimension orders loaded on the redux state, this dimension order
 * holds only the order of each dimension.
 * @param {Interger} defaultDimensionId - The id of the selected dimension.
 * @param {Object} card - the selected card, we use this to get the card fields, this way we can set the titles
 * and the fields data in the card.
 * @param {Array<Object>} data - this is a array with all of the data, this data is used to populate the kanban 
 * cards.
 * @param {Function} onChangeKanbanData - this function is an action used to change the card status,
 * between dimension columns.
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Function} onChangeDimensionOrdersState - this function is an redux action used to change the dimension
 * order in the redux store.
 */
const KanbanTable = (props) => {
    const screenWidth = process.env['APP'] === 'web' ? document.body.offsetWidth : 280
    const dimensionsWidth = process.env['APP'] === 'web' ? 280 : 280
    const oldDimensionOrdersRef = React.useRef()
    const hasLoadedData = React.useRef()
    const oldFormNameRef = React.useRef()
    const kanbanHolderRef = React.useRef()
    const kanbanTable = React.useRef()
    const isMountedRef = React.useRef(false)
    const dataSource = React.useRef(props.cancelToken.source())
    const cardFields = (props.card) ? props.card.kanban_card_fields: []
    const [hasFiredDimensionOrders, _setHasFiredDimensionOrders] = useState(false)

    // we just fire to get the dimension orders once
    const hasFiredDimensionOrdersRef = React.useRef(hasFiredDimensionOrders)
    const setHasFiredDimensionOrders = (data) => {
        hasFiredDimensionOrdersRef.current = data
        _setHasFiredDimensionOrders(data)
    }

    const onDragOverTable = (e) => {
        e.preventDefault()
        const totalWidth = kanbanHolderRef.current.offsetWidth / 4
        const widthToMoveLeft = totalWidth * 2;
        const widthToMoveRight = kanbanHolderRef.current.offsetWidth - totalWidth;
        
        if (e.clientX < widthToMoveLeft) {
            kanbanHolderRef.current.scrollLeft -= 5;
        } 
        if (e.clientX > widthToMoveRight) {
            kanbanHolderRef.current.scrollLeft += 5;
        }
    }
    
    
    /**
     * Responsible for paginating the columns to show. First thing to understand is that we change the pagination as
     * the user scrolls horizontally, and since we don't want to retrieve the data everytime he scrolls we make a delay
     * of 1 second, so when the user stops scrolling for at least 1 second we will retrieve the data for the columns he is currently seeing.
     * 
     * This is really good for performance since we will ONLY retrieve those columns that the user is already seeing.
     * Other columns will not be loaded so we don't force much the backend
     * 
     * @param {BigInteger} scrollWidthPosition - An integer representing where the scroll is in the view.
     * @param {BigInteger} scrollContainerWidth - An integer that represents the TOTAL width of the scroll container. (Not the scroll container,
     * but the width of the scroll inside of the view, and not it's scroll width)
     */
    const onScrollHorizontalKanban = (scrollWidthPosition, scrollContainerWidth, isInitial=false) => {
        makeDelay(() => {
            savedScrollPosition = {
                formName: props.formName,
                scrollPosition: scrollWidthPosition
            }

            if (isMountedRef.current && hasLoadedData.current) {
                let endDimensionIndexToRetrieveDataFor = null
                let startDimensionIndexToRetrieveDataFor = null
                let stackedMaximumNumberOfDimensionsToShowWidth = dimensionsWidth
                // We loop through each dimensionOrder to get the startIndex and the endIndex of the columns we want to retrieve
                for (let i=0; i<props.dimensionOrders.length; i++) {
                    if (stackedMaximumNumberOfDimensionsToShowWidth >= scrollContainerWidth + scrollWidthPosition) {
                        endDimensionIndexToRetrieveDataFor = i
                        break
                    } else if (stackedMaximumNumberOfDimensionsToShowWidth >= scrollWidthPosition && startDimensionIndexToRetrieveDataFor === null) {
                        startDimensionIndexToRetrieveDataFor = i
                    } 
                    stackedMaximumNumberOfDimensionsToShowWidth += dimensionsWidth
                }

                const dimensionsToGetDataFor = props.dimensionOrders.slice(startDimensionIndexToRetrieveDataFor, endDimensionIndexToRetrieveDataFor + 1)
                props.onChangeDimensionsToShow(dataSource.current, props.formName, dimensionsToGetDataFor, isInitial)
            }
        })
    }

    /**
     * When the user resizes the screen we need to load more data on the shown columns. It's like the user had scrolled
     * 
     * @param {SyntheticEvent} e - The event object emited by 'resize' window event
     */
    const onResizeWeb = (e) => {
        if (kanbanHolderRef.current) {
            onScrollHorizontalKanban(kanbanHolderRef.current.scrollLeft, kanbanHolderRef.current.offsetWidth)
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        dataSource.current = props.cancelToken.source()
        if (kanbanHolderRef.current && savedScrollPosition.formName === props.formName) {
            kanbanHolderRef.current.scrollTo(savedScrollPosition.scrollPosition, 0);
        }
        if (props.dimensionOrders.length > 0 && kanbanHolderRef.current) {
            const scrollPosition = (savedScrollPosition.formName === props.formName) ? savedScrollPosition.scrollPosition : kanbanHolderRef.current.scrollLeft
            onScrollHorizontalKanban(scrollPosition, kanbanHolderRef.current.offsetWidth, true)
        }
        if (process.env['APP'] === 'web') { 
            window.addEventListener('resize', onResizeWeb)
        }
        return () => {
            if(dataSource.current) {
                dataSource.current.cancel()
            }
            isMountedRef.current = false
            if (process.env['APP'] === 'web') { 
                window.removeEventListener('resize', onResizeWeb)
            }
        }
    }, [])

    useEffect(() => {
        if (!hasFiredDimensionOrdersRef.current && props.defaultKanbanCardId && props.defaultDimensionId && isMountedRef.current) {
            setHasFiredDimensionOrders(true)
            props.onGetDimensionOrders(dataSource.current, props.formName, props.defaultDimensionId).then(dimensionOrders => {
                if (kanbanHolderRef.current) {
                    const scrollPosition = (savedScrollPosition.formName === props.formName) ? savedScrollPosition.scrollPosition : kanbanHolderRef.current.scrollLeft
                    onScrollHorizontalKanban(scrollPosition, kanbanHolderRef.current.offsetWidth, true)
                }
                if (isMountedRef.current) {
                    setHasFiredDimensionOrders(false)
                }
            })
        }
    }, [props.defaultDimensionId, props.defaultKanbanCardId])


    useEffect(() => {
        // this is to make less requests to the backend, we use the sort for when we change the kanban dimension orders, and the oldProps and newProps
        // is to prevent rerender of rehydratation
        const oldDimensionOrders = oldDimensionOrdersRef.current ? oldDimensionOrdersRef.current.map(dimensionOrder => dimensionOrder.options) : []
        const newDimensionOrders = props.dimensionOrders ? props.dimensionOrders.map(dimensionOrder => dimensionOrder.options) : []
        newDimensionOrders.sort()
        oldDimensionOrders.sort()
        if (props.defaultKanbanCardId && props.defaultDimensionId && props.defaultFormName === props.formName && JSON.stringify(oldDimensionOrders) !== JSON.stringify(newDimensionOrders)) {
            props.onGetKanbanData(dataSource.current, props.params, props.formName).then(response => {
                hasLoadedData.current = true
                if (kanbanHolderRef.current) {
                    onScrollHorizontalKanban(kanbanHolderRef.current.scrollLeft, kanbanHolderRef.current.offsetWidth)
                }
            })
        }
    }, [props.dimensionOrders])


    useEffect(() => {
        oldDimensionOrdersRef.current = props.dimensionOrders
        oldFormNameRef.current = props.formName
    })

    return (
        <div 
        ref={kanbanHolderRef} 
        onDragOver={e=> {onDragOverTable(e)}}
        onScroll={(e) => onScrollHorizontalKanban(e.target.scrollLeft, e.target.offsetWidth)}
        style={{overflowX: 'auto', transform: 'rotateX(180deg)'}}
        >
            {props.defaultKanbanCardId && props.defaultDimensionId ? (
                <table ref={kanbanTable} style={{ transform: 'rotateX(180deg)'}}>
                    <tbody>
                        <KanbanDimension
                        formName={props.formName}
                        cancelToken={props.cancelToken}
                        dimensionsWidth={dimensionsWidth} 
                        defaultDimensionId={props.defaultDimensionId}
                        onChangeDimensionOrdersState={props.onChangeDimensionOrdersState}
                        onChangeKanbanData={props.onChangeKanbanData}
                        params={props.params}
                        onGetKanbanData={props.onGetKanbanData}
                        setFormularyId={props.setFormularyId}
                        setFormularyDefaultData={props.setFormularyDefaultData}
                        dimensionOrders={props.dimensionOrders}
                        cardFields={cardFields}
                        data={props.data}
                        />
                    </tbody>
                </table>
            ) : ''}
        </div>
    )
}

export default KanbanTable