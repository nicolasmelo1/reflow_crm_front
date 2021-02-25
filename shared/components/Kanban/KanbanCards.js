import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon,
    KanbanLoadMoreDataButton
} from '../../styles/Kanban'
import { strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'


const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component controls all of the cards in a SINGLE dimension
 * 
 * @param {Function} setFormularyId - the function to define the id of the form to render in the formulary component.
 * This is used when the user clicks the card
 * @param {String} dimension - The string of the dimension column name. This is used to filter the data of this dimension.
 * @param {Function} cleanDimensionColors - the function from the parent component to change the background-color
 * of the dimension when the user moves the dimension and the kanban card.
 * @param {Array<Object>} cardFields - the fields of the kanban card, we need this to get the order of the data, what is the 
 * title, and the data of the kanban cards.
 * @param {Array<Object>} data - this is a array with all of the data, this data is used to populate the kanban 
 * cards. This is filtered from the parent component to filter only the data of this dimension.
 */
const KanbanCards = (props) => {
    const sourceRef = React.useRef(props.cancelToken.source())
    const [isOverflown, setIsOverflown] = useState(false)
    const [hasFiredRequestForNewPage, setHasFiredRequestForNewPage] = useState(false)
    const kanbanCardContainerRef = React.useRef()
    
    /**
     * This function is used when the card starts moving on the drag action.
     * What we do is set the drag image exactly where the cursor is at, and for that we use getBoundingClientRect function
     * from the browser. We also need to store the index of the card that is being moved and from which phase it is moving from.
     * 
     * @param {import('react').SyntheticEvent} e - The Event object recieved from react when onDragStart is fired. 
     * @param {BigInteger} cardIndex - The index of the card in the phase. Each phase holds a list of cards, each card have an index in this list.
     * This is used so we can later retrieve the actual card in the array. And with this we can, from the front-end remove the card from it's position
     * and add in the other dimension.
     */
    const onMoveCard = (e, cardIndex) => {
        e.dataTransfer.clearData(['movedDimensionIndex', 'movedCardIndexInDimension', 'movedCardDimension'])

        const cardContainer = e.currentTarget.closest('.kanban-card')
        const cardRect = cardContainer.getBoundingClientRect()
        const elementRect = e.currentTarget.getBoundingClientRect()

        e.dataTransfer.setDragImage(cardContainer, cardRect.width - (cardRect.width - elementRect.width), 20)
        e.dataTransfer.setData('movedCardIndexInDimension', cardIndex.toString())
        e.dataTransfer.setData('movedCardDimension', props.dimension.toString())
    }
    /**
     * This is a function that is fired when the drag ends. In other words, when stop the dragging operation. (This is NOT FIRED
     * WHEN WE DROP, we have a handler for the drop in KanbanDimension component)
     * 
     * Read here for reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/dragend_event
     * 
     * When we finish dragging the only thing we need to do is set clean all dimensionColors, so each phase will have a transparent background.
     * While we are dragging over we set the background color of the phase we are dragging over, so the user can have a visual feedback on which
     * dimension phase he is dropping the card on.
     * 
     * @param {HTMLElement} dimensionPhaseElementFromTheDOM - The HTMLElement of the dom that is the dimension phase container 
     * that holds all of the cards with the actual data for a particular phase. With this we can set the backgroundColor of this
     * element when the user is dragging over the element.
     */
    const onDragEnd = (dimensionPhaseElementFromTheDOM) => {
        props.cleanDimensionColors(dimensionPhaseElementFromTheDOM, false)
    }

    /**
     * This is a separate functions because we handle also when the kanban is TOO BIG that the number of cards is less than the
     * height of the kanban dimension phase container.
     * 
     * When the kanban is TOO BIG what happens is that the scroll is not shown to the user, if we did nothing the user would not be able
     * to paginate. So if this happens what we do is show to the user is a button that he can clicks to add more data and don't need to rely 
     * much on the kanban.
     * 
     * When we request for new data, look that we set the hasFiredRequestForNewPage state. This is to prevent many equal requests, if the user 
     * scrolls up and bottom and up and bottom quickly we would fire two, three, four times, we use this state to prevent that. If we are requesting 
     * new data we need to freeze from getting new data.
     */
    const getMoreData = () => {
        const params = JSON.parse(JSON.stringify(props.params))

        params.page = props.pagination.current + 1
        setHasFiredRequestForNewPage(true)
        props.onGetKanbanData(sourceRef.current, params, props.formName, [props.dimension]).then(_=> {
            setHasFiredRequestForNewPage(false)
        })
    }

    /**
     * This is used if the kanban dimension phase container has so many cards that it doesn't fit the screen.
     * If that's the case, the phase has a scrollbar. So when the user scrolls to the bottom we will fetch more data for this
     * particular dimension phase. This happens ONLY if the current page is less than the total number of pages.
     * 
     * @param {HTMLElement} kanbanCardsContainer - The html element of the 
     */
    const onScrollKanban = (kanbanCardsContainer) => {
        // reference: https://stackoverflow.com/a/41565471
        const hasReachedBottomOfScroll = kanbanCardsContainer.scrollTop >= (kanbanCardsContainer.scrollHeight - kanbanCardsContainer.offsetHeight)
        const hasNotReachedLastPage = props.pagination.current < props.pagination.total 
        if (!hasFiredRequestForNewPage && hasNotReachedLastPage && hasReachedBottomOfScroll) {
            getMoreData()
        }
    }

    /**
     * As said before, if the kanban is too big, and you are working in a really large screen the scroll will not show, with this button
     * if that's the case we show a button to the user so he can fetch for more data.
     */
    const onClickToGetMoreData = () => {
        getMoreData()
    }

    /**
     * Sets the sourceRef when the component is mounted so we can cancel requests if we unmount the component.
     */
    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        return () => {    
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
    
    useEffect(() => {
        // if the page is to big for the pagination and the scroll is not active we add a 'load more' button in the bottom of the kanban dimension phase column
        if (props.pagination && props.pagination.current < props.pagination.total) {
            if (kanbanCardContainerRef.current.scrollHeight > kanbanCardContainerRef.current.clientHeight) {
                setIsOverflown(true)
            } else {
                setIsOverflown(false)
            }
        }
    }, [props.data?.data])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <KanbanCardsContainer ref={kanbanCardContainerRef} onScroll={(e) => {onScrollKanban(e.target)}}>
                {props.data ? (
                    <React.Fragment>
                        {props.data.data.map((card, index) => (
                            <KanbanCardContainer className='kanban-card' key={index} onClick={e=> {
                                e.preventDefault()
                                props.setFormularyId(card.id)
                            }}>
                                <div>
                                    {props.cardIdsInLoadingState.includes(card.id) ? (
                                        <div>
                                            <Spinner animation="border" />
                                        </div>
                                    ) : (
                                        <div>
                                            <div draggable="true" 
                                            onDrag={e=>{
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }} 
                                            onDragStart={e => {
                                                e.stopPropagation()
                                                onMoveCard(e, index)
                                            }} 
                                            onDragEnd={e=>{
                                                e.preventDefault()
                                                e.stopPropagation()
                                                onDragEnd(e)
                                            }}
                                            >
                                                <KanbanCardMoveIcon icon="arrows-alt"/>
                                            </div>
                                            {props.defaultKanbanCard.kanbanCardFields.map((cardField, cardFieldIndex) => (
                                                <div key={cardFieldIndex}>
                                                    {card.dynamic_form_value.filter(value=> value.field_id === cardField.field.id).map((field, fieldIndex) => (
                                                        <KanbanCardContents key={fieldIndex} isTitle={cardFieldIndex===0}>
                                                            {field.value}
                                                        </KanbanCardContents>
                                                    ))} 
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                            </KanbanCardContainer>
                        ))}
                    </React.Fragment>
                ) : (
                    <div>
                        {props.dimension !== '' ? (
                            <React.Fragment>
                                <small>
                                    {strings['pt-br']['kanbanWaitingForDataInKanbanDimensionPhase']}
                                </small>
                                <Spinner animation="border" size="sm"/>
                            </React.Fragment>
                        ) : ''}
                    </div>
                )}
                {props.pagination && props.pagination.current < props.pagination.total && !isOverflown ? (
                    <KanbanLoadMoreDataButton onClick={e=> {onClickToGetMoreData()}}>{strings['pt-br']['kanbanLoadMoreButtonLabel']}</KanbanLoadMoreDataButton>
                ): ''}
                <div style={{margin: 'auto', textAlign:'center', width: '100%'}}>
                    {hasFiredRequestForNewPage ? (<Spinner animation="border" />) : ''}
                </div>
            </KanbanCardsContainer>
        )
    }

    return process.env['APP'] === 'web' ?  renderWeb() : renderMobile()
    
}

export default KanbanCards