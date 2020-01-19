import React, {useState} from 'react'
import SidebarFormEdit from './SidebarFormEdit'
import { SidebarDisabledGroupLabel, SidebarGroupInput, SidebarIconsContainer, SidebarIcons, SidebarCardHeader, SidebarAccordion, SidebarCard } from 'styles/Sidebar'
import { strings } from 'utils/constants'

const SidebarGroupEdit = (props) => {
    const [isDragging,  setIsDragging] = useState(false)


    const onChangeGroupName = (e, group, index) => {
        e.preventDefault()
        group.name = e.target.value
        props.onCreateOrUpdateGroup(group, index)
    }
    const onDisableGroup = (e, group, index) => {
        e.preventDefault()
        group.enabled = !group.enabled
        props.onCreateOrUpdateGroup(group, index)
    }

    const onMoveGroup = (e, group, index) => {
        let groupContainer = e.currentTarget.closest('.group-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(groupContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('groupToMove', JSON.stringify(group))
        e.dataTransfer.setData('groupToMoveIndex', index)
        setIsDragging(true)
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
        setIsDragging(false)
    }
    
    const onDrop = (e, group, index) => {
        e.preventDefault()
        e.stopPropagation()
        let movedGroup = JSON.parse(e.dataTransfer.getData('groupToMove'))
        let movedGroupIndex = parseInt(e.dataTransfer.getData('groupToMoveIndex'))

        props.onReorderGroup(movedGroup, movedGroupIndex, group, index)
    }


    return (
        <div>
            { props.elements.map((element, index) => (
                <SidebarAccordion key={index}>
                    <SidebarCard onDragOver={e=> {onDragOver(e)}} onDrop={e=> {onDrop(e, element, index)}}>
                        <SidebarCardHeader className="group-container">
                            <SidebarIconsContainer>
                                <SidebarIcons icon="eye" onClick={e=>{onDisableGroup(e, element, index)}}/>
                                <SidebarIcons icon="trash"/>
                                <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, element, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                    <SidebarIcons icon="arrows-alt" />
                                </div>
                            </SidebarIconsContainer> 
                            { (element.enabled) ? 
                                (<SidebarGroupInput value={element.name} onChange={e=>{onChangeGroupName(e, element, index)}}/>) :
                                (<SidebarDisabledGroupLabel eventKey="0">{strings['pt-br']['disabledGroupLabel']}</SidebarDisabledGroupLabel>)
                            }                           
                        </SidebarCardHeader>
                        { (isDragging) ? 
                        (<div/>) : 
                        (<div>
                            <SidebarFormEdit onCreateOrUpdateForm={props.onCreateOrUpdateForm} forms={element.form_group} groupIndex={index}/>
                        </div>)
                        }
                    </SidebarCard>
                </SidebarAccordion>
            ))}
        </div>
    )
}

export default SidebarGroupEdit