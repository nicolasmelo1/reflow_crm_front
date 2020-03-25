import React, {useEffect} from 'react'

const KanbanTable = (props) => {
    return (
        <table>
            <tbody>
                <tr>
                    {props.dimensionOrders.map(dimensionOrder=> (
                        <td style={{ height: '200px', backgroundColor: 'red', padding:'10px'}}>
                            <p>{dimensionOrder.options}</p>
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

export default KanbanTable