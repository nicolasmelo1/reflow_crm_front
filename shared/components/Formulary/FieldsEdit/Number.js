import React,  { useState, useEffect } from 'react';
import { types, strings } from '../../../utils/constants';
import delay from '../../../utils/delay';
import Select from '../../Utils/Select';
import { FormulariesEdit } from '../../../styles/Formulary'
import axios from 'axios'

const Number = (props) => {
    const source = React.useRef(axios.CancelToken.source())
    const makeDelay = delay(1000)

    const [isFormulaInvalid, setIsFormulaInvalid] = useState(false)
    const [isEditingFormula, setIsEditingFormula] = useState(false)
    const [initialNumberMaskType, setInitialNumberMaskType] = useState([])
    const [numberMaskTypes, setNumberMaskTypes] = useState([])
    
    const onChangeFieldNumberMask = (data) => {
        props.field.number_configuration_number_format_type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeFormula = (data) => {
        props.field.formula_configuration = data
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)

        makeDelay(() => {
            props.onTestFormularySettingsFormulaField(source.current, props.formId, data).then(response => {
                if (response && response.status !== 200) {
                    setIsFormulaInvalid(true)
                } else {
                    setIsFormulaInvalid(false)
                }
            })
        })
    }

    useEffect(() => {
        return () => {
            source.current.cancel()
        }
    }, [])

    useEffect(() => {
        setInitialNumberMaskType(
            props.types.data.field_number_format_type
                .filter(numberFormatType=> numberFormatType.id === props.field.number_configuration_number_format_type)
                .map(numberFormatType=> { return { value: numberFormatType.id, label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type) } })
        )
    }, [props.field.number_configuration_number_format_type, props.types.data.field_number_format_type])

    useEffect(() => {
        setNumberMaskTypes(props.types.data.field_number_format_type.map(numberFormatType=> { return { value: numberFormatType.id, label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type) } }))
    }, [props.types.data.field_number_format_type])

    return (
        <div>
            <FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldNumberTypeSelectorLabel']}
                </FormulariesEdit.FieldFormLabel>
                <FormulariesEdit.SelectorContainer>
                    <Select 
                        options={numberMaskTypes} 
                        initialValues={initialNumberMaskType} 
                        onChange={onChangeFieldNumberMask} 
                    />
                </FormulariesEdit.SelectorContainer>
            </FormulariesEdit.FieldFormFieldContainer>
            <FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldNumberFormulaLabel']}
                </FormulariesEdit.FieldFormLabel>
                <FormulariesEdit.InputField
                error={isFormulaInvalid}
                type="text" 
                value={props.field.formula_configuration ? props.field.formula_configuration : ''} 
                onChange={e=>onChangeFormula(e.target.value)}
                onFocus={e=>setIsEditingFormula(true)} 
                onBlur={e=>setIsEditingFormula(false)}
                />
                {isEditingFormula ? (
                    <FormulariesEdit.FormulaExplanationContainer>
                        <FormulariesEdit.FormulaExplanationLabel>{strings['pt-br']['formularyEditFieldFormulaExplanationLabel']}:</FormulariesEdit.FormulaExplanationLabel>
                        <FormulariesEdit.FormulaExplanationDescription>{strings['pt-br']['formularyEditFieldFormulaExplanationDescription1']}</FormulariesEdit.FormulaExplanationDescription>
                        <FormulariesEdit.FormulaExplanationDescription>{strings['pt-br']['formularyEditFieldFormulaExplanationDescription2']}</FormulariesEdit.FormulaExplanationDescription>
                        <FormulariesEdit.FormulaExplanationDescription>
                            {strings['pt-br']['formularyEditFieldFormulaExplanationDescription3Initial']}
                            <strong style={{color: 'red'}}>{strings['pt-br']['formularyEditFieldFormulaExplanationDescription3Red']}</strong>  
                            {strings['pt-br']['formularyEditFieldFormulaExplanationDescription3End']}
                        </FormulariesEdit.FormulaExplanationDescription>
                        <FormulariesEdit.FormulaExplanationDescription>{strings['pt-br']['formularyEditFieldFormulaExplanationDescription4']}</FormulariesEdit.FormulaExplanationDescription>
                    </FormulariesEdit.FormulaExplanationContainer>
                ) : ''}
            </FormulariesEdit.FieldFormFieldContainer>
        </div>
    )
}

export default Number