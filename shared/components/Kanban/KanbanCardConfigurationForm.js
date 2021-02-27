import React, { useState, useEffect } from 'react'
import { View } from 'react-native' 
import KanbanCardConfigurationFormSelect from './KanbanCardConfigurationFormSelect'
import { strings } from '../../utils/constants'
import { 
    KanbanCardConfigurationFormCancelButton, 
    KanbanCardConfigurationFormSaveButton 
} from '../../styles/Kanban'


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

    /**
     * This is used when you select or remove a field from a single KanbanCardConfigurationFormSelect. With this
     * we can add, change or remove the fields of a kanbanCard using this function.
     * 
     * For that we need the index of the select, the index is used so we can know in which position we need to change, add
     * or remove a field from the kanban. In the kanban card the order matters.
     * 
     * It's nice to notice that we always add an empty object at the end of `kanbanCardFieldOptions` if the last element of `kanbanCardFieldOptions`
     * array is not an empty object
     * 
     * @param {BigInteger} index - The index of the field select in kanbanCardFieldOptions. Is it the first one, is it the last? The order matters.
     * @param {Array<BigInteger>} selectedOption - The array of the selected values. Since we set the kanbanCard.field.id as the value
     * for the fieldOptions of the select, this is what we recieve when the user selects an option. When you remove a field we recieve an empty list.
     */
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

    /**
     * Creates or updates a kanbanCard.
     * 
     * If the cardToEdit prop has an id that IS NOT null we will UPDATE the kanban card, otherwise we will create a new kanban card.
     * When updating a kanbanCard we send a put request with the kanbanCard.id and for creating we send a post request without the kanbanCard.id
     * 
     * After we save the data, we close the kanbanCardConfiguration form, but WE ONLY CLOSE the form after retrieving all of the cards
     * the user has again. We need this because when the user selects the default kanbanCard we set the kanbanCardId to the default. So we
     * need the id of the created kanban card.
     * Another thing to know is that when we save we also sets the default kanban card again, this way we can set the defaults data.
     */
    const onCreateOrUpdateCard = async () => {
        const kanbanCardId = props.cardToEdit.id
        const selectedKanbanCardFieldIds = kanbanCardFieldOptions.filter(kanbanCardField => Object.keys(kanbanCardField).length !== 0).map(kanbanCardField=> kanbanCardField.value)
        let selectedFields = []
        // We need to do this that way because we need to append the fields in order in `selectedFields` variable.
        // keep the `kanbanCardFieldOptions` is crucial for this to work.
        for (let i=0; i<selectedKanbanCardFieldIds.length; i++) {
            const selectedField = props.fields.filter(field => selectedKanbanCardFieldIds[i] === field.id)
            if (selectedField.length > 0) {
                selectedFields.push({
                    field: selectedField[0]
                })
            }
        }
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
    
    /**
     * Effect for setting the fieldOptions that the user can select in each KanbanCardConfigurationFormSelect.
     * This is only fired when the fields that the user can select, changes.
     */
    useEffect(() => {
        setFieldOptions(props.fields.map(field => ({value: field.id, label: field.label_name})))
    }, [props.fields])

    /**
     * Effect for setting the kanbanCardFieldOptions that the user had selected for EACH KanbanCardConfigurationFormSelect.
     * In other words, this sets the initialValue for each `KanbanCardConfigurationFormSelect`
     */
    useEffect(() => {
        const newKanbanCardFieldOptions = props.cardToEdit.kanban_card_fields.map(kanbanCardField => ({value: kanbanCardField.field.id, label: kanbanCardField.field.label_name})).concat({})
        setKanbanCardFieldOptions(newKanbanCardFieldOptions)
    }, [props.cardToEditToEdit, props.fields])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
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

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default KanbanCardConfigurationForm