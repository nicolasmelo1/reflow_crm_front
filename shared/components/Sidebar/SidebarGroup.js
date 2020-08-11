import React from 'react'
import { Accordion } from 'react-bootstrap'
import SidebarGroupsContainer from '../../styles/Sidebar/SidebarGroupsContainer'
import { Text } from 'react-native'
import SidebarForm from './SidebarForm' // not implemented in RN
import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar' // not implemented in RN


const SidebarGroup = (props) => {
    const doesGroupContainsSelectedFormulary = (formGroup) => {
        return formGroup.filter(formulary => formulary.form_name === props.selectedFormulary).length > 0
    }

    const renderMobile = () => {
        return (
            <SidebarGroupsContainer>
                { props.groups.map((group, index) => (
                    <Text style={{ color: '#f2f2f2', margin: 10}} key={index}>{group.name}</Text>
                ))}
            </SidebarGroupsContainer>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {(props.groups) ? props.groups.map((group, index) => (
                    <SidebarAccordion key={index}>
                        <SidebarCard>
                            <SidebarCardHeader>
                                <SidebarAccordionToggle eventKey="0" isSelected={doesGroupContainsSelectedFormulary(group.form_group)}>
                                    {group.name}
                                </SidebarAccordionToggle>
                            </SidebarCardHeader>
                            <Accordion.Collapse eventKey="0">
                                <SidebarForm forms={group.form_group} selectedFormulary={props.selectedFormulary}/>
                            </Accordion.Collapse>
                        </SidebarCard>
                    </SidebarAccordion>
                )): ''}
            </div>
        )
    }

    if (process.env['APP'] === 'web') {
        return renderWeb()
    } else {
        return renderMobile()
    }
}

export default SidebarGroup