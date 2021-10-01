import React from 'react'
import { View } from 'react-native'
import Styled from '../../styles'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Text = (props) => {
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.AutomationCreationInputFormularyFieldTextInput 
            type="text"
            />
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Text