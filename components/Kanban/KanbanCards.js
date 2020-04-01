import React, { useState, useEffect } from 'react'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon,
    KanbanLoadMoreDataButton
} from 'styles/Kanban'
import { Spinner } from 'react-bootstrap'


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
    const [isOverflown, setIsOverflown] = useState(false)
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)

    // Check Components/Utils/Select for reference and explanation
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data;
        _setHasFiredRequestForNewPage(data);
    }
    const kanbanCardContainerRef = React.useRef()


    const onMoveCard = (e, cardIndex) => {
        e.dataTransfer.clearData(['movedDimensionIndex', 'movedCardIndexInDimension', 'movedCardDimension'])

        const cardContainer = e.currentTarget.parentNode
        const cardRect = cardContainer.getBoundingClientRect()
        e.dataTransfer.setDragImage(cardContainer, cardRect.width - 5, 20)
        e.dataTransfer.setData('movedCardIndexInDimension', cardIndex)
        e.dataTransfer.setData('movedCardDimension', props.dimension)
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
        props.params.page = props.pagination.current + 1
        setHasFiredRequestForNewPage(true)
        props.onGetKanbanData(props.params, props.formName, props.dimension).then(_=> {
            setHasFiredRequestForNewPage(false)
        })
    }

    const onScroll = (e) => {
        if (!hasFiredRequestForNewPageRef.current && props.pagination.current < props.pagination.total && kanbanCardContainerRef.current.scrollTop >= (kanbanCardContainerRef.current.scrollHeight - kanbanCardContainerRef.current.offsetHeight)) {
            getMoreData()
        }
    }

    const onClickToGetMoreData = () => {
        getMoreData()
    }

    useEffect(() => {
        kanbanCardContainerRef.current.addEventListener('scroll', onScroll)
        return () => {
            kanbanCardContainerRef.current.removeEventListener('scroll', onScroll)
        }
    })

    useEffect(() => {
        // if the page is to big for the pagination and the scroll is not active we add a 'load more' button in the bottom of the kanban dimension column
        if (props.pagination.current < props.pagination.total) {
            if (kanbanCardContainerRef.current.scrollHeight > kanbanCardContainerRef.current.clientHeight) {
                setIsOverflown(true)
            } else {
                setIsOverflown(false)
            }
        }
    }, [props.data])

    return (
        <KanbanCardsContainer ref={kanbanCardContainerRef}>
            {props.data.map((card, index) => (
                <KanbanCardContainer key={index} onClick={e=> {props.setFormularyId(card.id)}}>
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
                </KanbanCardContainer>
            ))}
            {props.pagination.current < props.pagination.total && !isOverflown ? (
                <KanbanLoadMoreDataButton onClick={e=> {onClickToGetMoreData()}}>Carregar mais</KanbanLoadMoreDataButton>
            ): ''}
            <div style={{margin: 'auto', textAlign:'center', width: '100%'}}>
                {hasFiredRequestForNewPage ? (<Spinner animation="border" />) : ''}
            </div>
        </KanbanCardsContainer>
    )
}

export default KanbanCards