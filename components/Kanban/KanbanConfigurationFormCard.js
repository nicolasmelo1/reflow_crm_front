import React from 'react'
import { 
    KanbanConfigurationFormCardsContainer, 
    KanbanConfigurationFormCardContainer, 
    KanbanCardContents, 
    KanbanConfigurationFormCardButton,
    KanbanConfigurationFormCardRemoveIcon,
    KanbanConfigurationFormCardEditIcon
} from 'styles/Kanban'
import { useRouter } from 'next/router'
/**
 * This simple component holds all of the cards on the kanban configuration formulary.
 * The isSelected props are just for changing the card colors if the card was selected by the user.
 * 
 * @param {Integer} defaultKanbanCardId - The id of the selected kanban card. This selected kanban card have the background color
 * if they are selected
 * @param {Array<Object>} cards - All of the kanban cards with its fields that the user has created for this specific formulary, this 
 * is from the redux store.
 * @param {Function} onSelectDefaultCard - This is a function from the parent component used for changing the `defaultKanbanCardId` state 
 * when the user selects a card.
 * @param {Function}  onOpenCardForm - this is a function from the parent component used to open the Card formulary when the user
 * clicks to edit the kanban card. 
 */
const KanbanConfigurationFormCard = (props) => {
    const router = useRouter()

    return (
        <KanbanConfigurationFormCardsContainer>
            {props.cards.map((card, index) => (
                <KanbanConfigurationFormCardContainer key={index} isSelected={parseInt(card.id) === props.defaultKanbanCardId}>
                    <div onClick={e=> {props.onSelectDefaultCard(card.id)}}>
                    {card.kanban_card_fields.map((field, fieldIndex) => (
                        <KanbanCardContents key={fieldIndex} isTitle={fieldIndex===0}>
                            {field.label}
                        </KanbanCardContents>
                    ))}
                    </div>
                    <div>
                        <KanbanConfigurationFormCardButton onClick={e=> {props.onOpenCardForm(card)}}>
                            <KanbanConfigurationFormCardEditIcon isSelected={parseInt(card.id) === props.defaultKanbanCardId} icon="pencil-alt"/>
                        </KanbanConfigurationFormCardButton>
                        <KanbanConfigurationFormCardButton>
                            <KanbanConfigurationFormCardRemoveIcon icon="trash" onClick={e=> {props.onRemoveCard(router.query.form, index)}}/>
                        </KanbanConfigurationFormCardButton>
                    </div>
                </KanbanConfigurationFormCardContainer>
            ))}
        </KanbanConfigurationFormCardsContainer>
    )
}

export default KanbanConfigurationFormCard