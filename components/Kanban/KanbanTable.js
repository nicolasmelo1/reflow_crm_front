import React from 'react'
import KanbanDimension from './KanbanDimension'

/**
 * This is a simple component that is used to control the dimensions.
 * 
 * @param {String} formName - the form name of the current formulary
 * @param {Array<Object>} dimensionOrders - The dimension orders loaded on the redux state, this dimension order
 * holds only the order of each dimension.
 * @param {Interger} defaultDimensionId - The id of the selected dimension.
 * @param {Object} card - the selected card, we use this to get the card fields, this way we can set the titles
 * and the fields data in the card.
 * @param {Array<Object>} data - this is a array with all of the data, this data is used to populate the kanban 
 * cards.
 * @param {Function} onChangeKanbanData - this function is an action used to change the card status,
 * between dimension columns.
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Function} onChangeDimensionOrdersState - this function is an redux action used to change the dimension
 * order in the redux store.
 */
const KanbanTable = (props) => {
    const cardFields = (props.card) ? props.card.kanban_card_fields: []

    return (
        <div style={{overflowX: 'auto'}}>
            <table>
                <tbody>
                    <KanbanDimension
                    formName={props.formName}
                    defaultDimensionId={props.defaultDimensionId}
                    onChangeDimensionOrdersState={props.onChangeDimensionOrdersState}
                    onChangeKanbanData={props.onChangeKanbanData}
                    setFormularyId={props.setFormularyId}
                    setFormularyDefaultData={props.setFormularyDefaultData}
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