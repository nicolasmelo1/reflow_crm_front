import React, { useState, useEffect } from 'react'
import KanbanCardConfigurationForm from './KanbanCardConfigurationForm'
import KanbanConfigurationFormCard from './KanbanConfigurationFormCard'
import { Select } from '../Utils'
import { KanbanConfigurationFormSelectContainer, KanbanCardAddNewButton, KanbanConfigurationFormContainer, KanbanConfigurationFormTitle} from '../../styles/Kanban'
import { strings } from '../../utils/constants'

/**
 * This component controls the formulary to set the kanban dimension and cards. This formulary is for the kanban
 * visualization configuration.
 * 
 * @param {String} formName - the form name of the current formulary
 * @param {Function} onChangeDefaultState - this function is a redux action to change the default values selected. These 
 * default values are the `defaultKanbanDimensionId` and the `defaultKanbanCardId` on the redux store.
 * @param {Function} onCreateOrUpdateCard - this is a redux action function to create or update the kanban card in the 
 * backend with its fields.
 * @param {Array<Object>} fields - this is a array with all of the fields the user can select to construct the kanban card.
 * @param {Array<Object>} dimensionFields - this is kind of equal the fields array, but only fields the user can select to select
 * a dimension. We could use the fields array, but since this is kind of a Business Logic we prefered to keep it on the backend
 * @param {Array<Object>} cards - all of the kanban cards with its fields that the user has created for this specific formulary, this 
 * is from the redux store.
 */
const KanbanConfigurationForm = (props) => {
    const [dimensionSelectIsOpen, setDimensionSelectIsOpen] = useState(false)
    const [dimensionOptions, setDimensionOptions] = useState([])
    const [cardToEdit, setCardToEdit] = useState(null)

    const createNewKanbanCard = () => ({
        id: null,
        kanban_card_fields: []
    })

    const onChangeDefaultDimension = (data) => {
        const selectedDimensionId = data[0]
        const selectedField = props.fields.filter(field => field.id === selectedDimensionId)[0]
        if (selectedDimensionId !== undefined && selectedField !== undefined) {
            props.defaultDimension.id = selectedField.id
            props.defaultDimension.name = selectedField.name
        } else {
            props.defaultDimension.id = null
            props.defaultDimension.name = null
        }

        props.onChangeDefaultState(
            props.defaultKanbanCard.id, 
            props.defaultKanbanCard.kanbanCardFields, 
            props.defaultDimension.id,
            props.defaultDimension.name,
            props.formName
        )
    }
    
    const onSelectDefaultCard = (selectedCard) => {
        if (selectedCard !== undefined && selectedCard.id !== null) {
            props.onChangeDefaultState(
                selectedCard.id, 
                selectedCard.kanban_card_fields, 
                props.defaultDimension.id,
                props.defaultDimension.name,
                props.formName
            )
        }
    }

    const onRemoveCard = (cardId) => {
        const newCards = props.cards.filter(card => card.id !== cardId)
        const isRemovedCardDefault = cardId === props.defaultKanbanCard.id
        props.onRemoveCard(newCards, props.formName, cardId)
        props.onChangeDefaultState(
            isRemovedCardDefault ? null : props.defaultKanbanCard.id, 
            isRemovedCardDefault ? [] : props.defaultKanbanCard.kanbanCardFields, 
            props.defaultDimension.id,
            props.defaultDimension.name,
            props.formName
        )    
    }

    useEffect(() => {
        const dimensionsOptions = props.dimensionFields.map(dimensionField=> ({value:dimensionField.id, label:dimensionField.label_name}))
        setDimensionOptions(dimensionsOptions)
    }, [props.dimensionFields])

    const cardFormIsOpen = cardToEdit !== null

    return (
        <KanbanConfigurationFormContainer>
            <KanbanConfigurationFormTitle>
                {strings['pt-br']['kanbanConfigurationFormDimensionTitleLabel']}
            </KanbanConfigurationFormTitle>
            <KanbanConfigurationFormSelectContainer isOpen={dimensionSelectIsOpen}>
                <Select 
                isOpen={dimensionSelectIsOpen}
                setIsOpen={setDimensionSelectIsOpen}
                options={dimensionOptions} 
                onChange={onChangeDefaultDimension}
                placeholder={strings['pt-br']['kanbanConfigurationFormDimensionSelectPlaceholder']}
                initialValues={dimensionOptions.filter(dimensionOption=> dimensionOption.value === props.defaultDimension.id)}
                /> 
            </KanbanConfigurationFormSelectContainer>
            <KanbanConfigurationFormTitle>
                {cardFormIsOpen ? strings['pt-br']['kanbanConfigurationFormCardsIsOpenTitleLabel'] : strings['pt-br']['kanbanConfigurationFormCardsIsClosedTitleLabel'] }
                {cardFormIsOpen ? '' : (<KanbanCardAddNewButton onClick={e=> {setCardToEdit(createNewKanbanCard())}}/>)}
            </KanbanConfigurationFormTitle>
            {cardFormIsOpen ? (
                <KanbanCardConfigurationForm
                source={props.source}
                formName={props.formName}
                onGetCards={props.onGetCards}
                onSelectDefaultCard={onSelectDefaultCard}
                onCreateKanbanCard={props.onCreateKanbanCard}
                onUpdateKanbanCard={props.onUpdateKanbanCard}                
                setCardToEdit={setCardToEdit}
                cardToEdit={cardToEdit}
                fields={props.fields}
                />
            ) : (
                <KanbanConfigurationFormCard
                fields={props.fields}
                onRemoveCard={onRemoveCard}
                onSelectDefaultCard={onSelectDefaultCard}
                defaultKanbanCardId={props.defaultKanbanCard.id}
                setCardToEdit={setCardToEdit}
                cards={props.cards}
                />
            )}
        </KanbanConfigurationFormContainer>
    )
}

export default KanbanConfigurationForm