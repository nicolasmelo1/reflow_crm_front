import React from 'react'
import { Modal, SafeAreaView, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    FieldOptionsContainer, 
    FieldOptionsButtons,
    FieldOptionsFormularyTitle,
    PDFGeneratorCreatorEditorButtonsContainer,
    PDFGeneratorCreatorEditorTemplateCancelButton
} from '../../styles/PDFGenerator'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FieldSelectorOptionBox = (props) => {
    const renderMobile = () => {
        return (
            <Modal animationType={'slide'}>
                <SafeAreaView>
                    <PDFGeneratorCreatorEditorButtonsContainer>
                        <PDFGeneratorCreatorEditorTemplateCancelButton onPress={e=>props.setIsUnmanagedFieldSelectorOpen(false)}>
                            <FontAwesomeIcon icon={'times'} />
                        </PDFGeneratorCreatorEditorTemplateCancelButton>
                    </PDFGeneratorCreatorEditorButtonsContainer>
                    <FieldOptionsContainer>
                        {props.fieldOptions.map(formOption=> (
                            <View key={formOption.id}>
                                <FieldOptionsFormularyTitle>
                                    {formOption.label_name}
                                </FieldOptionsFormularyTitle>
                                {formOption.form_from_connected_field ? (
                                    <View>
                                        <Text style={{ margin: '0 5px', color: '#0dbf7e', fontSize: 10}}>{`Do campo `}</Text>
                                        <Text style={{ color: '#0dbf7e', fontSize: 10 }}>{formOption.form_from_connected_field.label_name}</Text>
                                    </View>
                                ) : null}
                                {formOption.form_fields.map((fieldOption, index) => (
                                    <FieldOptionsButtons 
                                    isFirst={index === 0}
                                    key={fieldOption.id} 
                                    onPress={(e) => {props.onClickOption(`fieldVariable-${fieldOption.id} fromConnectedField-${formOption.form_from_connected_field ? formOption.form_from_connected_field.id : ''}`)}}
                                    >
                                        <Text>
                                            {fieldOption.label_name}
                                        </Text>
                                    </FieldOptionsButtons>
                                ))}
                            </View>
                        ))}
                    </FieldOptionsContainer>
                </SafeAreaView>
            </Modal>
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