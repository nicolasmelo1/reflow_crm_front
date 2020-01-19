import React from 'react'
import { Card, Row, Col, Form} from 'react-bootstrap'
import { paths } from 'utils/constants'
import Link from 'next/link';
import { SidebarCardBody, SidebarFormItem, SidebarFormInput, SidebarIconsContainer, SidebarIcons } from 'styles/Sidebar'

const SidebarFormEdit = (props) => {

    const onChangeFormName = (e, form, index) => {
        e.preventDefault()
        form.label_name = e.target.value
        props.onCreateOrUpdateForm(form, props.groupIndex, index)
    }

    const onDisableForm = (e) => {
        e.preventDefault()
    }

    
    return (
        <SidebarCardBody>
            { props.forms.map((element, index)=> {
                return (
                    <SidebarFormItem key={index}>
                        <SidebarIconsContainer>
                            <SidebarIcons size="sm" type="form" icon="eye" onClick={e=>{onDisableForm(e, element)}}/>
                            <SidebarIcons size="sm" type="form" icon="trash"/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveGroup(e, element)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                <SidebarIcons size="sm" type="form" icon="arrows-alt" />
                            </div>
                        </SidebarIconsContainer> 
                        <SidebarFormInput value={element.label_name} onChange={e=>{onChangeFormName(e, element, index)}}/>
                    
                    </SidebarFormItem>
                )
            })}
        </SidebarCardBody>
    )
    
}

export default SidebarFormEdit