import React,  { useState, useEffect } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../../utils/constants'
import delay from '../../../utils/delay';
import Select from '../../Utils/Select';
import { FormulariesEdit } from '../../../styles/Formulary'
import axios from 'axios'

const makeDelay = delay(1000)

const Number = (props) => {
    const source = React.useRef(axios.CancelToken.source())
    const [isFormulaInvalid, setIsFormulaInvalid] = useState(false)
    const [isEditingFormula, setIsEditingFormula] = useState(false)
    const [initialNumberMaskType, setInitialNumberMaskType] = useState([])
    const [numberMaskTypes, setNumberMaskTypes] = useState([])
    
    const getFormularyFields = () => {
        const formularyData = props.retrieveFormularyData()
        let formularyFields = []
        if (formularyData.depends_on_form) {
            formularyData.depends_on_form.forEach(section => {
                section.form_fields.forEach(field => {
                    if (field.id !== null && field.uuid !== props.field.uuid) {
                        formularyFields.push({
                            value: field.id,
                            label: field.label_name,
                            name: field.name
                        })
                    }
                })
            })
        }
        return formularyFields
    }

    const onChangeFieldNumberMask = (data) => {
        props.field.number_configuration_number_format_type = data[0]
        props.onUpdateField(props.field)
    }

    const getFormulaOccurences = (formulaText) => {
        const occurrences = (formulaText.match(/{{(\w+)?}}/g) || []).map(variable=> {
            return variable.replace('{{', '').replace('}}', '')
        })
        return occurrences
    }

    const formatFormula = (value, occurences) => {
        let formulaText = (value) ? value : ''
        const formattedFormulaText = formulaText.replace(/{{(\w+)?}}/g, '{{}}')
        const backendText = formattedFormulaText.split('{{}}')
        const userText = formattedFormulaText.split('{{}}')
        let counter = 1

        for (let i=0; i<occurences.length; i++) {
            const occurrence = [null, undefined].includes(occurences[i]) ? '' : occurences[i].toString() 
            const fieldVariable = getFormularyFields().filter(field => field.value.toString() === occurrence || field.name.toString() === occurrence)
            if (fieldVariable.length > 0) {
                backendText.splice(i+counter, 0,`{{${fieldVariable[0].value}}}`)
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
        occurences[index] = data.length > 0 ? data[0] : null
        props.field.formula_configuration = formatFormula(formulaText, occurences).backendText
        testFormula(props.field.formula_configuration)
        props.onUpdateField(props.field)
    }

    const onChangeFormula = (data) => {
        const occurences = getFormulaOccurences(data)
        const backendText = formatFormula(data, occurences).backendText
        props.field.formula_configuration = backendText
        testFormula(props.field.formula_configuration)
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

    useEffect(() => {
        testFormula(props.field.formula_configuration ? props.field.formula_configuration : '')
        return () => {
            source.current.cancel()
        }
    }, [])

    const formulaVariablesOptions = getFormularyFields()

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