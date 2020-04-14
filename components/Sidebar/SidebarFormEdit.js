import React from 'react'
import { strings } from 'utils/constants'
import { SidebarCardBody, SidebarAddButton, SidebarFormItem, SidebarFormInput, SidebarIconsContainer, SidebarIcons, SidebarDisabledFormLabel } from 'styles/Sidebar'


const SidebarFormEdit = (props) => {
    const onAddNewForm = (e) => {
        e.preventDefault()
        const groups = JSON.parse(JSON.stringify(props.groups))
        groups[props.groupIndex].form_group.splice(0, 0, {
            id: null,
            label_name: '',
            form_name: '',
            enabled: true,
            group: props.groups[props.groupIndex].id,
            order: 0
        })
        props.onChangeGroupState(groups)
    }

    const onChangeForm = (formIndex, newFormData) => {
        const groups = JSON.parse(JSON.stringify(props.groups))
        groups[props.groupIndex].form_group[formIndex] = newFormData
        if (![null, -1].includes(newFormData.id)) {
            props.onUpdateFormulary(newFormData, newFormData.id)
            props.onChangeGroupState(groups)
        } else {
            props.onCreateFormulary(newFormData, props.groupIndex, formIndex)
        }
    }

    const onChangeFormName = (e, index) => {
        e.preventDefault()
        props.groups[props.groupIndex].form_group[index].label_name = e.target.value
        onChangeForm(index, props.groups[props.groupIndex].form_group[index])
    }

    const onDisableForm = (e, index) => {
        e.preventDefault()
        props.groups[props.groupIndex].form_group[index].enabled = !props.groups[props.groupIndex].form_group[index].enabled
        onChangeForm(index, props.groups[props.groupIndex].form_group[index])
    }

    const onRemoveForm = (e, index) => {
        e.preventDefault()
        const groups = JSON.parse(JSON.stringify(props.groups))
        const formToRemove = groups[props.groupIndex].form_group[index]
        if (formToRemove.id) {
            props.onRemoveFormulary(formToRemove.id)
        }
        
        groups[props.groupIndex].form_group.splice(index, 1)
        props.onChangeGroupState(groups)
        props.checkIfCurrentHasBeenDeleted(groups)      
    }

    const onMoveForm = (e, index) => {
        let formContainer = e.currentTarget.closest('.form-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(formContainer, elementRect.width - elementRect.left - (elementRect.right - elementRect.width), 20)
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

    // almost equal as the onMoveField() function in FormularySectionsEdit component in the Formulary folder
    const onDrop = (e, index) => {
        e.preventDefault()
        e.stopPropagation()
        let movedFormIndex = parseInt(e.dataTransfer.getData('formToMoveIndex'))
        let movedFormGroupIndex = parseInt(e.dataTransfer.getData('formToMoveGroupIndex'))

        const movedElement = {...props.groups[movedFormGroupIndex].form_group[movedFormIndex]}
        let newArrayWithoutMoved = [...props.groups]
        newArrayWithoutMoved[movedFormGroupIndex].form_group = [...props.groups[movedFormGroupIndex].form_group.filter((_, index) => index !== movedFormIndex)]
        newArrayWithoutMoved[props.groupIndex].form_group.splice(index, 0, movedElement)
        const groups = props.reorder(newArrayWithoutMoved)
        const newFormData = groups[props.groupIndex].form_group[index]
        if (newFormData.id) {
            props.onUpdateFormulary(newFormData, newFormData.id)
        }
        props.onChangeGroupState(groups)        
    }


    return (
        <SidebarCardBody>
            <SidebarAddButton text={strings['pt-br']['addNewFormButtonLabel']} onClick={e => { onAddNewForm(e) }} />
            {props.forms.map((form, index) => {
                return (
                    <SidebarFormItem key={index} className="form-container" onDragOver={e => { onDragOver(e) }} onDrop={e => { onDrop(e, index) }}>
                        <SidebarIconsContainer>
                            <SidebarIcons size="sm" type="form" icon="eye" onClick={e=>{onDisableForm(e, index)}}/>
                            <SidebarIcons size="sm" type="form" icon="trash" onClick={e=>{onRemoveForm(e, index)}}/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveForm(e, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                <SidebarIcons size="sm" type="form" icon="arrows-alt" />
                            </div>
                        </SidebarIconsContainer>
                        {(form.enabled) ?
                            (<SidebarFormInput value={form.label_name} onChange={e => { onChangeFormName(e, index) }} />) :
                            (<SidebarDisabledFormLabel eventKey="0">{strings['pt-br']['disabledFormLabel']}</SidebarDisabledFormLabel>)
                        }
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )

}

export default SidebarFormEdit