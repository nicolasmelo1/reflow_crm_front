import React,  { useState, useEffect } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../../utils/constants'
import delay from '../../../utils/delay'
import Select from '../../Utils/Select'
import { FormulariesEdit } from '../../../styles/Formulary'


const Number = (props) => {
    const [initialNumberMaskType, setInitialNumberMaskType] = useState([])
    const [numberMaskTypes, setNumberMaskTypes] = useState([])

    const onChangeFieldNumberMask = (data) => {
        props.field.number_configuration_number_format_type = data[0]
        props.onUpdateField(props.field)
    }   

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

    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    const renderWeb = () => {
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
                {/*
                <FormulariesEdit.FieldFormFieldContainer>
                    <FormulariesEdit.FieldFormLabel>
                        {strings['pt-br']['formularyEditFieldNumberFormulaLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.InputField
                    autoComplete={'whathever'}
                    error={isFormulaInvalid}
                    type="text"
                    value={props.field.formula_configuration ? formatFormula(props.field.formula_configuration, getFormulaOccurences(props.field.formula_configuration)).userText : ''} 
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
                    {getFormulaOccurences(props.field.formula_configuration ? props.field.formula_configuration : '').map((variable, index) => {
                        const initialFormulaVariablesOptions = formulaVariablesOptions.filter(field => field.value.toString() === variable.toString())
                        return (
                            <FormulariesEdit.SelectorContainer key={index}>
                                <Select 
                                    options={formulaVariablesOptions} 
                                    initialValues={initialFormulaVariablesOptions} 
                                    onChange={(data) => onChangeFormulaVariable(index, data)} 
                                />
                            </FormulariesEdit.SelectorContainer>
                        )
                    })}
                </FormulariesEdit.FieldFormFieldContainer>
                */}
            </div>
        )
    }
    
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Number