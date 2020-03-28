import React, {useEffect} from 'react'
import KanbanCards from './KanbanCards'
import { KanbanDimensionTitleLabel, KanbanDimensionMoveIcon } from 'styles/Kanban'

const KanbanDimension = (props) => {
    const filterData = (dimension) => {
        return props.data.filter(element=> element[0] === dimension)[0]
    }

    const onMoveDimension = (e, index) => {
        let dimensionContainer = e.currentTarget.closest('td')
        let dimensionRect = dimensionContainer.getBoundingClientRect()
        let elementRect = e.currentTarget.getBoundingClientRect()

        e.dataTransfer.setDragImage(dimensionContainer, dimensionRect.width - elementRect.width, 20)
        e.dataTransfer.setData('movedDimensionIndex', index)
    }

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
        e.stopPropagation()
        cleanDimensionColors(e)
    }

    const onDrop = (e, targetDimensionIndex) => {
        e.preventDefault()
        e.stopPropagation()
        cleanDimensionColors(e, false)
        let movedDimensionIndex = parseInt(e.dataTransfer.getData('movedDimensionIndex'))
        const aux = props.dimensionOrders[movedDimensionIndex]
        props.dimensionOrders[movedDimensionIndex] =  props.dimensionOrders[targetDimensionIndex];
        props.dimensionOrders[targetDimensionIndex] = aux;

        props.onChangeDimensionOrdersState([...props.dimensionOrders], props.formName, props.defaultDimensionId)
    }
    
    return (
        <tr>
            {props.dimensionOrders.map((dimensionOrder, index) => (
                <td key={index} onDragOver={e => {onDragOver(e)}} onDrop={e => {onDrop(e, index)}}>
                    <KanbanDimensionTitleLabel>
                        {dimensionOrder.options}
                        <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveDimension(e, index)}} onDragEnd={e=>{onDragEnd(e)}} >
                            <KanbanDimensionMoveIcon icon="bars"/>
                        </div>
                    </KanbanDimensionTitleLabel>
                    <KanbanCards
                    dimensionIndex={index}
                    cleanDimensionColors={cleanDimensionColors}
                    cardFields={props.cardFields}
                    data={filterData(dimensionOrder.options) ? filterData(dimensionOrder.options)[1]: []}
                    />
                </td>
            ))}
        </tr>
    )
}

export default KanbanDimension