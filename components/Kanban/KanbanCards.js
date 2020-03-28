import React from 'react'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon
} from 'styles/Kanban'

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
                <KanbanCardContainer key={index}>
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