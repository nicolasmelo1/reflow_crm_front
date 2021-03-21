import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import KanbanCardConfigurationForm from './KanbanCardConfigurationForm'
import KanbanConfigurationFormCard from './KanbanConfigurationFormCard'
import { strings } from '../../utils/constants'
import { Select } from '../Utils'
import { 
    KanbanConfigurationFormSelectContainer, 
    KanbanCardAddNewButton, 
    KanbanConfigurationFormContainer, 
    KanbanConfigurationFormTitle
} from '../../styles/Kanban'

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
    // ------------------------------------------------------------------------------------------
    /**
     * When you create a new kanbanCard we need to create the start data of the 
     * kanban card so the kanbanCardConfigurationForm can handle. 
     * In other words, this is the default data used for creating new kanban cards.
     */
    const createNewKanbanCard = () => ({
        id: null,
        kanban_card_fields: []
    })
    // ------------------------------------------------------------------------------------------
    /**
     * When you select or unselect a dimension we need to set the defaults. That's exaclty what this does.
     * This just update the defaults for the Dimension when it changes in the selection.
     * 
     * @param {Array<BigInteger>} data - An array of selected field ids. Remember that we set the field.id as the value of 
     * our options, that exactly what we recieve here when the user selects. If the user removes an option we recieve an empty list.
     */
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

        props.onChangeDefault(
            props.defaultKanbanCard.id, 
            props.defaultKanbanCard.kanbanCardFields, 
            props.defaultDimension.id,
            props.defaultDimension.name,
            props.formName
        )
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user clicks the card that he wants to use we fire this function so this way we set the id of the kanban
     * card to use as default and it's fields.
     * 
     * This is also fired when a kanban card is updated.
     * 
     * @param {Object} selectedCard - {
     *      id: {(BigInteger | null)} - the id of the card
     *      kanban_card_fields: [
     *          {
     *              field: {
     *                  id (BigInteger): The id of the field to be used,
     *                  label_name (String): The label_name of the field to be used,
     *                  name (String): The name of the field to be used
     *              }
     *          }
     *      ]
     * }
     */
    const onSelectDefaultCard = (selectedCard) => {
        if (selectedCard !== undefined && selectedCard.id !== null) {
            props.onChangeDefault(
                selectedCard.id, 
                selectedCard.kanban_card_fields, 
                props.defaultDimension.id,
                props.defaultDimension.name,
                props.formName
            )
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Function fired when the user clicks the trash icon to delete a kanban card.
     * We recieve a kanban card id and removes it from the cards array in redux.
     * If the cardId to remove is the defaultKanbanCard.id selected, we set the defaultKanbanCard.id to null
     * so it's like the user haven't selected any kanbanCard.
     * 
     * @param {BigInteger} cardId - The kanban card id to be removed.
     */
    const onRemoveCard = (cardId) => {
        const newCards = props.cards.filter(card => card.id !== cardId)
        const isRemovedCardDefault = cardId === props.defaultKanbanCard.id
        props.onRemoveCard(newCards, props.formName, cardId)
        props.onChangeDefault(
            isRemovedCardDefault ? null : props.defaultKanbanCard.id, 
            isRemovedCardDefault ? [] : props.defaultKanbanCard.kanbanCardFields, 
            props.defaultDimension.id,
            props.defaultDimension.name,
            props.formName
        )    
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Sets the options for the dimensionSelect. This is all of the fields the user can select as dimension. 
     * Right now the user can only select fields that are of type `option`.
     */
    useEffect(() => {
        const dimensionsOptions = props.dimensionFields.map(dimensionField=> ({value: dimensionField.id, label:dimensionField.label_name}))
        setDimensionOptions(dimensionsOptions)
    }, [props.dimensionFields])
    /////////////////////////////////////////////////////////////////////////////////////////////
    // is the kanbanCardForm open or not
    const cardFormIsOpen = cardToEdit !== null
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
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
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default KanbanConfigurationForm