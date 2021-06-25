import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'
import Select from '../../Utils/Select'
import delay from '../../../utils/delay'
import initializeEditor from '../../../utils/reflowFormulasLanguage'


const makeDelay = delay(1000)

/**
 * This is the Formula component, this is used to handle formulas in reflow, formulas is actually our own
 * programming language that we've created specifically for this use case.
 * We had an idea to make it run on the front-end but there is a problem: The user can make api requests.
 * What if the api has a rate limiting? If we make a request every second or everytime the user types 
 * we will probably reach that rate limit.
 * 
 * Okay, okay, we can add a delay on it, so when the user stops typing for n seconds we run. Which is something that
 * actually solves the problem.
 * 
 * BUT, remember that we need to run the formula again on the backend. 
 * 
 * WHY? Because we want to enable formulas to run only on apis. Imagine we are only working with apis, how do we run the formula
 * if we don't have a front-end?
 * Yeah, some people sometimes need to use stuff without front-ends. So we need to always validate the formula when he save.
 * 
 * date.now() would be the date that he saves the formulary.
 * 
 * So since we run stuff on the backend and on the front-end you understand what the problem is?
 * No? It's the same basically. If we run on the front-end but achieve the rate limiting on the backend the result will not be displayed.
 * 
 * It's better to not show the result while the user types than just not display the actual result. One is a bug the other is actually
 * a feature (for real).
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Formula = (props) => {
    const [formulaInvalidError, setFormulaInvalidError] = useState(true)
    const [isFormulaInvalid, setIsFormulaInvalid] = useState(false)
    const sourceRef = React.useRef()
    const documentLengthRef = React.useRef(0)
    const textEditorRef = React.useRef()
    const editorRef = React.useRef()
    const formularyFields = getFormularyFields()

    /**
     * Tests the formula to see if it is valid or not, if the formula is not valid we can't save, othewise we save.
     * 
     * @param {String} text - The actual formula to test
     */
    const testFormula = (text) => {
        makeDelay(() => {
            if (text !== '') {
                props.onTestFormularySettingsFormulaField(sourceRef.current, props.formId, text).then(response => {
                    if (response && response.status !== 200) {
                        setFormulaInvalidError(response.data.error)
                        setIsFormulaInvalid(true)
                    } else {
                        setIsFormulaInvalid(false)
                    }
                })
            }
        })
    }

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

        if (props.field.formula_configuration === null) {
            props.field.formula_configuration = ''
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
        testFormula(props.field.formula_configuration)
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
                testFormula(props.field.formula_configuration)
                props.onUpdateField(props.field)
            }
            documentLengthRef.current = transaction.state.doc.length
            editorRef.current.update([transaction])
        } 
    }
    
    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()

        if (!['', null, undefined].includes(props.field.formula_configuration)) {
            testFormula(props.field.formula_configuration)
        } else {
            setIsFormulaInvalid(false)
        }
        createEditor()

        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
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
                    {isFormulaInvalid ? (
                        <div>
                            <small style={{color: 'red'}}>
                                {'Formula não é válida'}
                            </small>
                        </div>
                    ) : ''}
                    <div style={{border: isFormulaInvalid ? '1px solid red': ''}} ref={textEditorRef}/>
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
                    {isFormulaInvalid ? (
                        <div>
                            <small style={{color: 'red'}}>
                                {formulaInvalidError}
                            </small>
                        </div>
                    ) : ''}
                </FormulariesEdit.FieldFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula