import React from 'react'
import { 
    KanbanConfigurationFormCardsContainer, 
    KanbanConfigurationFormCardContainer, 
    KanbanCardContents, 
    KanbanConfigurationFormCardButton,
    KanbanConfigurationFormCardRemoveIcon,
    KanbanConfigurationFormCardEditIcon
} from 'styles/Kanban'

const KanbanConfigurationFormCard = (props) => {
    return (
        <KanbanConfigurationFormCardsContainer>
            {props.cards.map((card, index) => (
                <KanbanConfigurationFormCardContainer key={index} isSelected={parseInt(card.id) === props.defaultKanbanCardId} onClick={e=> {props.onSelectDefaultCard(card.id)}}>
                    {card.kanban_card_fields.map((field, fieldIndex) => (
                        <KanbanCardContents key={fieldIndex} isTitle={fieldIndex===0}>
                            {field.label}
                        </KanbanCardContents>
                    ))}
                    <div>
                        <KanbanConfigurationFormCardButton onClick={e=> {props.onOpenCardForm(card)}}>
                            <KanbanConfigurationFormCardEditIcon isSelected={parseInt(card.id) === props.defaultKanbanCardId} icon="pencil-alt"/>
                        </KanbanConfigurationFormCardButton>
                        <KanbanConfigurationFormCardButton>
                            <KanbanConfigurationFormCardRemoveIcon icon="trash"/>
                        </KanbanConfigurationFormCardButton>
                    </div>
                </KanbanConfigurationFormCardContainer>
            ))}
        </KanbanConfigurationFormCardsContainer>
    )
}

export default KanbanConfigurationFormCard