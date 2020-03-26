import React from 'react'
import { 
    KanbanCardsContainer,
    KanbanCardContainer, 
    KanbanCardContents
} from 'styles/Kanban'


const KanbanCards = (props) => {
    return (
        <KanbanCardsContainer>
            {props.data.map((card, index) => (
                <KanbanCardContainer key={index}>
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