import React from 'react'
import { Select } from 'components/Utils'
import { KanbanConfigurationFormSelectContainer } from 'styles/Kanban'

const KanbanCardConfigurationFormSelect = (props) => {
    const onChangeCardField = (data) => {
        props.onChangeCardFields(props.index, data)
    } 

    return (
        <KanbanConfigurationFormSelectContainer>
            <Select
            options={props.fieldOptions} 
            onChange={onChangeCardField}
            initialValues={props.selectedField}
            />
        </KanbanConfigurationFormSelectContainer>
    )
}

export default KanbanCardConfigurationFormSelect