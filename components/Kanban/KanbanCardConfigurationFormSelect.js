import React from 'react'
import { Select } from 'components/Utils'
import { KanbanConfigurationFormSelectContainer } from 'styles/Kanban'
import { strings } from 'utils/constants'

const KanbanCardConfigurationFormSelect = (props) => {
    const onChangeCardField = (data) => {
        props.onChangeCardFields(props.index, data)
    } 

    return (
        <KanbanConfigurationFormSelectContainer>
            <Select
            placeholder={props.index === 0 ? strings['pt-br']['kanbanConfigurationFormCardFieldSelectPlaceholderTitle'] : strings['pt-br']['kanbanConfigurationFormCardFieldSelectPlaceholderField']}
            options={props.fieldOptions} 
            onChange={onChangeCardField}
            initialValues={props.selectedField}
            />
        </KanbanConfigurationFormSelectContainer>
    )
}

export default KanbanCardConfigurationFormSelect