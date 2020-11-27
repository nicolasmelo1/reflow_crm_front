import React from 'react'
import { View } from 'react-native'
import { FieldOptionsContainer } from '../../styles/PDFGenerator'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FieldSelectorOptionBox = (props) => {
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <FieldOptionsContainer 
            top={props.top}
            left={props.left}
            >
                {props.fieldOptions.map(fieldOption=> (
                    <button key={fieldOption.id} style={{display: 'block'}} onClick={(e) => {props.onClickOption(fieldOption.id)}}>
                        {fieldOption.label_name}
                    </button>
                ))}
            </FieldOptionsContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FieldSelectorOptionBox