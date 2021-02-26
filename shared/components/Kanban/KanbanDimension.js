import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import KanbanCards from './KanbanCards'
import isAdmin from '../../utils/isAdmin'
import delay from '../../utils/delay'
import agent from '../../utils/agent'
import generateUUID from '../../utils/generateUUID'
import { strings } from '../../utils/constants'
import Alert from '../Utils/Alert'
import { 
    KanbanDimensionTitleLabel,
    KanbanDimensionTitleContainer, 
    KanbanDimensionMoveIcon,
    KanbanDimensionEditIcon,
    KanbanDimensionRemoveIcon,
    KanbanAddNewDimensionButton,
    KanbanEditDimensionInput,
    KanbanCollapseDimensionButton
} from '../../styles/Kanban'


const makeDelay = delay(5000)

/**
 * This is a component that controls all of the dimensions in the kanban. This controls the drop and dragover in 
 * the dimesion for the dimension drag and drop and also the card drag and drop
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {Object} user - The user object of the login redux reducer
 * @param {String} formName - the form name of the current formulary
 * @param {Array<Object>} dimensionPhases - The dimension orders loaded on the redux state, this dimension order
 * holds only the order of each dimension.
 * @param {Interger} defaultDimensionId - The id of the selected dimension.
 * @param {Object} cardFields - the fields on the selected card.
 * @param {Array<Object>} data - this is a array with all of the data, this data is used to populate the kanban 
 * cards.
 * @param {Function} onMoveKanbanCardBetweenDimensions - this function is an action used to change the card status,
 * between dimension columns.
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Function} onChangeDimensionPhases - this function is an redux action used to change the dimension
 * order in the redux store.
 */
const KanbanDimension = (props) => {
    const isMountedRef = React.useRef()
    const sourceRef = React.useRef()
    const ignoreWebSocketRef = React.useRef()
    const [dimensionIndexToRemove, setDimensionIndexToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [cardIdsInLoadingState, setCardIdsInLoadingState] = useState([])
    const [isEditingDimensionIndex, setIsEditingDimensionIndex] = useState(null)
    
    /**
     * Gets the index of the dimension phase from our data array.
     * This is used when moving a kanban card data along phases, when we drop we need to get the data array from where this data left
     * and where it is going, so we can actually change the data itself.
     * 
     * The data prop is an array of arrays where the main array is each dimension and the array inside of the array is the actuall data
     * It looks something like:
     * [{
     *      dimension: 'dimensionPhase1',
     *      pagination: {
     *          current: 1,
     *          total: 2
     *      },
     *      data: [... objects of each kanban data on this phase]
     * }]
     * 
     * @param {String} dimensionPhase - The string of the dimensionPhase you want to find the index for in the data array.
     */
    const filterDimensionPhaseIndex = (dimensionPhase) => {
        return props.data.findIndex(element=> element.dimension === dimensionPhase)
    }

    /**
     * As said on `filterDimensionPhaseIndex()` function on how data is organized in redux, this is used to get the data of a 
     * particular dimension phase so we display them to the user.
     * 
     * @param {String} dimensionPhase - The dimensionPhase you want to retrieve the data for
     */
    const filterDataDimensionPhase = (dimensionPhase) => {
        return props.data.filter(element=> element.dimension === dimensionPhase)[0]
    }

    /**
     * When the user starts dragging an dimension phase for reordering on the kanban
     * we use this function. Like `onMoveCard` function in KanbanCards component we also need to make sure
     * that the image is lined perfeclty with the cursor position.
     * 
     * Here we just need to sed the movedDimensionIndex to the datatransfer
     * 
     * @param {import('react').SyntheticEvent} e - The SyntheticEvent fired by React on onDragStart event
     * @param {BigInteger} index - The index of the dimension on `dimensionPhases` prop
     */
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
     * @param {HTMLElement} dimensionPhaseElementFromTheDOM - The HTMLElement of the dom that is the dimension phase container 
     * that holds all of the cards with the actual data for a particular phase. With this we can set the backgroundColor of this
     * element when the user is dragging over the element.
     * @param {Boolean} isMoving - defaults to true - a boolean that says if the card or the
     * dimension is being moved or if it has ended.
     */
    const cleanDimensionColors = (dimensionPhaseElementFromTheDOM, isMoving=true) => {
        const dimensions = Array.prototype.slice.call(dimensionPhaseElementFromTheDOM.closest('tr').querySelectorAll('td'))
        dimensions.map(dimension => {
            dimension.style.backgroundColor = 'transparent'
        })
        if (isMoving) {
            dimensionPhaseElementFromTheDOM.style.backgroundColor = '#f2f2f2'
        }
    }

    /**
     * This is used for retriving the changed data from the backend, when we remove a phase, add a new phase or rename a phase we need to retrieve the dimension
     * id in order to be able to collapse it. So this is exactly what we do. 
     * 
     * When you finish editing a phase of the kanban we retrieve the phases of the kanban again, with this we get the id of the kanban phase that was created
     * and sync the data on the frontend with the data from the backend.
     * 
     * @param {(BigInteger | null)} data - The index of the dimension that is being edited or null if you've finished editing.
     */
    const onToggleEditMode = (data) => {
        const hasFinishedEditing = data === null

        if (hasFinishedEditing) {
            // Commit the changes to the backend and load the kanban
            props.onChangeDimensionPhases([...props.dimensionPhases], props.formName, props.defaultDimension.id).then(_ => {
                props.onGetDimensionPhases(sourceRef.current, props.formName, props.defaultDimension.id).then(_ => {
                    props.onGetKanbanData(sourceRef.current, props.params, props.formName,  [props.dimensionPhases[isEditingDimensionIndex].option])
                })
            })
        }
        setIsEditingDimensionIndex(data)
    }

    /**
     * Used when the user changes the name of a phase. When this happens we update the state and also update the backend with the change.
     * The backend process everything the same way, weather you changed a phase name, deleted, moved or added a new phase column. You ALWAYS need to send
     * all of the possible options of this dimension, this is because for the backend we are changing only the options of a field.
     * 
     * @param {BigInteger} index - The index of the dimension order to change the name
     * @param {String} newName - The new name of the dimension 
     */
    const onChangePhaseName = (index, newName) => {
        props.dimensionPhases[index].option = newName
        ignoreWebSocketRef.current = true
        props.onChangeDimensionPhases([...props.dimensionPhases])
    }

    /**
     * Removes a phase from a dimension. This means that we are only removing the option of an existing field.
     * 
     * The same principle for `onChangePhaseName` is applied here: You ALWAYS need to send all of the possible options of 
     * this dimension, this is because for the backend we are changing only the options of a field.
     */
    const onRemovePhase = () => {
        props.dimensionPhases.splice(dimensionIndexToRemove, 1)
        ignoreWebSocketRef.current = true
        props.onChangeDimensionPhases([...props.dimensionPhases], props.formName, props.defaultDimension.id)
        setDimensionIndexToRemove(null)
        setIsEditingDimensionIndex(null)
    }

    /**
     * Adds a phase on a dimension. This means that we are only adding an option of an existing field.
     * 
     * The same principle for `onChangePhaseName` is applied here: You ALWAYS need to send all of the possible options of 
     * this dimension, this is because for the backend we are changing only the options of a field.
     * 
     * When we add a new phase we need to ignore the websocket updates and also toggle the editmode for this new phase, so he adds
     * editing the phase.
     */
    const onAddPhase = () => {
        props.dimensionPhases.push({
            id: null, 
            option: strings['pt-br']['kanbanNewPhaseDefaultText'],
            uuid: generateUUID()
        })
        onToggleEditMode(props.dimensionPhases.length - 1)
        ignoreWebSocketRef.current = true
        props.onChangeDimensionPhases([...props.dimensionPhases], props.formName, props.defaultDimension.id).then(_ => {
            props.onGetDimensionPhases(sourceRef.current, props.formName, props.defaultDimension.id)
        })
    }

    /**
     * Collapses a phase in the kanban so it's contents are not shown to the user and he can organize the kanban easier
     * 
     * @param {BigInteger} phaseId - The id of the phase you want to collapse or to show.
     */
    const onCollapsePhase = (phaseId) => {
        if (phaseId !== null) {
            const collapsedIndex = props.collapsedDimensions.findIndex(collapsedDimension => collapsedDimension === phaseId)
            if (collapsedIndex !== -1) {
                props.collapsedDimensions.splice(collapsedIndex, 1)
            } else {
                props.collapsedDimensions.push(phaseId)
            }
            props.onCollapseDimension([...props.collapsedDimensions], props.formName, props.defaultDimension.id)
            props.onUpdateDimensionsOnScreen()
        }
    }

    /**
     * This handles when the user drops a kanban card or a reorder a kanban dimension phase.
     * It's important to understand this because this means we handle two things in 1 function so you should be aware of this.
     * 
     * Check the `onMoveDimension` function in this component and check the `onMoveCard` in KanbanCard component. You will notice
     * that what we set to the dataTransfer is different for both cases. We use this to understanding if you are droping a kanbanCard
     * or a kanbanDimension phase.
     * 
     * When we are dragging a kanban dimension phase we set: `movedDimensionIndex`, and when it's a kanbanCard we set `movedCardIndexInDimension`
     * and `movedCardDimension`
     *  
     * @param {import('react').SyntheticEvent} e - The event object fired by react on onDrop event. 
     * @param {BigInteger} targetDimensionIndex - The index of the dimension phase in `dimensionPhases` prop so we can know to what dimension you are dropping
     * this kanbanCard or kanban dimension phase
     */
    const onDrop = (e, targetDimensionIndex) => {
        cleanDimensionColors(e.currentTarget, false)

        // we need JSON.parse with JSON.stringfy this to make a deep copy of the array, because we are encountering a 
        // problem with array inside arrays read this for more info: https://medium.com/@gamshan001/javascript-deep-copy-for-array-and-object-97e3d4bc401a
        const data = JSON.parse(JSON.stringify(props.data))
        const dimensionPhases = Array.from(props.dimensionPhases)

        // this controls the drop when the dimension is being moved.
        if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedDimensionIndex'))) {
            let movedDimensionIndex = parseInt(e.dataTransfer.getData('movedDimensionIndex'))
            const auxiliary = dimensionPhases[movedDimensionIndex]
            dimensionPhases[movedDimensionIndex] =  dimensionPhases[targetDimensionIndex]
            dimensionPhases[targetDimensionIndex] = auxiliary
            if (isEditingDimensionIndex === movedDimensionIndex) {
                setIsEditingDimensionIndex(targetDimensionIndex)
            }
            ignoreWebSocketRef.current = true
            props.onChangeDimensionPhases(dimensionPhases, props.formName, props.defaultDimension.id)
        
        // this constrols the drop when the card is being moved.
        } else if (![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardIndexInDimension')) && 
                   ![null, undefined, '', 'undefined'].includes(e.dataTransfer.getData('movedCardDimension'))) {

            const movedCardIndexInDimension = parseInt(e.dataTransfer.getData('movedCardIndexInDimension'))
            const movedDimensionIndexInData = filterDimensionPhaseIndex(e.dataTransfer.getData('movedCardDimension'))
            const targetDimensionIndexInData = filterDimensionPhaseIndex(dimensionPhases[targetDimensionIndex].option)
            
            if (movedDimensionIndexInData !== -1 && targetDimensionIndexInData !== -1 && movedDimensionIndexInData !== targetDimensionIndexInData) {
                const cardData = {...data[movedDimensionIndexInData].data[movedCardIndexInDimension]}
                const fieldValue = cardData.dynamic_form_value.filter(value=> value.field_id === props.defaultDimension.id)
                setCardIdsInLoadingState([cardData.id])

                if (fieldValue.length > 0) {
                    const fieldValueId = fieldValue[0].id
                    data[movedDimensionIndexInData].data.splice(movedCardIndexInDimension, 1)
                    data[targetDimensionIndexInData].data.splice(0, 0, cardData)
                    const newData = {
                        new_value: props.dimensionPhases[targetDimensionIndex].option,
                        form_value_id: fieldValueId
                    }
                    
                    setCardIdsInLoadingState([cardData.id])
                    props.onMoveKanbanCardBetweenDimensions(newData, props.formName, data).then(response=> {
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

    /**
     * Websocket used for updating in real time as updates are being made in the formulary.
     * Those changes are like: adding a new field, editing the phases or removing a field or a phase
     * of the kanban. We wait for 5 seconds, when no more changes are made we update the kanban. 
     */
    useEffect(() => {
        agent.websocket.KANBAN.recieveFormularyUpdated({
            formName: props.formName,
            callback: (data) => {
                makeDelay(() => {
                    if (![null, '', undefined].includes(props.formName) && ![null, '', undefined].includes(props.defaultDimension.id) && !ignoreWebSocketRef.current) {
                        props.onGetDimensionPhases(sourceRef.current, props.formName, props.defaultDimension.id)
                    } else if (ignoreWebSocketRef.current) {
                        ignoreWebSocketRef.current = false
                    }
                })
            }
        })
    }, [props.defaultDimension, props.formName])

    useEffect(() => {
        isMountedRef.current = true
        sourceRef.current = props.cancelToken.source()

        return () => {
            isMountedRef.current = false
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <React.Fragment>
                <Alert
                alertTitle={strings['pt-br']['kanbanRemoveDimensionAlertTitle']} 
                alertMessage={strings['pt-br']['kanbanRemoveDimensionAlertContent']} 
                show={showAlert} 
                onHide={() => {
                    setDimensionIndexToRemove(null)
                    props.setIsAlertShown(false)
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    props.setIsAlertShown(false)
                    onRemovePhase()
                }}
                onAcceptButtonLabel={strings['pt-br']['kanbanRemoveDimensionAlertAcceptButton']}
                />
                <table style={{ transform: props.isAlertShown ? 'none': 'rotateX(180deg)'}}>
                        <tbody>
                        <tr>
                            {props.dimensionPhases.map((dimensionOrder, index) => (
                                <td key={index}
                                onDragOver={e => {
                                    e.preventDefault()
                                    cleanDimensionColors(e.currentTarget)
                                }} 
                                onDrop={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onDrop(e, index)
                                }}
                                style={{
                                    maxWidth: props.collapsedDimensions.includes(dimensionOrder.id) ? 70 : props.dimensionsWidth, 
                                    minWidth: props.collapsedDimensions.includes(dimensionOrder.id) ? 70 : props.dimensionsWidth,
                                }}
                                >
                                    <KanbanDimensionTitleContainer
                                    isCollapsed={props.collapsedDimensions.includes(dimensionOrder.id)}
                                    >
                                        {isAdmin(props?.types?.defaults?.profile_type, props?.user) && isEditingDimensionIndex === index ? (
                                            <KanbanEditDimensionInput type={'text'} 
                                            placeholder={strings['pt-br']['kanbanEditPhaseNameInputPlaceholder']}
                                            value={dimensionOrder.option}
                                            autoComplete="whathever"
                                            onChange={(e) => onChangePhaseName(index, e.target.value)}
                                            />
                                        ) : (
                                            <KanbanCollapseDimensionButton
                                            isCollapsed={props.collapsedDimensions.includes(dimensionOrder.id)} 
                                            onClick={(e) => onCollapsePhase(dimensionOrder.id)}
                                            >
                                                <KanbanDimensionTitleLabel
                                                isCollapsed={props.collapsedDimensions.includes(dimensionOrder.id)}
                                                isNullId={dimensionOrder.id === null}
                                                >
                                                    {dimensionOrder.option}
                                                </KanbanDimensionTitleLabel>
                                            </KanbanCollapseDimensionButton>
                                        )}
                                        {isAdmin(props?.types?.defaults?.profile_type, props?.user) && !props.collapsedDimensions.includes(dimensionOrder.id) ? (
                                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                {isEditingDimensionIndex === index ? (
                                                    <KanbanDimensionRemoveIcon 
                                                    icon="trash" 
                                                    onClick={e => {
                                                        setShowAlert(true)
                                                        props.setIsAlertShown(true)
                                                        setDimensionIndexToRemove(index)
                                                    }}/>
                                                ) : ''}
                                                <KanbanDimensionEditIcon 
                                                icon={isEditingDimensionIndex === index ? 'check' : 'pencil-alt'} 
                                                onClick={e => onToggleEditMode(isEditingDimensionIndex === index ? null : index)}
                                                />
                                                <div 
                                                draggable="true" 
                                                onDrag={e=>{
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }} 
                                                onDragStart={e=>{onMoveDimension(e, index)}} 
                                                onDragEnd={e=>{
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    cleanDimensionColors(e.currentTarget, false)
                                                }} >
                                                    <KanbanDimensionMoveIcon icon="bars"/>
                                                </div>
                                            </div>
                                        ) : ''}
                                    </KanbanDimensionTitleContainer>
                                    {!props.collapsedDimensions.includes(dimensionOrder.id) ? (
                                        <KanbanCards
                                        setFormularyId={props.setFormularyId}
                                        dimension={dimensionOrder.option}
                                        cancelToken={props.cancelToken}
                                        defaultKanbanCard={props.defaultKanbanCard}
                                        cleanDimensionColors={cleanDimensionColors}
                                        formName={props.formName}
                                        onGetKanbanData={props.onGetKanbanData}
                                        onMoveKanbanCardBetweenDimensions={props.onMoveKanbanCardBetweenDimensions}
                                        cardIdsInLoadingState={cardIdsInLoadingState}
                                        params={props.params}
                                        data={filterDataDimensionPhase(dimensionOrder.option)}
                                        pagination={filterDataDimensionPhase(dimensionOrder.option) ? filterDataDimensionPhase(dimensionOrder.option).pagination: []}
                                        />
                                    ): ''}
                                </td>
                            ))}
                            {isAdmin(props?.types?.defaults?.profile_type, props?.user) ? (
                                <td style={{ height: '100%', minWidth: props.dimensionsWidth}}>
                                    <KanbanAddNewDimensionButton onClick={(e) => onAddPhase()}>
                                        <FontAwesomeIcon icon={'plus-circle'}/>
                                    </KanbanAddNewDimensionButton>
                                </td>
                            ) : ''}
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default KanbanDimension