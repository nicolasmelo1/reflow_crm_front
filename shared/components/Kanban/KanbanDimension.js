import React, { useState } from 'react'
import KanbanCards from './KanbanCards'
import { KanbanDimensionTitleLabel, KanbanDimensionMoveIcon } from '../../styles/Kanban'


/**
 * This is a component that controls all of the dimensions in the kanban. This controls the drop and dragover in 
 * the dimesion for the dimension drag and drop and also the card drag and drop
 * 
 * @param {String} formName - the form name of the current formulary
 * @param {Array<Object>} dimensionOrders - The dimension orders loaded on the redux state, this dimension order
 * holds only the order of each dimension.
 * @param {Interger} defaultDimensionId - The id of the selected dimension.
 * @param {Object} cardFields - the fields on the selected card.
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
const KanbanDimension = (props) => {
    const [cardIdsInLoadingState, setCardIdsInLoadingState] = useState([])

    const filterDimensionIndex = (dimension) => {
        return props.data.findIndex(element=> element.dimension === dimension)
    }

    const filterData = (dimension) => {
        return props.data.filter(element=> element.dimension === dimension)[0]
    }

    const onMoveDimension = (e, index) => {
        e.dataTransfer.clearData(['movedDimensionIndex', 'movedCardIndexInDimension', 'movedCardDimension'])

        let dimensionContainer = e.currentTarget.closest('td')
        let dimensionRect = dimensionContainer.getBoundingClientRect()
        let elementRect = e.currentTarget.getBoundingClientRect()

        e.dataTransfer.setDragImage(dimensionContainer, dimensionRect.width - elementRect.width, 20)
        e.dataTransfer.setData('movedDimensionIndex', index.toString())
    }
    /**
     * Change the background color when the dimension and the cards are moving.
     * 
     * @param {*} e - is the event object
     * @param {*} isMoving - defaults to true - a boolean that says if the card or the
     * dimension is being moved or if it has ended.
     */
    const cleanDimensionColors = (e, isMoving=true) => {
        const dimensions = Array.prototype.slice.call(e.currentTarget.closest('tr').querySelectorAll('td'));
        dimensions.map(dimension => {
            dimension.style.backgroundColor = 'transparent';
        });
        if (isMoving) {
            e.currentTarget.style.backgroundColor = '#f2f2f2'
        }
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        cleanDimensionColors(e, false)
    }

    const onDragOver = (e) => {
        e.preventDefault()
        //e.stopPropagation()
        cleanDimensionColors(e)
    }

    const onDrop = (e, targetDimensionIndex) => {
        e.preventDefault()
        e.stopPropagation()
        cleanDimensionColors(e, false)

        // we need JSON.parse with JSON.stringfy this to make a deep copy of the array, because we are encountering a 
        // problem with array inside arrays read this for more info: https://medium.com/@gamshan001/javascript-deep-copy-for-array-and-object-97e3d4bc401a
        const data = JSON.parse(JSON.stringify(props.data))
        const dimensionOrders = Array.from(props.dimensionOrders)

        // this controls the drop when the dimension is being moved.
        if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedDimensionIndex'))) {
            let movedDimensionIndex = parseInt(e.dataTransfer.getData('movedDimensionIndex'))
            const aux = dimensionOrders[movedDimensionIndex]
            dimensionOrders[movedDimensionIndex] =  dimensionOrders[targetDimensionIndex];
            dimensionOrders[targetDimensionIndex] = aux;
            
            props.onChangeDimensionOrdersState(dimensionOrders, props.formName, props.defaultDimensionId)
        
        // this constrols the drop when the card is being moved.
        } else if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardIndexInDimension')) && 
                   ![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardDimension'))) {

            const movedCardIndexInDimension = parseInt(e.dataTransfer.getData('movedCardIndexInDimension'))
            const movedDimensionIndexInData = filterDimensionIndex(e.dataTransfer.getData('movedCardDimension'))
            const targetDimensionIndexInData = filterDimensionIndex(dimensionOrders[targetDimensionIndex].options)
            
            if (movedDimensionIndexInData !== -1 && targetDimensionIndexInData !== -1 && movedDimensionIndexInData !== targetDimensionIndexInData) {
                const cardData = {...data[movedDimensionIndexInData].data[movedCardIndexInDimension]}
                const fieldValue = cardData.dynamic_form_value.filter(value=> value.field_id === props.defaultDimensionId)
                setCardIdsInLoadingState([cardData.id])

                if (fieldValue.length > 0) {
                    const fieldValueId = fieldValue[0].id
                    data[movedDimensionIndexInData].data.splice(movedCardIndexInDimension, 1)
                    data[targetDimensionIndexInData].data.splice(0, 0, cardData)
                    const newData = {
                        new_value: props.dimensionOrders[targetDimensionIndex].options,
                        form_value_id: fieldValueId
                    }
                    
                    setCardIdsInLoadingState([cardData.id])
                    props.onChangeKanbanData(newData, props.formName, data).then(response=> {
                        if (response && response.data.error && response.data.error.reason.includes('required_field')) {
                            props.setFormularyDefaultData([newData])
                            props.setFormularyId(cardData.id)
                        }
                        setCardIdsInLoadingState([])
                    })
                }
            }
        }
    }
    
    return (
        <tr>
            {props.dimensionOrders.map((dimensionOrder, index) => (
                <td key={index}
                onDragOver={e => {onDragOver(e)}} 
                onDrop={e => {onDrop(e, index)}}
                style={{maxWidth: props.dimensionsWidth, minWidth: props.dimensionsWidth}}
                >
                    <KanbanDimensionTitleLabel>
                        {dimensionOrder.options}
                        <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveDimension(e, index)}} onDragEnd={e=>{onDragEnd(e)}} >
                            <KanbanDimensionMoveIcon icon="bars"/>
                        </div>
                    </KanbanDimensionTitleLabel>
                    <KanbanCards
                    setFormularyId={props.setFormularyId}
                    dimension={dimensionOrder.options}
                    cancelToken={props.cancelToken}
                    cleanDimensionColors={cleanDimensionColors}
                    formName={props.formName}
                    onGetKanbanData={props.onGetKanbanData}
                    onChangeKanbanData={props.onChangeKanbanData}
                    cardIdsInLoadingState={cardIdsInLoadingState}
                    params={props.params}
                    cardFields={props.cardFields}
                    data={filterData(dimensionOrder.options)}
                    pagination={filterData(dimensionOrder.options) ? filterData(dimensionOrder.options).pagination: []}
                    />
                </td>
            ))}
        </tr>
    )
}

export default KanbanDimension