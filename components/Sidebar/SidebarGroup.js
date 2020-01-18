import React, { useState }from 'react'
import { Accordion, Form, Row, Col } from 'react-bootstrap'
import SidebarForm from './SidebarForm'
import { SidebarDisabledGroupLabel, SidebarGroupInput, SidebarIconsContainer, SidebarIcons, SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from 'styles/Sidebar'
import { strings } from 'utils/constants'

const SidebarGroup = (props) => {
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
        e.dataTransfer.setDragImage(groupContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20);
        e.dataTransfer.setData('groupOrder', group.order);
        setIsDragging(true)
    }

    const onDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const onDragEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false)
    }
    
    const onDrop = (e, group) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const editingMode = (element, index) => {
        if (props.isEditing) {
            return (
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
                            <SidebarForm forms={element.form_group}/>
                        </div>)
                        }
                    </SidebarCard>
                </SidebarAccordion>
            )
        } else {
            return (
                <SidebarAccordion key={index}>
                    <SidebarCard>
                        <SidebarCardHeader>
                            <SidebarAccordionToggle eventKey="0">
                                {element.name}
                            </SidebarAccordionToggle>
                        </SidebarCardHeader>
                        <Accordion.Collapse eventKey="0">
                            <SidebarForm forms={element.form_group}/>
                        </Accordion.Collapse>
                    </SidebarCard>
                </SidebarAccordion>
            )
        }
    }

    return (
        <div>
            { props.elements.map((element, index) => (
                editingMode(element, index)
            ))}
        </div>
    )
}

export default SidebarGroup