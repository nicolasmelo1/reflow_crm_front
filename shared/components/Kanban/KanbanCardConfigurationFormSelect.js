import React, { useState } from 'react'
import { Select } from '../Utils'
import { KanbanConfigurationFormSelectContainer } from '../../styles/Kanban'
import { strings } from '../../utils/constants'

/**
 * This component is for each select component in the kanban configuration formulary.
 * We need this because it is easier to handle each select separetedly.
 * 
 * @param {Integer} index - the index of the field in the array 
 * @param {Array<Object>} fieldOptions - All of the options that the user can select in the select
 * we filter the options on each select, we don't want the user selecting the same field twice on the
 * kanban card constructor
 * @param {Array<Object>} selectedField - The array of the fieldOptions, but filtering only the option 
 * that has been selected by the user.
 */
const KanbanCardConfigurationFormSelect = (props) => {
    const [fieldSelectIsOpen, setFieldSelectIsOpen] = useState(false) 
    const onChangeCardField = (data) => {
        props.onChangeCardFields(data)
    } 

    const isInitialValueAnEmptyObject = Object.keys(props.selectedField).length === 0

    return (
        <KanbanConfigurationFormSelectContainer isOpen={fieldSelectIsOpen}>
            <Select
            isOpen={fieldSelectIsOpen}
            setIsOpen={setFieldSelectIsOpen}
            placeholder={props.index === 0 ? strings['pt-br']['kanbanConfigurationFormCardFieldSelectPlaceholderTitle'] : strings['pt-br']['kanbanConfigurationFormCardFieldSelectPlaceholderField']}
            options={props.fieldOptions} 
            onChange={onChangeCardField}
            initialValues={isInitialValueAnEmptyObject ? [] : [props.selectedField]}
            />
        </KanbanConfigurationFormSelectContainer>
    )
}

export default KanbanCardConfigurationFormSelect