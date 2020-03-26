import React, {useEffect} from 'react'
import KanbanCards from './KanbanCards'
import { KanbanDimensionTitleLabel } from 'styles/Kanban'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const KanbanDimension = (props) => {
    const filterData = (dimension) => {
        return props.data.filter(element=> element[0] === dimension)[0]
    }

    return (
        <tr>
            {props.dimensionOrders.map((dimensionOrder, index) => (
                <td key={index}>
                    <KanbanDimensionTitleLabel>
                        {dimensionOrder.options}<FontAwesomeIcon icon="bars"/>
                    </KanbanDimensionTitleLabel>
                    <KanbanCards
                    cardFields={props.cardFields}
                    data={filterData(dimensionOrder.options) ? filterData(dimensionOrder.options)[1]: []}
                    />
                </td>
            ))}
        </tr>
    )
}

export default KanbanDimension