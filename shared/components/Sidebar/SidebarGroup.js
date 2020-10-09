import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome' 
import SidebarGroupsContainer from '../../styles/Sidebar/SidebarGroupsContainer'
import { Text } from 'react-native'
import SidebarForm from './SidebarForm' // not implemented in RN
import { SidebarAccordionToggle, SidebarCardHeader, SidebarAccordion, SidebarCard } from '../../styles/Sidebar' // not implemented in RN


const SidebarGroup = (props) => {
    const [isFormulariesOpen, setIsFormulariesOpen] = useState(false)

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
                <SidebarCard>
                    <button 
                    style={{ border: 0, backgroundColor: 'transparent', width: '100%'}} 
                    onClick={e => {setIsFormulariesOpen(!isFormulariesOpen)}}
                    >
                        <SidebarCardHeader>
                            <SidebarAccordionToggle isSelected={doesGroupContainsSelectedFormulary(props.group.form_group)}>
                                {props.group.name}&nbsp;<FontAwesomeIcon icon={isFormulariesOpen ? 'chevron-up' : 'chevron-down' }/>
                            </SidebarAccordionToggle>
                        </SidebarCardHeader>
                    </button>
                </SidebarCard>
                {isFormulariesOpen ? (
                    <SidebarForm forms={props.group.form_group} selectedFormulary={props.selectedFormulary}/>
                ) : ''}
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