import React, { useState, useEffect } from 'react'
import { Select } from 'components/Utils'
import KanbanCardConfigurationForm from './KanbanCardConfigurationForm'
import KanbanConfigurationFormCard from './KanbanConfigurationFormCard'
import { KanbanConfigurationFormSelectContainer, KanbanCardAddNewButton, KanbanConfigurationFormContainer, KanbanConfigurationFormTitle} from 'styles/Kanban'
import { strings } from 'utils/constants'

/**
 * This component controls the formulary to set the kanban dimension and cards.
 * 
 * @param {*} props 
 */
const KanbanConfigurationForm = (props) => {
    const [defaults, setDefaults] = useState({
        default_kanban_card_id: props.defaultKanbanCardId,
        default_dimension_field_id: props.defaultDimensionId,
    })
    const [dimensionOptions, setDimensionOptions] = useState([])
    const [cardFormIsOpen, setCardFormIsOpen] = useState(false)
    const [cardToEdit, setCardToEdit] = useState(null)


    const onChangeDefaultDimension = (data) => {
        defaults.default_dimension_field_id = (data.length > 0) ? data[0] : defaults.default_dimension_field_id
        props.onChangeDefaultState(defaults, props.formName)
    }
    
    const onSelectDefaultCard = (cardId) => {
        defaults.default_kanban_card_id = cardId
        props.onChangeDefaultState(defaults, props.formName)
    }

    const onSaveCardForm = (data) => {
        data.kanban_card_fields = data.kanban_card_fields
            .filter(cardField=> cardField.length > 0)
            .map(cardField=> ({id: cardField[0].value, label: cardField[0].label}))
        if (data.id && data.id !== -1) {
            const cardIndex = props.cards.findIndex(card => card.id === data.id)
            if (cardIndex !== -1) {
                props.cards[cardIndex] = data
                props.onCreateOrUpdateCard(data, props.formName, cardIndex)
            }
        } else {
            props.cards.push(data)
            props.onCreateOrUpdateCard(data, props.formName, props.cards.length-1)
        }
        props.onChangeCardsState([...props.cards])
        onCloseCardForm()
    }

    const onCloseCardForm = () => {
        setCardFormIsOpen(!cardFormIsOpen)
        setCardToEdit(null)
    }

    const onOpenCardForm = (card) => {
        setCardFormIsOpen(!cardFormIsOpen)
        if (card) {
            setCardToEdit(card)
        } else {
            setCardToEdit(null)
        }
    }
    useEffect(() => {
        setDefaults({
            default_kanban_card_id: props.defaultKanbanCardId,
            default_dimension_field_id: props.defaultDimensionId,
        })
    }, [props.defaultKanbanCardId, props.defaultDimensionId]) 

    useEffect(() => {
        const dimensionsOptions = props.dimensionFields.map(dimensionField=> ({value:dimensionField.id, label:dimensionField.label_name}))
        setDimensionOptions(dimensionsOptions)
    }, [props.dimensionFields])

    return (
        <KanbanConfigurationFormContainer>
            <KanbanConfigurationFormTitle>
                {strings['pt-br']['kanbanConfigurationFormDimensionTitleLabel']}
            </KanbanConfigurationFormTitle>
            <KanbanConfigurationFormSelectContainer>
                <Select 
                options={dimensionOptions} 
                onChange={onChangeDefaultDimension}
                placeholder={strings['pt-br']['kanbanConfigurationFormDimensionSelectPlaceholder']}
                initialValues={dimensionOptions.filter(dimensionOption=> dimensionOption.value === props.defaultDimensionId)}
                /> 
            </KanbanConfigurationFormSelectContainer>
            <KanbanConfigurationFormTitle>
                {cardFormIsOpen ? strings['pt-br']['kanbanConfigurationFormCardsIsOpenTitleLabel'] : strings['pt-br']['kanbanConfigurationFormCardsIsClosedTitleLabel'] }
                {cardFormIsOpen ? '' : (<KanbanCardAddNewButton onClick={e=> {onOpenCardForm()}}/>)}
            </KanbanConfigurationFormTitle>
            {cardFormIsOpen ? (
                <KanbanCardConfigurationForm
                onSaveCardForm={onSaveCardForm}
                onCloseCardForm={onCloseCardForm}
                cardToEdit={cardToEdit}
                fields={props.fields}
                />
            ) : (
                <KanbanConfigurationFormCard
                onSelectDefaultCard={onSelectDefaultCard}
                defaultKanbanCardId={props.defaultKanbanCardId}
                onOpenCardForm={onOpenCardForm}
                cards={props.cards}
                />
            )}
        </KanbanConfigurationFormContainer>
    )
}

export default KanbanConfigurationForm