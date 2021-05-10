import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome' 
import SidebarGroupsContainer from '../../styles/Sidebar/SidebarGroupsContainer'
import { Text } from 'react-native'
import SidebarForm from './SidebarForm' // not implemented in RN
import { 
    SidebarAccordionToggle, 
    SidebarCard 
} from '../../styles/Sidebar' // not implemented in RN
import Overlay from '../../styles/Overlay'


const SidebarGroup = (props) => {
    const [isFormulariesOpen, setIsFormulariesOpen] = useState(false)

    const getFirstLetterBetweenSpacesOfString = (string) => {
        const stringSplittedSpaces = string.split(' ')
        let newString = ''
        stringSplittedSpaces.forEach(word => {
            newString = newString + word.charAt(0)
        })
        return newString
    }

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
                    {props.sidebarIsOpen ? (
                        <SidebarAccordionToggle 
                        isSelected={doesGroupContainsSelectedFormulary(props.group.form_group)}
                        onClick={e => {setIsFormulariesOpen(!isFormulariesOpen)}}
                        >
                            {props.group.name}&nbsp;
                            <FontAwesomeIcon icon={isFormulariesOpen ? 'chevron-up' : 'chevron-down' }/>
                        </SidebarAccordionToggle>
                    ) : (
                        <Overlay
                        placement={'right'}
                        text={props.group.name}
                        >
                            <SidebarAccordionToggle 
                            isSelected={doesGroupContainsSelectedFormulary(props.group.form_group)}
                            onClick={e => {setIsFormulariesOpen(!isFormulariesOpen)}}
                            >
                                {getFirstLetterBetweenSpacesOfString(props.group.name)}&nbsp;
                                <FontAwesomeIcon icon={isFormulariesOpen ? 'chevron-up' : 'chevron-down' }/>
                            </SidebarAccordionToggle>
                        </Overlay>
                    )}
                </SidebarCard>
                {isFormulariesOpen ? (
                    <SidebarForm
                    forms={props.group.form_group} 
                    sidebarIsOpen={props.sidebarIsOpen}
                    getFirstLetterBetweenSpacesOfString={getFirstLetterBetweenSpacesOfString}
                    selectedFormulary={props.selectedFormulary}
                    />
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