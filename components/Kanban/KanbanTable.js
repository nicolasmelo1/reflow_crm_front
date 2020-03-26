import React, {useEffect} from 'react'
import KanbanDimension from './KanbanDimension'

const KanbanTable = (props) => {
    const cardFields = (props.card) ? props.card.kanban_card_fields: []

    return (
        <div style={{overflowX: 'auto'}}>
            <table>
                <tbody>
                    <KanbanDimension
                    dimensionOrders={props.dimensionOrders}
                    cardFields={cardFields}
                    data={props.data}
                    />
                </tbody>
            </table>
        </div>
    )
}

export default KanbanTable