import React, { useState } from 'react'
import Router, { useRouter } from 'next/router'
import SidebarFormEdit from './SidebarFormEdit'
import { SidebarDisabledGroupLabel, SidebarGroupInput, SidebarIconsContainer, SidebarIcons, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar'
import { paths, strings } from '../../utils/constants'

const SidebarGroupEdit = (props) => {
    const isMoving = React.useRef(false)
    const [isDragging,  setIsDragging] = useState(false)
    const router = useRouter()

    const checkIfCurrentHasBeenDeleted = (groups) => {
        const formNames =  [].concat.apply([], groups.map(group => group.form_group.map(form => form.form_name)))
        const formName = (formNames.length > 0) ? formNames[0] : null
        if (!formNames.includes(router.query.form)) {
            Router.push(paths.home(), paths.home(formName), { shallow: true })
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

    const onChangeGroupName = (e, index) => {
        e.preventDefault()
        props.groups[index].name = e.target.value
        const data = JSON.parse(JSON.stringify(props.groups[index]))
        const groups = JSON.parse(JSON.stringify(props.groups))
        props.onUpdateGroup(data)
        props.onChangeGroupState(groups)
    }

    const onRemoveGroup = (index) => {
        if (props.groups[index].id) {
            props.onRemoveGroup(props.groups[index].id)
        }
        let groups = JSON.parse(JSON.stringify(props.groups))
        groups.splice(index, 1)
        props.onChangeGroupState(groups)
    }

    const onDisableGroup = (e, index) => {
        e.preventDefault()
        props.groups[index].enabled = !props.groups[index].enabled
        const data = JSON.parse(JSON.stringify(props.groups[index]))
        const groups = JSON.parse(JSON.stringify(props.groups))
        props.onUpdateGroup(data)
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
        props.onUpdateGroup(movedGroup)
        props.onChangeGroupState(groups)
    }


    return (
        <div>
            { props.groups.map((group, index) => (
                <SidebarAccordion key={index}>
                    <SidebarCard onDragOver={e=> {onDragOver(e)}} onDrop={e=> {onDrop(e, index)}}>
                        <SidebarCardHeader className="group-container">
                            <SidebarIconsContainer>
                                <SidebarIcons icon="eye" onClick={e=> onDisableGroup(e, index)}/>
                                <SidebarIcons icon="trash" onClick={e=> onRemoveGroup(index)}/>
                                <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                    <SidebarIcons icon="arrows-alt" />
                                </div>
                            </SidebarIconsContainer> 
                            { (group.enabled) ? 
                                (<SidebarGroupInput value={group.name} onChange={e=>{onChangeGroupName(e, index)}}/>) :
                                (<SidebarDisabledGroupLabel eventKey="0">{strings['pt-br']['disabledGroupLabel']}</SidebarDisabledGroupLabel>)
                            }                           
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