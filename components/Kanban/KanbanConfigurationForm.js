import React, { useState, useEffect } from 'react'
import { Select } from 'components/Utils'
import KanbanCardConfigurationForm from './KanbanCardConfigurationForm'
import KanbanConfigurationFormCard from './KanbanConfigurationFormCard'
import { KanbanConfigurationFormSelectContainer, KanbanCardAddNewButton } from 'styles/Kanban'

const KanbanConfigurationForm = (props) => {
    const [dimensionOptions, setDimensionOptions] = useState([])
    const [selectedDimension, setSelectedDimension] = useState([])
    const [cardFormIsOpen, setCardFormIsOpen] = useState(false)
    const [cardToEdit, setCardToEdit] = useState(null)

    const onChangeDimension = (data) => {
        setSelectedDimension(dimensionOptions.filter(dimensionOption=> dimensionOption.value === data[0]))
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
        const dimensionsOptions = props.dimensionFields.map(dimensionField=> ({value:dimensionField.id, label:dimensionField.label_name}))
        setDimensionOptions(dimensionsOptions)
        if (props.defaultDimensionId) {
            setSelectedDimension(dimensionsOptions.filter(dimensionOption=> dimensionOption.value === props.defaultDimensionId))
        }
    }, [props.dimensionFields, props.defaultDimensionId])

    return (
        <div style={{border: '1px solid #444', borderRadius: '5px', padding: '10px'}}>
            <h2>Dimensão</h2>
            <KanbanConfigurationFormSelectContainer>
                <Select 
                options={dimensionOptions} 
                onChange={onChangeDimension} 
                initialValues={selectedDimension}
                /> 
            </KanbanConfigurationFormSelectContainer>
            <h2>Cards<KanbanCardAddNewButton onClick={e=> {onOpenCardForm()}}/></h2>
            {cardFormIsOpen ? (
                <KanbanCardConfigurationForm
                onCloseCardForm={onCloseCardForm}
                cardToEdit={cardToEdit}
                fields={props.fields}
                />
            ) : (
                <KanbanConfigurationFormCard
                onOpenCardForm={onOpenCardForm}
                cards={props.cards}
                />
            )}
        </div>
    )
}

export default KanbanConfigurationForm