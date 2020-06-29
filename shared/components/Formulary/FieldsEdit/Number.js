import React,  { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { types, strings } from '../../../utils/constants'
import delay from '../../../utils/delay';
import Select from '../../Utils/Select';
import { FormulariesEdit } from '../../../styles/Formulary'
import axios from 'axios'

const makeDelay = delay(1000)

const Number = (props) => {
    const source = React.useRef(axios.CancelToken.source())
    const formularyData = useSelector(state=>state.home.formulary.update)
    const formularyFields = formularyData.depends_on_form ? [].concat.apply([], formularyData.depends_on_form.map(group => group.form_fields.map(field => field))) : []
    const [isFormulaInvalid, setIsFormulaInvalid] = useState(false)
    const [isEditingFormula, setIsEditingFormula] = useState(false)
    const [initialNumberMaskType, setInitialNumberMaskType] = useState([])
    const [numberMaskTypes, setNumberMaskTypes] = useState([])
    
    const onChangeFieldNumberMask = (data) => {
        props.field.number_configuration_number_format_type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const getFormulaOccurences = (formulaText) => {
        return (formulaText.match(/{{(\w+)?}}/g) || []).map(variable=> variable.replace('{{', '').replace('}}', ''))
    }

    const formatFormula = (value, occurences) => {
        let formulaText = (value) ? value : ''
        const formattedFormulaText = formulaText.replace(/{{(\w+)?}}/g, '{{}}')
        const backendText = formattedFormulaText.split('{{}}')
        const userText = formattedFormulaText.split('{{}}')
        let counter = 1

        for (let i=0; i<occurences.length; i++) {
            const fieldVariable = formularyFields.filter(field => field.id.toString() === occurences[i] || field.name.toString() === occurences[i])
            if (fieldVariable.length > 0) {
                backendText.splice(i+counter, 0,`{{${fieldVariable[0].id}}}`)
                userText.splice(i+counter, 0,`{{${fieldVariable[0].name}}}`)
            } else {
                backendText.splice(i+counter, 0,`{{}}`)
                userText.splice(i+counter, 0,`{{}}`)
            }
            counter++

        }
        return {
            userText: userText.join(''),
            backendText: backendText.join('')
        }
    }
   
    const testFormula = (text) => {
        makeDelay(() => {
            if (text !== '') {
                props.onTestFormularySettingsFormulaField(source.current, props.formId, text).then(response => {
                    if (response && response.status !== 200) {
                        setIsFormulaInvalid(true)
                    } else {
                        setIsFormulaInvalid(false)
                    }
                })
            }
        })
    }

    const onChangeFormulaVariable = (index, data) => {
        let formulaText = (props.field.formula_configuration) ? props.field.formula_configuration : ''
        let occurences = getFormulaOccurences(formulaText)
        occurences[index] = data[0]
        props.field.formula_configuration = formatFormula(formulaText, occurences).backendText
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)

        testFormula(props.field.formula_configuration)
    }

    
    const onChangeFormula = (data) => {
        const occurences = getFormulaOccurences(data)
        const backendText = formatFormula(data, occurences).backendText
        props.field.formula_configuration = backendText
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)

        testFormula(props.field.formula_configuration)
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

    useEffect(() => {
        testFormula(props.field.formula_configuration ? props.field.formula_configuration : '')
        return () => {
            source.current.cancel()
        }
    }, [])

    const formulaVariablesOptions = formularyFields.filter(field=> field.id !== null).map(field => ({ value: field.id.toString(), label: field.label_name, field_name: field.name }))
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
                    const initialFormulaVariablesOptions = formulaVariablesOptions.filter(field => field.value.toString() === variable)
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
        </div>
    )
}

export default Number