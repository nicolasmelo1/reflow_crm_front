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
    const documentLengthRef = React.useRef(0)
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
        let splittedFormula = props.field.formula_configuration.split(/{{\w*?}}/g)
        for(let i=0; i<splittedFormula.length; i++) {
            if (splittedFormula[i] !== undefined) {
                formattedFormula.push(splittedFormula[i])
            }
            if (props.field.field_formula_variables[variableIndex]) {
                const text = `{{${fieldNameByFieldId(props.field.field_formula_variables[variableIndex].variable_id)}}}`
                variableIndex++
                formattedFormula.push(text)
            }
        }

        props.field.formula_configuration = formattedFormula.join('')
        editorRef.current = initializeEditor(
            textEditorRef.current, 
            context, 
            dispatch, 
            {doc: props.field.formula_configuration}
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
    
    /**
     * This retrieves the formula occurrences, in other words, 
     * this retrieves all of the variables Field instances id, sometimes the variable can contain
     * the name or the id of the field. So what we do is ALWAYS retrieve the field.
     * 
     * @param {String} formulaText - The text of the formula.
     * 
     * @returns {Array<String>} - Array of strings where each string is an integer or an empty string.
     */
    const getFormulaOccurences = (formulaText) => {
        const occurrences = (formulaText.match(/{{(\w+)?}}/g) || []).map((variable, index) => {
            variable = variable.replace('{{', '').replace('}}', '') 

            const occurrence = fieldIdByFieldName(variable)
            
            return occurrence !== '' ? occurrence : variable
        })
        return occurrences
    }

    /**
     * This changes the formula variables objects
     * 
     * @param {Array<BigInteger>} occurrences - A array of Integers where each integer is a Field intance id.
     */
    const changeFormulaVariables = (occurrences) => {
        props.field.field_formula_variables = []
        for(let i=0; i<occurrences.length; i++) {
            props.field.field_formula_variables.push(
                {variable_id: occurrences[i]}
            )
        }
    }

    /**
     * Used when the user changes the formula variable in the select.
     * 
     * @param {BigInteger} index - The index of the variable, is it the first variable to change? The second? and so on
     * @param {Array<BigIntegers>} data - The selected field instance id. 
     */
    const onChangeFormulaVariable = (index, data) => {
        let occurrences = getFormulaOccurences(props.field.formula_configuration)
        occurrences[index] = data.length > 0 ? data[0] : null
        changeFormulaVariables(occurrences)
        createEditor()
        props.onUpdateField(props.field)
    }

    /**
     * When the user types any key in the keyboard the codemirror lib always fires a callback called dispatch with a transaction object.
     * This dispatch is also fired when the user selects a text, or even clicks the editor to start typing. Because of that
     * what we need to do is ALWAYS verify the length of the hole document. If it has changed this means a text was either deleted added.
     * So when this happens what we do is get all of the occurrences (all of the {{}}) and attach them to the variables.
     * 
     * @returns {Function} - the dispatch on codemirror works like a callback, so we run a function that returns a function to be called anytime.
     */
    const dispatch = () => {
        return (transaction) => {
            if (documentLengthRef.current !== transaction.state.doc.length && transaction?.state?.doc) {
                props.field.formula_configuration = transaction?.state?.doc.text.join('\n')
                const occurrences = getFormulaOccurences(props.field.formula_configuration)
                changeFormulaVariables(occurrences)
                props.onUpdateField(props.field)
            }
            documentLengthRef.current = transaction.state.doc.length
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
                <FormulariesEdit.FieldFormFieldContainer>
                    <FormulariesEdit.FieldFormLabel>
                        {strings['pt-br']['formularyEditFieldFormulaTypeEditorLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <div ref={textEditorRef}/>
                    {props.field.field_formula_variables.map((fieldFormulaVariable, index) => {
                            const initialFormulaVariablesOptions = formularyFields.filter(field => field.value === fieldFormulaVariable.variable_id)
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
                </FormulariesEdit.FieldFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula