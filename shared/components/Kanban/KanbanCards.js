import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon,
    KanbanLoadMoreDataButton
} from '../../styles/Kanban'
import { strings } from '../../utils/constants'


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
    const dataSource = React.useRef(props.cancelToken.source())
    const [isOverflown, setIsOverflown] = useState(false)
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)
    const paramsRef = React.useRef(props.params)
    // Check Components/Utils/Select for reference and explanation
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data
        _setHasFiredRequestForNewPage(data)
    }
    
    const kanbanCardContainerRef = React.useRef()


    const onMoveCard = (e, cardIndex) => {
        e.stopPropagation()

        e.dataTransfer.clearData(['movedDimensionIndex', 'movedCardIndexInDimension', 'movedCardDimension'])

        const cardContainer = e.currentTarget.closest('.kanban-card')
        const cardRect = cardContainer.getBoundingClientRect()
        e.dataTransfer.setDragImage(cardContainer, cardRect.width - 5, 20)
        e.dataTransfer.setData('movedCardIndexInDimension', cardIndex.toString())
        e.dataTransfer.setData('movedCardDimension', props.dimension.toString())
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.cleanDimensionColors(e, false)
    }

    const getMoreData = () => {
        const params = JSON.parse(JSON.stringify(paramsRef.current))

        params.page = props.pagination.current + 1
        setHasFiredRequestForNewPage(true)
        props.onGetKanbanData(dataSource.current, params, props.formName, props.dimension).then(_=> {
            setHasFiredRequestForNewPage(false)
        })
    }

    const onScrollKanban = (kanbanCardsContainer) => {
        if (!hasFiredRequestForNewPageRef.current && props.pagination.current < props.pagination.total && kanbanCardsContainer.scrollTop >= (kanbanCardsContainer.scrollHeight - kanbanCardsContainer.offsetHeight)) {
            getMoreData()
        }
    }

    const onClickToGetMoreData = () => {
        getMoreData()
    }

    useEffect(() => {
        paramsRef.current = props.params
    }, [props.params, props.pagination])

    useEffect(() => {
        //kanbanCardContainer.addEventListener('scroll', onScrollKanban)
        dataSource.current = props.cancelToken.source()
        return function () {    
            if(dataSource.current) {
                dataSource.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        // if the page is to big for the pagination and the scroll is not active we add a 'load more' button in the bottom of the kanban dimension column
        if (props.pagination && props.pagination.current < props.pagination.total) {
            if (kanbanCardContainerRef.current.scrollHeight > kanbanCardContainerRef.current.clientHeight) {
                setIsOverflown(true)
            } else {
                setIsOverflown(false)
            }
        }
    }, [props.data])

    const data = (props.data) ? props.data : []
    return (
        <KanbanCardsContainer ref={kanbanCardContainerRef} onScroll={(e) => {onScrollKanban(e.target)}}>
            {data.map((card, index) => (
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
                                <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveCard(e, index)}} onDragEnd={e=>{onDragEnd(e)}} >
                                    <KanbanCardMoveIcon icon="arrows-alt"/>
                                </div>
                                {props.cardFields.map((cardField, cardFieldIndex) => (
                                    <div key={cardFieldIndex}>
                                        {card.dynamic_form_value.filter(value=> value.field_id === cardField.id).map((field, fieldIndex) => (
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
            {props.pagination && props.pagination.current < props.pagination.total && !isOverflown ? (
                <KanbanLoadMoreDataButton onClick={e=> {onClickToGetMoreData()}}>{strings['pt-br']['kanbanLoadMoreButtonLabel']}</KanbanLoadMoreDataButton>
            ): ''}
            <div style={{margin: 'auto', textAlign:'center', width: '100%'}}>
                {hasFiredRequestForNewPage ? (<Spinner animation="border" />) : ''}
            </div>
        </KanbanCardsContainer>
    )
}

export default KanbanCards