import React from 'react'

const KanbanConfigurationFormCard = (props) => {
    return (
        <div>
            {props.cards.map((card, index) => (
                <div key={index} onClick={e=> {props.onOpenCardForm(card)}}style={{boxShadow: '0 3px 6px #444', borderRadius:'5px', padding:'10px', display:'inline-block'}}>
                    {card.kanban_card_fields.map((field, fieldIndex) => (
                        <p key={fieldIndex} style={{ margin:'0', color: fieldIndex===0 ? '#0dbf7e': '#444', fontWeight: fieldIndex===0 ? 'bold': 'normal'}}>
                            {field.label}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default KanbanConfigurationFormCard