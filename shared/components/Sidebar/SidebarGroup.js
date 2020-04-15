import React from 'react'
import { Accordion } from 'react-bootstrap'
import SidebarForm from './SidebarForm'
import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar'

const SidebarGroup = (props) => {
    return (
        <div>
            { props.elements.map((element, index) => (
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
            ))}
        </div>
    )
}

export default SidebarGroup