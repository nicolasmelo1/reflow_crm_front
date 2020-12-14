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
                        <div style={{borderBottom: '1px solid #bfbfbf'}}>
                            <FieldOptionsFormularyTitle>
                                {formOption.label_name}
                            </FieldOptionsFormularyTitle>
                            {formOption.form_from_connected_field ? (
                                <small style={{ margin: '0 5px', color: '#0dbf7e', fontSize: 10}}>{`Do campo `}<strong style={{ color: '#0dbf7e' }}>{formOption.form_from_connected_field.label_name}</strong></small>
                            ) : ''}
                        </div>
                        {formOption.form_fields.map(fieldOption => (
                            <FieldOptionsButtons 
                            key={fieldOption.id} 
                            onClick={(e) => {props.onClickOption(`fieldVariable-${fieldOption.id} fromConnectedField-${formOption.form_from_connected_field ? formOption.form_from_connected_field.id : ''}`)}}
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