import React from 'react'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon
} from 'styles/Kanban'


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

    return (
        <KanbanCardsContainer>
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
        </KanbanCardsContainer>
    )
}

export default KanbanCards