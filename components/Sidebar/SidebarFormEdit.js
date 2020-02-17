import React, { useState } from 'react'
import { strings } from 'utils/constants'
import { SidebarCardBody, SidebarAddButton, SidebarFormItem, SidebarFormInput, SidebarIconsContainer, SidebarIcons, SidebarDisabledFormLabel } from 'styles/Sidebar'


const SidebarFormEdit = (props) => {
    const onAddNewForm = (e) => {
        e.preventDefault()
        props.onAddNewForm({
            id: null,
            label_name: '',
            form_name: '',
            enabled: true,
            group: props.group.id,
            order: 0
        }, props.groupIndex)
    }

    const onChangeFormName = (e, form, index) => {
        e.preventDefault()
        form.label_name = e.target.value
        props.onCreateOrUpdateForm(form, props.groupIndex, index)
    }

    const onDisableForm = (e, form, index) => {
        e.preventDefault()
        form.enabled = !form.enabled
        props.onCreateOrUpdateForm(form, props.groupIndex, index)
    }

    const onRemoveForm = (e, form, index) => {
        e.preventDefault()
        console.log('teste')
        props.onRemoveForm(form, props.groupIndex, index)
    }

    const onMoveForm = (e, form, index) => {
        let formContainer = e.currentTarget.closest('.form-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(formContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('formToMove', JSON.stringify(form))
        e.dataTransfer.setData('formToMoveIndex', index)
        e.dataTransfer.setData('formToMoveGroupIndex', props.groupIndex)
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
    }
    
    const onDrop = (e, form, index) => {
        e.preventDefault()
        e.stopPropagation()
        let movedForm = JSON.parse(e.dataTransfer.getData('formToMove'))
        let movedFormIndex = parseInt(e.dataTransfer.getData('formToMoveIndex'))
        let movedFormGroupIndex = parseInt(e.dataTransfer.getData('formToMoveGroupIndex'))

        props.onReorderForm(movedForm, movedFormIndex, movedFormGroupIndex, form, index, props.groupIndex)
    }

    
    return (
        <SidebarCardBody>
            <SidebarAddButton text={strings['pt-br']['addNewFormButtonLabel']} onClick={e=>{onAddNewForm(e)}}/>
            { props.forms.map((element, index)=> {
                return (
                    <SidebarFormItem key={index} className="form-container" onDragOver={e=>{onDragOver(e)}} onDrop={e=>{onDrop(e, element, index)}}>
                        <SidebarIconsContainer>
                            <SidebarIcons size="sm" type="form" icon="eye" onClick={e=>{onDisableForm(e, element, index)}}/>
                            <SidebarIcons size="sm" type="form" icon="trash" onClick={e=>{onRemoveForm(e, element, index)}}/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveForm(e, element, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
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