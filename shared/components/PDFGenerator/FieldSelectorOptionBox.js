import React from 'react'
import { View } from 'react-native'
import { 
    FieldOptionsContainer, 
    FieldOptionsButtons,
    FieldOptionsFormularyTitle
} from '../../styles/PDFGenerator'

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
                {props.fieldOptions.map(formOption=> (
                    <div key={formOption.id}>
                        <FieldOptionsFormularyTitle>
                            {formOption.label_name}
                        </FieldOptionsFormularyTitle>
                        {formOption.form_fields.map(fieldOption => (
                            <FieldOptionsButtons 
                            key={fieldOption.id} 
                            onClick={(e) => {props.onClickOption(fieldOption.id)}}
                            >
                                {fieldOption.label_name}
                            </FieldOptionsButtons>
                        ))}
                    </div>
                ))}
            </FieldOptionsContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FieldSelectorOptionBox