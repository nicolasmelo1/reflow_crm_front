import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import KanbanDimension from './KanbanDimension'
import deepCopy from '../../utils/deepCopy'
import {
    KanbanContainer
} from '../../styles/Kanban'

let savedScrollPosition = {
    formName: '',
    scrollPosition: 0
}

/**
 * This is a component that is used to control the dimensions.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {Object} user - The user object of the login redux reducer
 * @param {String} formName - the form name of the current formulary
 * @param {Array<Object>} dimensionPhases - The dimension orders loaded on the redux state, this dimension order
 * holds only the order of each dimension.
 * @param {Interger} defaultDimensionId - The id of the selected dimension.
 * @param {Object} card - the selected card, we use this to get the card fields, this way we can set the titles
 * and the fields data in the card.
 * @param {Array<Object>} data - this is a array with all of the data, this data is used to populate the kanban 
 * cards.
 * @param {Function} onMoveKanbanCardBetweenDimensions - this function is an action used to change the card status,
 * between dimension columns.
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Function} onChangeDimensionPhases - this function is an redux action used to change the dimension
 * order in the redux store.
 */
const KanbanTable = (props) => {
    const dimensionsWidth = process.env['APP'] === 'web' ? 280 : 280
    const collapsedDimensionsWidth = process.env['APP'] === 'web' ? 70 : 70
    const oldDefauldKanbanCard = React.useRef(null)
    const oldDefaultDimension = React.useRef(null)
    const retrievedDataForDimensions = React.useRef([])
    const kanbanHolderRef = React.useRef()
    const isMountedRef = React.useRef(false)
    const dataSource = React.useRef(props.cancelToken.source())
    const [isAlertShown, setIsAlertShown] = useState(false)

    /**
     * When the kanban has many phases, the kanban can be bigger than the screen of the user. 
     * To enable the usability of the kanban we add an horizontal scroll so the user can scroll through each phase. 
     * 
     * When the user is dragging a card or a dimension on the kanban that doesn't fit the screen and has a scroll, when he drags
     * to the side of the scroll we need to automatically scroll for him, so it doesn't matter the size of the kanban he can reach the first and
     * last phases while dragging
     * 
     * @param {BigInteger} itemXPosition - The X position of the mouse while he is dragging.
     */
    const onDragOverAutomaticScroll = (itemXPosition) => {
        if (process.env['APP'] === 'web') {
            const totalWidth = kanbanHolderRef.current.offsetWidth / 4
            const widthToMoveLeft = totalWidth * 2;
            const widthToMoveRight = kanbanHolderRef.current.offsetWidth - totalWidth;
            
            if (itemXPosition < widthToMoveLeft) {
                kanbanHolderRef.current.scrollLeft -= 5;
            } 
            if (itemXPosition > widthToMoveRight) {
                kanbanHolderRef.current.scrollLeft += 5;
            }
            setShownDimensions(props.collapsedDimensions, props.dimensionPhases, kanbanHolderRef.current.scrollLeft, kanbanHolderRef.current.offsetWidth)
        }
    }
    
    /**
     * When the user scrolls horizontally we need to update the shown dimensions of the user
     * @param {BigInteger} scrollWidthPosition - Where the scroll is positioned in the screen
     * @param {BigInteger} scrollContainerWidth - The total width of the scroll.
     */
    const onScrollHorizontalKanban = (scrollWidthPosition, scrollContainerWidth) => {
        setShownDimensions(props.collapsedDimensions, props.dimensionPhases, scrollWidthPosition, scrollContainerWidth)
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
    const setShownDimensions = (collapsedPhases, phases, scrollWidthPosition, scrollContainerWidth) => {
        savedScrollPosition = {
            formName: props.formName,
            scrollPosition: scrollWidthPosition
        }

        const isDimensionCollapsed = (dimension) => {
            if (dimension && collapsedPhases.includes(dimension.id)) {
                return true
            }   
            return false
        }

        if (isMountedRef.current) {
            let endDimensionIndexToRetrieveDataFor = null
            let startDimensionIndexToRetrieveDataFor = null
            let stackedMaximumNumberOfDimensionsToShowWidth = isDimensionCollapsed(phases[0]) ? collapsedDimensionsWidth : dimensionsWidth

            // We loop through each dimensionOrder to get the startIndex and the endIndex of the columns we want to retrieve
            for (let i=0; i<phases.length; i++) {
                if (stackedMaximumNumberOfDimensionsToShowWidth >= scrollContainerWidth + scrollWidthPosition || i === phases.length - 1) {
                    endDimensionIndexToRetrieveDataFor = i
                    break
                } else if (stackedMaximumNumberOfDimensionsToShowWidth >= scrollWidthPosition && startDimensionIndexToRetrieveDataFor === null) {
                    startDimensionIndexToRetrieveDataFor = i
                } 
                stackedMaximumNumberOfDimensionsToShowWidth += isDimensionCollapsed(phases[i+1]) ? collapsedDimensionsWidth : dimensionsWidth
            }
            const dimensionsToGetDataFor = phases.slice(startDimensionIndexToRetrieveDataFor, endDimensionIndexToRetrieveDataFor + 1)
            const dimensionsToGetDataForFiltered = dimensionsToGetDataFor.filter(dimension => !collapsedPhases.includes(dimension.id))
            
            props.onChangeDimensionsToShow(dimensionsToGetDataForFiltered)
        }
        return null
    }

    /**
     * This is used to update the dimensions shown to the user in the screen, it's just used to update for what dimensions should we
     * retrieve data and which not. This is usually used when the user collapses a dimension.
     */
    const onUpdateDimensionsOnScreen = () => {
        if (kanbanHolderRef.current) {
            setShownDimensions(props.collapsedDimensions, props.dimensionPhases, kanbanHolderRef.current.scrollLeft, kanbanHolderRef.current.offsetWidth)
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        dataSource.current = props.cancelToken.source()
        
        if (kanbanHolderRef.current && savedScrollPosition.formName === props.formName) {
            kanbanHolderRef.current.scrollTo(savedScrollPosition.scrollPosition, 0);
        }
        
        if (process.env['APP'] === 'web') { 
            window.addEventListener('resize', onUpdateDimensionsOnScreen)
        }

        return () => {
            if(dataSource.current) {
                dataSource.current.cancel()
            }
            isMountedRef.current = false
            if (process.env['APP'] === 'web') { 
                window.removeEventListener('resize', onUpdateDimensionsOnScreen)
            }
        }
    }, [])

    /**
     * When the formName changes it's like we haven't retrieved no data. So we start fresh.
     */
    useEffect(() => {
        retrievedDataForDimensions.current = []
    }, [props.formName])

    /**
     * When the defaultDimension changes this means that we need to load all of the data of the phases of this dimension.
     */
    useEffect(() => {
        if (props.defaultKanbanCard.id !== null && props.defaultDimension.id !== null && isMountedRef.current) {
            props.onGetDimensionPhases(dataSource.current, props.formName, props.defaultDimension.id)
        }
    }, [props.defaultDimension])

    /**
     * When the dimensionPhases are loaded, we need to set what is shown in screen and what is NOT shown.
     * For that we need to guarantee that the dimensionPhases were loaded and the kanban is actually mounted on screen
     */
    useEffect(() => {
        if (props.defaultDimension.id) {
            const scrollPosition = (savedScrollPosition.formName === props.formName) ? savedScrollPosition.scrollPosition : kanbanHolderRef.current.scrollLeft
            props.onGetCollapsedDimensionPhases(dataSource.current, props.formName, props.defaultDimension.id).then(collapsedDimensionIds => {
                setShownDimensions(collapsedDimensionIds, props.dimensionPhases, scrollPosition, kanbanHolderRef.current.offsetWidth)
            })
        }
    }, [props.dimensionPhases])

    /**
     * When the dimensions shown on screen changed, the default dimension change or the default kanban card change
     * we load the data for the kanban. This only handles the FIRST LOAD OF DATA. So if you already loaded the data, this will not load the data again.
     * 
     * HEY, BUT WHAT ABOUT WHEN WE MOVE THE KANBAN CARD?
     * - This is handled entirely by the websocket connection that listens to events from the backend. Check `onGetKanbanData` redux action for better
     * understanding and explanation.
     */
    useEffect(() => {
        // Handles the first load of columns
        const didDefaultKanbanCardOrDimensionChanged = JSON.stringify(oldDefaultDimension.current) !== JSON.stringify(props.defaultDimension) || JSON.stringify(props.defaultKanbanCard) !== JSON.stringify(oldDefauldKanbanCard.current)
        const areDefaultsDefinedAndShownDimensionsSet = props.defaultKanbanCard.id !== null && props.defaultDimension.id !== null && props.dimensionsToShow.length > 0
        
        if (areDefaultsDefinedAndShownDimensionsSet && isMountedRef.current) {
            const columnNames = props.dimensionsToShow.map(phase => phase.option)
            const loadedPhases = props.data.map(dataForPhase => dataForPhase.dimension)
            const columnNamesWithoutLoadedPhases = columnNames.filter(columnName=> !loadedPhases.includes(columnName))
            
            if (columnNames.length > 0) {
                if (didDefaultKanbanCardOrDimensionChanged) {
                    props.onGetKanbanData(dataSource.current, props.params, props.formName, columnNames)                
                } else if (columnNamesWithoutLoadedPhases.length > 0) {
                    // only the shown dimensions changed
                    props.onGetKanbanData(dataSource.current, props.params, props.formName, columnNames.filter(columnName=> !loadedPhases.includes(columnName)))
                }
            }
        }
        oldDefaultDimension.current = deepCopy(props.defaultDimension)
        oldDefauldKanbanCard.current = deepCopy(props.defaultKanbanCard)
    }, [props.defaultDimension, props.defaultKanbanCard, props.dimensionsToShow])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <KanbanContainer 
            ref={kanbanHolderRef} 
            onDragOver={e=> {
                e.preventDefault()
                onDragOverAutomaticScroll(e.clientX)
            }}
            onScroll={(e) => onScrollHorizontalKanban(e.target.scrollLeft, e.target.offsetWidth)}
            isAlertShown={isAlertShown}
            >
                {props.defaultKanbanCard.id !== null && props.defaultDimension.id !== null ? (
                        <KanbanDimension
                        types={props.types}
                        user={props.user}
                        cancelToken={props.cancelToken}
                        isAlertShown={isAlertShown}
                        setIsAlertShown={setIsAlertShown}
                        formName={props.formName}
                        cancelToken={props.cancelToken}
                        dimensionsWidth={dimensionsWidth} 
                        defaultKanbanCard={props.defaultKanbanCard}
                        defaultDimension={props.defaultDimension}
                        onGetDimensionPhases={props.onGetDimensionPhases}
                        onCollapseDimension={props.onCollapseDimension}
                        collapsedDimensions={props.collapsedDimensions}
                        onChangeDimensionPhases={props.onChangeDimensionPhases}
                        onUpdateDimensionsOnScreen={onUpdateDimensionsOnScreen}
                        onMoveKanbanCardBetweenDimensions={props.onMoveKanbanCardBetweenDimensions}
                        params={props.params}
                        onGetKanbanData={props.onGetKanbanData}
                        setFormularyId={props.setFormularyId}
                        setFormularyDefaultData={props.setFormularyDefaultData}
                        dimensionPhases={props.dimensionPhases}
                        data={props.data}
                        />
                ) : ''}
            </KanbanContainer>
        )   
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default KanbanTable