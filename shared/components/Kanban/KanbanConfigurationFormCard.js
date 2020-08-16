import React, { useState } from 'react'
import { useRouter } from 'next/router'
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
 * @param {Function}  onOpenCardForm - this is a function from the parent component used to open the Card formulary when the user
 * clicks to edit the kanban card. 
 */
const KanbanConfigurationFormCard = (props) => {
    const [formularyIndexToRemove, setFormularyIndexToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)

    const router = useRouter()

    return (
        <KanbanConfigurationFormCardsContainer>
            <Alert 
            alertTitle={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertTitle']} 
            alertMessage={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertContent']} 
            show={showAlert} 
            onHide={() => {
                setFormularyIndexToRemove(null)
                setShowAlert(false)
            }} 
            onAccept={() => {
                setShowAlert(false)
                props.onRemoveCard(router.query.form, formularyIndexToRemove)
            }}
            onAcceptButtonLabel={strings['pt-br']['kanbanConfigurationFormDeleteCardAlertAcceptButton']}
            />
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
                            <KanbanConfigurationFormCardRemoveIcon icon="trash" onClick={e=> {
                                setFormularyIndexToRemove(index)
                                setShowAlert(true)         
                            }}/>
                        </KanbanConfigurationFormCardButton>
                    </div>
                </KanbanConfigurationFormCardContainer>
            ))}
        </KanbanConfigurationFormCardsContainer>
    )
}

export default KanbanConfigurationFormCard