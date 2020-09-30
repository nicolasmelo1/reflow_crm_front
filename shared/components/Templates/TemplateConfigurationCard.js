import React from 'react'
import { View } from 'react-native'
import {
    TemplatesConfigurationCardContainer
} from '../../styles/Templates'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateConfigurationCard = (props) => {
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesConfigurationCardContainer>
                <h2>{props.templateConfiguration.display_name}</h2>
            </TemplatesConfigurationCardContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfigurationCard