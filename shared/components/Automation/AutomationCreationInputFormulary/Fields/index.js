import React from 'react'
import { View } from 'react-native'
import Datetime from './Datetime'
import Dynamic from './Dynamic'
import Number from './Number'
import Select from './Select'
import Text from './Text'
import Styled from '../../styles'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Field = (props) => {
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Styled.AutomationCreationInputFormularyFieldLabel>
                    {props.field.name}
                </Styled.AutomationCreationInputFormularyFieldLabel>
                {(function (){
                    switch (props.fieldTypeName) {
                        case 'text':
                            return <Text/>
                        case 'number':
                            return <Number/>
                        case 'date':
                            return <Datetime/>
                        case 'select': 
                            return <Select
                            {...props}
                            />
                        case 'dynamic':
                            return <Dynamic/>
                        default:
                            return <Text/>
                    }
                })()}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Field