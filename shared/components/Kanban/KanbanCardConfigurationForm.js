import React, { useState, useEffect } from 'react'
import KanbanCardConfigurationFormSelect from './KanbanCardConfigurationFormSelect'
import { KanbanCardConfigurationFormCancelButton, KanbanCardConfigurationFormSaveButton } from '../../styles/Kanban'
import { strings } from '../../utils/constants'


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
    const [fieldOptions, setFieldOptions] = useState([])
    const [kanbanCardFieldOptions, setKanbanCardFieldOptions] = useState(
        props.cardToEdit.kanban_card_fields.map(kanbanCardField => ({value: kanbanCardField.field.id, label: kanbanCardField.field.label_name})).concat({})
    )

    const onChangeCardFields = (index, selectedOption) => {
        const selectedFieldOption = fieldOptions.filter(fieldOption => fieldOption.value === selectedOption[0])[0]
        
        if (selectedOption.length === 0) {
            kanbanCardFieldOptions.splice(index, 1)
        } else if (selectedFieldOption) {
            kanbanCardFieldOptions[index] = selectedFieldOption
        }

        const isLastElementAnEmptyObject = Object.keys(kanbanCardFieldOptions[kanbanCardFieldOptions.length - 1]).length === 0
        if (!isLastElementAnEmptyObject) kanbanCardFieldOptions.push({})

        setKanbanCardFieldOptions([...kanbanCardFieldOptions])
    }   

    const onCreateOrUpdateCard = async () => {
        const kanbanCardId = props.cardToEdit.id
        const selectedKanbanCardFieldIds = kanbanCardFieldOptions.filter(kanbanCardField => Object.keys(kanbanCardField).length !== 0).map(kanbanCardField=> kanbanCardField.value)
        const selectedFields = props.fields.filter(field => selectedKanbanCardFieldIds.includes(field.id)).map(field=> ({field: field}))
        const body = {
            id: kanbanCardId,
            kanban_card_fields: selectedFields
        }
        let response = null
        try {
            if (kanbanCardId !== null) {
                response = await props.onUpdateKanbanCard(body, props.formName, kanbanCardId)
            } else {
                response = await props.onCreateKanbanCard(body, props.formName)
            }
            if (response && response.status === 200) {
                props.onGetCards(props.source, props.formName).then(_ => {
                    props.onSelectDefaultCard(body)
                    props.setCardToEdit(null)
                })
            }
        } catch {}
    }
    
    useEffect(() => {
        setFieldOptions(props.fields.map(field => ({value: field.id, label: field.label_name})))
    }, [props.fields])

    useEffect(() => {
        const newKanbanCardFieldOptions = props.cardToEdit.kanban_card_fields.map(kanbanCardField => ({value: kanbanCardField.field.id, label: kanbanCardField.field.label_name})).concat({})
        setKanbanCardFieldOptions(newKanbanCardFieldOptions)
    }, [props.cardToEditToEdit, props.fields])

    return (
        <div>
            {kanbanCardFieldOptions.map((field, index) => (
                <KanbanCardConfigurationFormSelect
                key={index}
                index={props.index}
                fieldOptions={fieldOptions.filter(fieldOption => !kanbanCardFieldOptions.map(field=> field[0] ? field[0].value: null).includes(fieldOption.value))}
                onChangeCardFields={(data) => onChangeCardFields(index, data)}
                selectedField={field}
                />
            ))}
            <KanbanCardConfigurationFormSaveButton onClick={e=> {onCreateOrUpdateCard()}}>
                {strings['pt-br']['kanbanCardConfigurationFormSaveButtonLabel']}
            </KanbanCardConfigurationFormSaveButton>
            <KanbanCardConfigurationFormCancelButton onClick={e=> {props.setCardToEdit(null)}}>
                {strings['pt-br']['kanbanCardConfigurationFormCancelButtonLabel']}
            </KanbanCardConfigurationFormCancelButton>
        </div>
    )
}

export default KanbanCardConfigurationForm