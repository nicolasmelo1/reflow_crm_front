import React, { useEffect } from 'react'
import { View } from 'react-native'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'
import Select from '../../Utils/Select'
import initializeEditor from '../../../utils/reflowFormulasLanguage'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Formula = (props) => {
    const textEditorRef = React.useRef()
    const editorRef = React.useRef()
    const formularyFields = getFormularyFields()

    const fieldIdByFieldName = (fieldName) => {
        for (let i=0; i<formularyFields.length; i++) {
            if (fieldName === formularyFields[i].name) {
                return formularyFields[i].value
            }
        }
        return ''
    }

    const fieldNameByFieldId = (fieldId) => {
        for (let i=0; i<formularyFields.length; i++) {
            if (fieldId === formularyFields[i].value) {
                return formularyFields[i].name
            }
        }
        return ''
    }

    const createEditor = () => {
        const context = {
			boolean: {
				true: 'True',
				false: 'False'
			},
			number: {
				float: '(std.digit+ ("," std.digit+)?) '
			},
			null: 'None',
			positionalArgumentSeparator: ';'
		} 

        if (editorRef.current) {
            editorRef.current.destroy()	
		} 

        let variableIndex = 0
        let formattedFormula = []
        let splittedFormula = props.field.formula_configuration.split(/{{(\w+)?}}/g)
        for(let i=0; i<splittedFormula.length; i++) {
            if (splittedFormula[i] !== undefined) {
                let text = splittedFormula[i]
                if (splittedFormula[i] === '' && props.field.field_formula_variables[variableIndex]) {
                    text = `{{${fieldNameByFieldId(props.field.field_formula_variables[variableIndex].variable_id)}}}`
                    variableIndex++
                }
                formattedFormula.push(text)
            }
        }

        editorRef.current = initializeEditor(
            textEditorRef.current, 
            context, 
            dispatch, 
            {doc: formattedFormula.join('')}
        )
    }

    function getFormularyFields() {
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
    
    const getFormulaOccurences = (formulaText) => {
        const occurrences = (formulaText.match(/{{(\w+)?}}/g) || []).map(variable=> {
            variable = variable.replace('{{', '').replace('}}', '') 

            const occurrence = fieldIdByFieldName(variable)
            
            return occurrence !== '' ? occurrence : variable
        })
        return occurrences
    }

    const changeFormulaVariables = (occurrences) => {
        props.field.field_formula_variables = []
        for(let i=0; i<occurrences.length; i++) {
            props.field.field_formula_variables.push(
                {variable_id: occurrences[i]}
            )
        }
    }

    const onChangeFormulaVariable = (index, data) => {
        let occurences = getFormulaOccurences(props.field.formula_configuration)
        occurences[index] = data.length > 0 ? data[0] : null
        changeFormulaVariables(occurences)
        createEditor()
        props.onUpdateField(props.field)
    }


    const dispatch = () => {
        return (transaction) => {
            if (transaction.effects.length > 0 && transaction?.state?.doc) {
                props.field.formula_configuration = transaction?.state?.doc.text.join('\n')
                const occurrences = getFormulaOccurences(props.field.formula_configuration)
                changeFormulaVariables(occurrences)
                props.onUpdateField(props.field)
            }
            editorRef.current.update([transaction])
        } 
    }
    
    useEffect(() => {
        createEditor()
    }, [])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                Formula
                <div ref={textEditorRef}></div>
                {props.field.field_formula_variables.map((fieldFormulaVariable, index) => {
                        const initialFormulaVariablesOptions = formularyFields.filter(field => field.value.toString() === fieldFormulaVariable.variable_id.toString())
                        return (
                            <FormulariesEdit.SelectorContainer key={index}>
                                <Select 
                                    options={formularyFields} 
                                    initialValues={initialFormulaVariablesOptions} 
                                    onChange={(data) => onChangeFormulaVariable(index, data)} 
                                />
                            </FormulariesEdit.SelectorContainer>
                        )
                    })}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula