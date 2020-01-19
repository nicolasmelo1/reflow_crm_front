import React from 'react'
import { strings } from 'utils/constants'
import { SidebarCardBody, SidebarFormItem, SidebarFormInput, SidebarIconsContainer, SidebarIcons, SidebarDisabledFormLabel } from 'styles/Sidebar'

const SidebarFormEdit = (props) => {

    const onChangeFormName = (e, form, index) => {
        e.preventDefault()
        form.label_name = e.target.value
        props.onCreateOrUpdateForm(form, props.groupIndex, index)
    }

    const onDisableForm = (e, form, index) => {
        e.preventDefault()
        form.enabled = !form.enabled
        props.onCreateOrUpdateGroup(form, props.groupIndex, index)
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
        <SidebarCardBody>
            { props.forms.map((element, index)=> {
                return (
                    <SidebarFormItem key={index}>
                        <SidebarIconsContainer>
                            <SidebarIcons size="sm" type="form" icon="eye" onClick={e=>{onDisableForm(e, element, index)}}/>
                            <SidebarIcons size="sm" type="form" icon="trash"/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, element)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                <SidebarIcons size="sm" type="form" icon="arrows-alt" />
                            </div>
                        </SidebarIconsContainer> 
                        { (element.enabled) ? 
                            (<SidebarFormInput value={element.label_name} onChange={e=>{onChangeFormName(e, element, index)}}/>) :
                            (<SidebarDisabledFormLabel eventKey="0">{strings['pt-br']['disabledFormLabel']}</SidebarDisabledFormLabel>)
                        }                        
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
    
}

export default SidebarFormEdit