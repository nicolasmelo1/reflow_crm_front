import React from 'react'
import { Accordion } from 'react-bootstrap'
import SidebarGroupsContainer from '../../styles/Sidebar/SidebarGroupsContainer'
import { Text } from 'react-native'
//import SidebarForm from './SidebarForm'
//import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar'

const SidebarGroup = (props) => {
    if (process.env['APP'] === 'web') {
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
    } else {
        return (
            <SidebarGroupsContainer>
                { props.elements.map((element, index) => (
                    <Text key={index}>{element.name}</Text>
                ))}
            </SidebarGroupsContainer>
        )
    }
}

export default SidebarGroup