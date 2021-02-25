import React, { useState } from 'react'
import { View } from 'react-native'
import { strings } from '../../utils/constants'
import Alert from '../Utils/Alert'
import { 
    KanbanConfigurationFormCardsContainer, 
    KanbanConfigurationFormCardContainer, 
    KanbanCardContents, 
    KanbanConfigurationFormCardButton,
    KanbanConfigurationFormCardRemoveIcon,
    KanbanConfigurationFormCardEditIcon
} from '../../styles/Kanban'

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
 */
const KanbanConfigurationFormCard = (props) => {
    const [kanbanCardIdToRemove, setKanbanCardIdToRemove] = useState(null)

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <KanbanConfigurationFormCardsContainer>
                <Alert 
                alertTitle={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertTitle']} 
                alertMessage={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertContent']} 
                show={kanbanCardIdToRemove !== null} 
                onHide={() => {
                    setKanbanCardIdToRemove(null)
                }} 
                onAccept={() => {
                    props.onRemoveCard(kanbanCardIdToRemove)
                    setKanbanCardIdToRemove(null)
                }}
                onAcceptButtonLabel={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertAcceptButton']}
                />
                {props.cards.map((card, index) => (
                    <KanbanConfigurationFormCardContainer key={card.id} isSelected={parseInt(card.id) === props.defaultKanbanCardId}>
                        <div onClick={e=> {props.onSelectDefaultCard(card)}}>
                        {card.kanban_card_fields.map((field, fieldIndex) => (
                            <KanbanCardContents key={fieldIndex} isTitle={fieldIndex===0}>
                                {field.field.label_name}
                            </KanbanCardContents>
                        ))}
                        </div>
                        <div>
                            <KanbanConfigurationFormCardButton onClick={e=> {props.setCardToEdit(card)}}>
                                <KanbanConfigurationFormCardEditIcon isSelected={parseInt(card.id) === props.defaultKanbanCardId} icon="pencil-alt"/>
                            </KanbanConfigurationFormCardButton>
                            <KanbanConfigurationFormCardButton>
                                <KanbanConfigurationFormCardRemoveIcon icon="trash" onClick={e=> {
                                    setKanbanCardIdToRemove(card.id)
                                }}/>
                            </KanbanConfigurationFormCardButton>
                        </div>
                    </KanbanConfigurationFormCardContainer>
                ))}
            </KanbanConfigurationFormCardsContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default KanbanConfigurationFormCard