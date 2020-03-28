import React from 'react'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents,
    KanbanCardMoveIcon
} from 'styles/Kanban'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const KanbanCards = (props) => {
    const onMoveCard = (e) => {
        let cardContainer = e.currentTarget.parentNode
        let cardRect = cardContainer.getBoundingClientRect()
        let elementRect = e.currentTarget.getBoundingClientRect()

        e.dataTransfer.setDragImage(cardContainer, cardRect.width - 5, 20)
       //e.dataTransfer.setData('movedDimensionIndex', index)
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('teste2')
        props.cleanDimensionColors(e, false)
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.cleanDimensionColors(e)
    }

    const onDrop = (e, targetDimensionIndex) => {
        e.preventDefault()
        e.stopPropagation()
        
        props.cleanDimensionColors(e, false)
        /*let movedDimensionIndex = parseInt(e.dataTransfer.getData('movedDimensionIndex'))
        const aux = props.dimensionOrders[movedDimensionIndex]
        props.dimensionOrders[movedDimensionIndex] =  props.dimensionOrders[targetDimensionIndex];
        props.dimensionOrders[targetDimensionIndex] = aux;

        props.onChangeDimensionOrdersState([...props.dimensionOrders], props.formName, props.defaultDimensionId)*/
    }
    return (
        <KanbanCardsContainer onDrop={e => {onDrop(e)}}>
            {props.data.map((card, index) => (
                <KanbanCardContainer key={index}>
                    <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveCard(e)}} onDragEnd={e=>{onDragEnd(e)}} >
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