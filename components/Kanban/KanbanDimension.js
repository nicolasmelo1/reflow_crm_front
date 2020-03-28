import React from 'react'
import KanbanCards from './KanbanCards'
import { KanbanDimensionTitleLabel, KanbanDimensionMoveIcon } from 'styles/Kanban'

const KanbanDimension = (props) => {
    const filterDimensionIndex = (dimension) => {
        return props.data.findIndex(element=> element[0] === dimension)
    }

    const filterData = (dimension) => {
        return props.data.filter(element=> element[0] === dimension)[0]
    }

    const onMoveDimension = (e, index) => {
        e.dataTransfer.clearData(['movedDimensionIndex', 'movedCardIndexInDimension', 'movedCardDimension'])

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
       
        if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedDimensionIndex'))) {
            let movedDimensionIndex = parseInt(e.dataTransfer.getData('movedDimensionIndex'))
            const aux = props.dimensionOrders[movedDimensionIndex]
            props.dimensionOrders[movedDimensionIndex] =  props.dimensionOrders[targetDimensionIndex];
            props.dimensionOrders[targetDimensionIndex] = aux;
            
            props.onChangeDimensionOrdersState([...props.dimensionOrders], props.formName, props.defaultDimensionId)
        
        } else if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardIndexInDimension')) && ![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardDimension'))) {
            const movedCardIndexInDimension = parseInt(e.dataTransfer.getData('movedCardIndexInDimension'))
            const movedDimensionIndexInData = filterDimensionIndex(e.dataTransfer.getData('movedCardDimension'))
            const targetDimensionIndexInData = filterDimensionIndex(props.dimensionOrders[targetDimensionIndex].options)
            
            if (movedDimensionIndexInData !== -1 && targetDimensionIndexInData !== -1) {
                const cardData = {...props.data[movedDimensionIndexInData][1][movedCardIndexInDimension]}
                const fieldValueId = cardData.dynamic_form_value.filter(value=> value.field_id === props.defaultDimensionId)[0].id

                props.data[movedDimensionIndexInData][1].splice(movedCardIndexInDimension, 1)
                props.data[targetDimensionIndexInData][1].splice(0, 0, cardData)
                
                const newData = {
                    new_value: props.dimensionOrders[targetDimensionIndex].options,
                    form_value_id: fieldValueId
                }
                //props.onUpdateKanbanData()
                props.onChangeKanbanData(newData, props.formName, [...props.data]).then(response=> {
                    if (response && response.data.error && response.data.error.reason.includes('required_field')) {
                        props.setFormularyDefaultData([newData])
                        props.setFormularyId(cardData.id)
                    }
                })
            }
        }
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
                    dimension={dimensionOrder.options}
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