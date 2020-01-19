import React, {useState} from 'react'
import SidebarFormEdit from './SidebarFormEdit'
import { SidebarDisabledGroupLabel, SidebarGroupInput, SidebarIconsContainer, SidebarIcons, SidebarCardHeader, SidebarAccordion, SidebarCard } from 'styles/Sidebar'
import { strings } from 'utils/constants'

const SidebarGroupEdit = (props) => {
    const [isDragging,  setIsDragging] = useState(false)


    const onChangeGroupName = (e, group) => {
        e.preventDefault()
        group.name = e.target.value
        props.onCreateOrUpdateGroup(group)
    }
    const onDisableGroup = (e, group) => {
        e.preventDefault()
        group.enabled = !group.enabled
        props.onCreateOrUpdateGroup(group)
    }

    const onMoveGroup = (e, group) => {
        let groupContainer = e.currentTarget.closest('.group-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(groupContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('groupToMove', JSON.stringify(group))
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
        props.setIsDragging(false)
    }
    
    const onDrop = (e, group) => {
        e.preventDefault()
        e.stopPropagation()
        let movedGroup = JSON.parse(e.dataTransfer.getData('groupToMove'))
        props.onReorderGroup(movedGroup, group)
    }


    return (
        <div>
            { props.elements.map((element, index) => (
                <SidebarAccordion key={index}>
                    <SidebarCard onDragOver={e=> {onDragOver(e)}} onDrop={e=> {onDrop(e, element)}}>
                        <SidebarCardHeader className="group-container">
                            <SidebarIconsContainer>
                                <SidebarIcons icon="eye" onClick={e=>{onDisableGroup(e, element)}}/>
                                <SidebarIcons icon="trash"/>
                                <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, element)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                    <SidebarIcons icon="arrows-alt" />
                                </div>
                            </SidebarIconsContainer> 
                            { (element.enabled) ? 
                                (<SidebarGroupInput value={element.name} onChange={e=>{onChangeGroupName(e, element)}}/>) :
                                (<SidebarDisabledGroupLabel eventKey="0">{strings['pt-br']['disabledGroupLabel']}</SidebarDisabledGroupLabel>)
                            }                           
                        </SidebarCardHeader>
                        { (isDragging) ? 
                        (<div/>) : 
                        (<div>
                            <SidebarFormEdit onCreateOrUpdateForm={props.onCreateOrUpdateForm} forms={element.form_group}/>
                        </div>)
                        }
                    </SidebarCard>
                </SidebarAccordion>
            ))}
        </div>
    )
}

export default SidebarGroupEdit