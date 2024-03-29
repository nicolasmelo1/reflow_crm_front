import React, { useState } from 'react'
import SidebarFormEdit from './SidebarFormEdit'
import Alert from '../Utils/Alert'
import dynamicImport from '../../utils/dynamicImport'
import { paths, strings } from '../../utils/constants'
import { 
    SidebarDisabledGroupLabel, 
    SidebarGroupInput, 
    SidebarIconsContainer, 
    SidebarIcons, 
    SidebarCardHeader, 
    SidebarAccordion, 
    SidebarCard 
} from '../../styles/Sidebar'

const Router = dynamicImport('next/router')
const useRouter = dynamicImport('next/router', 'useRouter')

const SidebarGroupEdit = (props) => {
    const isMoving = React.useRef(false)
    const [errors, setErrors] = useState({})
    const [formularyIndexToRemove, setFormularyIndexToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [isDragging,  setIsDragging] = useState(false)

    const router = useRouter()

    const checkIfCurrentHasBeenDeleted = (groups) => {
        const formNames =  [].concat.apply([], groups.map(group => group.form_group.map(form => form.form_name)))
        const formName = (formNames.length > 0) ? formNames[0] : null
        if (!formNames.includes(router.query.form)) {
            Router.push(paths.home().asUrl, paths.home(formName).asUrl, { shallow: true })
        }
    }

    const reorder = (groups) => {
        return groups.map((group, groupIndex) => {
            group.form_group = group.form_group.map((form, formIndex) => {
                form.order = formIndex+1
                return form
            })
            group.order = groupIndex+1
            return group
        })
    }

    const onSubmitChanges = (data) => {
        props.onUpdateGroup(data).then(response => {
            if (response.data.status === 'error' && response.data.error && response.data.error.reason && response.data.error.detail) {
                if (response.data.error.reason.includes('must_be_unique') && response.data.error.detail.includes('label_name')) {
                    const errors = {}
                    errors[data.id] = 'must_be_unique'
                    setErrors(errors)
                }
            } 
        })

    }

    const onChangeGroupName = (index, value) => {
        props.groups[index].name = value
        const data = JSON.parse(JSON.stringify(props.groups[index]))
        const groups = JSON.parse(JSON.stringify(props.groups))
        onSubmitChanges(data)
        props.onChangeGroupState(groups)
        setErrors({})
    }

    const onRemoveGroup = (index) => {
        if (props.groups[index].id) {
            props.onRemoveGroup(props.groups[index].id)
        }
        let groups = JSON.parse(JSON.stringify(props.groups))
        groups.splice(index, 1)
        props.onChangeGroupState(groups)
    }

    const onDisableGroup = (index) => {
        props.groups[index].enabled = !props.groups[index].enabled
        const data = JSON.parse(JSON.stringify(props.groups[index]))
        const groups = JSON.parse(JSON.stringify(props.groups))
        onSubmitChanges(data)
        props.onChangeGroupState(groups)
    }

    // THIS IS REQUIRED BECAUSE OF YOUR BELOVED TRASH GOOGLE CHROME, IF WE DISMISS THE SCROLL DIRECTLY WHEN THE USER
    // MOVES IT CAUSES A BUG. The bug is: the scroll goes back to the top and the drag is dismissed.
    const setIsMoving = (data) => {
        if (data === true) {
            setTimeout(() => {if (isMoving.current) setIsDragging(true)}, 100)
        } else {
            setIsDragging(false)
        }
    }


    const onMoveGroup = (e, index) => {
        const groupContainer = e.currentTarget.closest('.group-container')
        const elementRect = e.currentTarget.getBoundingClientRect()

        e.dataTransfer.setDragImage(groupContainer, elementRect.width - 5, 20)
        e.dataTransfer.setData('groupToMoveIndex', index.toString())
        isMoving.current = true
        setIsMoving(isMoving.current)
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        isMoving.current = false
        setIsMoving(isMoving.current)
    }
    
    // almost equal as the onMoveSection() function in FormularySectionsEdit component in the Formulary folder
    const onDrop = (e, targetGroupIndex) => {
        e.preventDefault()
        e.stopPropagation()
        let movedGroupIndex = parseInt(e.dataTransfer.getData('groupToMoveIndex'))
        let newArrayWithoutMoved = props.groups.filter((_, index) => index !== movedGroupIndex)
        newArrayWithoutMoved.splice(targetGroupIndex, 0, props.groups[movedGroupIndex])
        const groups = reorder(newArrayWithoutMoved)
        const movedGroup = groups[targetGroupIndex]
        onSubmitChanges(movedGroup)
        props.onChangeGroupState(groups)
    }


    return (
        <div>
            <Alert 
            alertTitle={strings['pt-br']['sidebarDeleteGroupAlertTitle']} 
            alertMessage={strings['pt-br']['sidebarDeleteGroupAlertContent']} 
            show={showAlert} 
            onHide={() => {
                setFormularyIndexToRemove(null)
                setShowAlert(false)
            }} 
            onAccept={() => {
                setShowAlert(false)
                onRemoveGroup(formularyIndexToRemove)
            }}
            onAcceptButtonLabel={strings['pt-br']['sidebarDeleteGroupAlertAcceptButtonLabel']}
            />
            { props.groups.map((group, index) => (
                <SidebarAccordion key={index}>
                    <SidebarCard onDragOver={e=> {onDragOver(e)}} onDrop={e=> {onDrop(e, index)}}>
                        <SidebarCardHeader className="group-container">
                            <div style={{ padding: '10px'}}>
                                <SidebarIconsContainer>
                                    <SidebarIcons icon="eye" onClick={e=> onDisableGroup(index)}/>
                                    <SidebarIcons icon="trash" onClick={e=> {
                                        setFormularyIndexToRemove(index)
                                        setShowAlert(true) 
                                    }}/>
                                    <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                        <SidebarIcons icon="arrows-alt" />
                                    </div>
                                </SidebarIconsContainer> 
                                {group.enabled ? (
                                    <div>
                                        <SidebarGroupInput 
                                        value={group.name} 
                                        onChange={e=>{onChangeGroupName(index, e.target.value)}}
                                        />
                                        {errors[group.id] && errors[group.id] === 'must_be_unique' ? (
                                            <small style={{color: 'red'}}>
                                                {strings['pt-br']['mustBeUniqueFormErrorLabel']}
                                            </small>
                                        ): ''}
                                    </div>
                                ) : (
                                    <SidebarDisabledGroupLabel eventKey="0">
                                        {strings['pt-br']['disabledGroupLabel']}
                                    </SidebarDisabledGroupLabel>
                                )
                                }
                            </div>          
                        </SidebarCardHeader>
                        { (isDragging) ?  '' : (
                            <SidebarFormEdit 
                            onCreateOrUpdateForm={props.onCreateOrUpdateForm} 
                            onChangeGroupState={props.onChangeGroupState}
                            onCreateFormulary={props.onCreateFormulary}
                            onUpdateFormulary={props.onUpdateFormulary}
                            onRemoveFormulary={props.onRemoveFormulary}
                            reorder={reorder}
                            checkIfCurrentHasBeenDeleted={checkIfCurrentHasBeenDeleted}
                            forms={group.form_group} 
                            groupIndex={index} 
                            groups={props.groups}
                            onAddNewForm={props.onAddNewForm}
                            />
                        )}
                    </SidebarCard>
                </SidebarAccordion>
            ))}
        </div>
    )
}

export default SidebarGroupEdit