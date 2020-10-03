import React, { useState } from 'react'
import { View } from 'react-native'
import TemplateConfigurationForm from './TemplateConfigurationForm'
import {
    TemplatesConfigurationCardContainer,
    TemplatesConfigurationCardLabel
} from '../../styles/Templates'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateConfigurationCard = (props) => {
    const [isFormOpen, setIsFormOpen] = useState(false)

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <TemplatesConfigurationCardContainer onClick={e=> setIsFormOpen(true)}>
                    <TemplatesConfigurationCardLabel>
                        {props.templateConfiguration.display_name}
                    </TemplatesConfigurationCardLabel>
                    
                </TemplatesConfigurationCardContainer>
                <TemplateConfigurationForm 
                types={props.types}
                templateConfiguration={props.templateConfiguration}
                onChangeTemplateConfigurationData={props.onChangeTemplateConfigurationData}
                dependentForms={props.dependentForms}
                formulariesOptions={props.formulariesOptions}
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                />
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfigurationCard