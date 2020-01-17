import React from 'react'
import { Card, Accordion, Form } from 'react-bootstrap'
import SidebarForm from './SidebarForm'
import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from 'styles/Sidebar'


const SidebarGroup = (props) => {
    const editingMode = (element, index) => {
        if (props.isEditing) {
            return (
                <SidebarAccordion key={index}>
                    <SidebarCard>
                        <SidebarCardHeader>
                            <Form.Control value={element.name}/>
                        </SidebarCardHeader>
                        <div>
                            <SidebarForm forms={element.form_group}/>
                        </div>
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