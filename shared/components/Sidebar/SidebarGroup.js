import React from 'react'
import { Accordion } from 'react-bootstrap'
import SidebarGroupsContainer from '../../styles/Sidebar/SidebarGroupsContainer'
import { Text } from 'react-native'
import SidebarForm from './SidebarForm' // not implemented in RN
import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar' // not implemented in RN

const SidebarGroup = (props) => {

    const renderWeb = () => {
        return (
            <div>
                {(props.elements) ? props.elements.map((element, index) => (
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
                )): ''}
            </div>
        )
    }

    const renderMobile = () => {
        return (
            <SidebarGroupsContainer>
                { props.elements.map((element, index) => (
                    <Text key={index}>{element.name}</Text>
                ))}
            </SidebarGroupsContainer>
        )
    }

    if (process.env['APP'] === 'web') {
        return renderWeb()
    } else {
        return renderMobile()
    }
}

export default SidebarGroup