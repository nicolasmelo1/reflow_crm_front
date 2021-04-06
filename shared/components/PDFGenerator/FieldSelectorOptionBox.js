import React, { useEffect, useState } from 'react'
import { Modal, SafeAreaView, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    FieldOptionsContainer, 
    FieldOptionsButtons,
    FieldOptionsFormularyTitle,
    FieldOptionsSearchBox,
    PDFGeneratorCreatorEditorButtonsContainer,
    PDFGeneratorCreatorEditorTemplateCancelButton
} from '../../styles/PDFGenerator'

/**
 * This component is responsible for opening a modal in front of the rich text so the user can select the
 * field to use as variable.
 * 
 * On the rich text we have a thing called unhandled content. Which are contents not handled by the rich text itself
 * but instead by the parent component that composes it.
 * 
 * On the PDF templates the user can select fields to be used as variables, these fields are fields from the formularies
 * so when we are downloading the pdf template we will substitute the field by the actual value of the formulary.
 * 
 * We can insert field variables when the user types '@' (see unmanaged in PDFGeneratorCreatorEditor component)
 * 
 * @param {Object} fieldOptions - All of the field options to display to the user. This object is actually a list
 * of formularies and on each formulary we can loop though the fields.
 * @param {Function} onClickOption - A function to handle when the user clicks on a option here.
 * @param {Function} setIsUnmanagedFieldSelectorOpen - MOBILE ONLY - we need this so we can close the modal.
 * @param {BigInteger} top - WEB ONLY - when we display the modal, it's displayed absolute positioned with this we can display
 * the modal next to the caret. This represents the number of pixels the element should be from the top.
 * @param {BigInteger} left - WEB ONLY - when we display the modal, it's displayed absolute positioned with this we can display
 * the modal next to the caret. This represents the number of pixels the element should be from the left.
 */
const FieldSelectorOptionBox = (props) => {
    const fieldSelectorBoxRef = React.useRef()
    const [search, setSearch] = useState('')
    const [translate3D, setTranslate3D] = useState(0)

    /**
     * WEB ONLY
     * 
     * This is used to render the fieldSelector option box on the top or down if the field is close to the bottom of
     * the page we move the selector up, otherwise we keep it down.
     *
     * @param {Event} e - The event object emitted by the browser from the "scroll" event.
     */
    const topOrDown = (e) => {
        if (e) e.preventDefault()
        if(fieldSelectorBoxRef.current){
            const rect = fieldSelectorBoxRef.current.getBoundingClientRect();
            if (rect.top + fieldSelectorBoxRef.current.offsetHeight > window.innerHeight){
                setTranslate3D(-fieldSelectorBoxRef.current.offsetHeight + 20)
            } else {
                setTranslate3D(0)
            }
        }
    }

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            topOrDown()
            document.addEventListener("scroll", topOrDown)
        }
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("scroll", topOrDown)
            }
        }
    }, [])

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
            translate={translate3D}
            ref={fieldSelectorBoxRef}
            >
                <FieldOptionsSearchBox 
                placeholder='Buscar'
                autoFocus={true} 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                {props.fieldOptions.map(formOption=> (
                    <div key={`${formOption.id}${formOption?.form_from_connected_field?.label_name}`}>
                        <div style={{borderBottom: '1px solid #bfbfbf'}}>
                            <FieldOptionsFormularyTitle>
                                {formOption.label_name}
                            </FieldOptionsFormularyTitle>
                            {formOption.form_from_connected_field ? (
                                <small style={{ margin: '0 5px', color: '#0dbf7e', fontSize: 10}}>{`Do campo `}<strong style={{ color: '#0dbf7e' }}>{formOption.form_from_connected_field.label_name}</strong></small>
                            ) : ''}
                        </div>
                        {formOption.form_fields.filter(fieldOption => search !== '' ? fieldOption.label_name.includes(search) : true).map(fieldOption => (
                            <FieldOptionsButtons 
                            key={`${formOption.id}${fieldOption.id}`} 
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
