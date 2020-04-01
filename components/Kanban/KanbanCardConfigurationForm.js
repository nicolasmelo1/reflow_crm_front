import React, { useState, useEffect } from 'react'
import KanbanCardConfigurationFormSelect from './KanbanCardConfigurationFormSelect'
import { KanbanCardConfigurationFormCancelButton, KanbanCardConfigurationFormSaveButton } from 'styles/Kanban'
import { strings } from 'utils/constants'


/**
 * This component holds the formulary of the kanban card creation, we have 2 formularies in the kanban creation
 * The first one is for selecting the dimension and selecting the default card, the other one is for creating the
 * kanban card.
 * 
 * @param {Function} onSaveCardForm - Function to be fired when the user saves the kanban card fields.
 * @param {Function} onCloseCardForm - Function to be fired when the user cancels and exit the kanban 
 * card creation.
 * @param {Object} cardToEdit - The card to edit.
 * @param {Array<Objects>} fields - The array containing all of the fields the user can select to create the kanban card.
 */
const KanbanCardConfigurationForm = (props) => {
    const [fieldOptions,  setFieldOptions] = useState([])
    const [cardData, setCardData] = useState({
        id: null,
        kanban_card_fields: [[]]
    })

    const onChangeCardFields = (index, field) => {
        if (field.length === 0) {
            cardData.kanban_card_fields.splice(index, 1)
        } else {
            cardData.kanban_card_fields[index] = fieldOptions.filter(fieldOption=>fieldOption.value === field[0])
        }
        if (cardData.kanban_card_fields[cardData.kanban_card_fields.length-1].length !== 0) cardData.kanban_card_fields.push([])

        setCardData({...cardData})
    }

    useEffect(() => {
        setFieldOptions(props.fields.map(field=>({value: field.id, label: field.label_name})))
    }, [props.fields])
    
    useEffect(() => {
        if (props.cardToEdit) {
            const fieldOptions = props.fields.map(field=>({value: field.id, label: field.label_name}))
            const selectedFieldOptions = props.cardToEdit.kanban_card_fields.map(field=> fieldOptions.filter(fieldOption=>fieldOption.value === field.id))
            cardData.id = props.cardToEdit.id
            cardData.kanban_card_fields = selectedFieldOptions.concat(cardData.kanban_card_fields)
            setCardData({...cardData})
        }
    }, [props.cardToEdit])

    return (
        <div>
            {cardData.kanban_card_fields.map((field, index) => (
                <KanbanCardConfigurationFormSelect
                key={index}
                index={index}
                fieldOptions={fieldOptions.filter(fieldOption => !cardData.kanban_card_fields.map(field=> field[0] ? field[0].value: null).includes(fieldOption.value))}
                onChangeCardFields={onChangeCardFields}
                selectedField={field}
                />
            ))}
            <KanbanCardConfigurationFormSaveButton onClick={e=> {props.onSaveCardForm(cardData)}}>
                {strings['pt-br']['kanbanCardConfigurationFormSaveButtonLabel']}
            </KanbanCardConfigurationFormSaveButton>
            <KanbanCardConfigurationFormCancelButton onClick={e=> {props.onCloseCardForm()}}>
                {strings['pt-br']['kanbanCardConfigurationFormCancelButtonLabel']}
            </KanbanCardConfigurationFormCancelButton>
        </div>
    )
}

export default KanbanCardConfigurationForm