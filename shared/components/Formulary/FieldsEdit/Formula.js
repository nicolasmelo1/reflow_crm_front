import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'
import Select from '../../Utils/Select'
import delay from '../../../utils/delay'
import dynamicImport from '../../../utils/dynamicImport'
import { initializeEditor, lexer } from '../../../utils/flowLanguage'
import generateUUID from '../../../utils/generateUUID'


const Spinner = dynamicImport('react-bootstrap', 'Spinner')

const makeDelay = delay(5000)

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
    const [isAutomaticEvaluation, _setIsAutomaticEvaluation] = useState(true)
    const [isFormulaInvalid, setIsFormulaInvalid] = useState(false)
    const [isTestingFormula, setIsTestingFormula] = useState(false)
    const [formularyFields, setFormularyFields] = useState(getFormularyFields())
    const [result, setResult] = useState('')
    const documentLengthRef = React.useRef(0)
    const isAutomaticEvaluationRef = React.useRef(isAutomaticEvaluation)
    const textEditorRef = React.useRef()
    const editorRef = React.useRef()

    const setIsAutomaticEvaluation = (data) => {
        isAutomaticEvaluationRef.current = data
        _setIsAutomaticEvaluation(data)
    }

    const translatedContext = lexer.contextFactory(
        strings['pt-br']['formularyEditFieldFormulaDecimalPointCharacter'],
        strings['pt-br']['formularyEditFieldFormulaPositionalArgumentSeparator'], 
        strings['pt-br']['formularyEditFieldFormulaBlockKeywordsDo'], 
        strings['pt-br']['formularyEditFieldFormulaBlockKeywordsEnd'], 
        strings['pt-br']['formularyEditFieldFormulaIfKeywordsIf'],
        strings['pt-br']['formularyEditFieldFormulaIfKeywordsElse'],
        strings['pt-br']['formularyEditFieldFormulaBooleanKeywordsTrue'],
        strings['pt-br']['formularyEditFieldFormulaBooleanKeywordsFalse'],
        strings['pt-br']['formularyEditFieldFormulaNullKeyword'],
        strings['pt-br']['formularyEditFieldFormulaModuleKeyword'],
        strings['pt-br']['formularyEditFieldFormulaFunctionKeyword'],
        strings['pt-br']['formularyEditFieldFormulaConjunctionKeyword'],
        strings['pt-br']['formularyEditFieldFormulaDisjunctionKeyword'],
        strings['pt-br']['formularyEditFieldFormulaInversionKeyword'],
        strings['pt-br']['formularyEditFieldFormulaIncludeKeyword']
    )
    
    /**
     * Tests the formula to see if it is valid or not, if the formula is not valid we can't save, othewise we save.
     */
    const testFormula = (formula) => {
        const testTheFormula = (formula) => {
            if (formula !== '') {
                const data = {
                    formula: formula, 
                    variable_ids: props.field.field_formula_variables.map(formulaVariable => formulaVariable.variable_id)
                }
                setIsTestingFormula(true)
                props.onTestFormularySettingsFormulaField(
                    data, 
                    props.formId
                ).then(response => {
                    if (response && response.status !== 200) {
                        setIsTestingFormula(false)
                        setResult('')
                        setFormulaInvalidError(response.data.error)
                        setIsFormulaInvalid(true)
                    } else {
                        if (response.data?.data?.result) {
                            setIsTestingFormula(false)
                            setResult(response.data?.data?.result)
                        }
                        setIsTestingFormula(false)
                        setIsFormulaInvalid(false)
                    }
                })
            } else {
                setIsFormulaInvalid(false)
                setResult('')
                setIsTestingFormula(false)
            }
        }
        if (isAutomaticEvaluationRef.current) {
            makeDelay(() => {testTheFormula(formula)})
        } else {
            testTheFormula(formula)
        }
    }

    /**
     * retrieves the field_id by a field_name
     * 
     * @param {String} fieldName - The field name you want to find the fieldId for.
     * 
     * @returns {<BigInteger, String>} - Returns a empty string if not find or a integer
     */
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
            props.field.formula_configuration,
            textEditorRef.current, 
            translatedContext, 
            dispatch, 
        )
    }

    function getFormularyFields() {
        const formularyData = props.retrieveFormularyData()
        let formularyFields = []
        if (formularyData.depends_on_form) {
            formularyData.depends_on_form.forEach(section => {
                section.form_fields.forEach(field => {
                    formularyFields.push({
                        value: field.id,
                        label: field.label_name,
                        name: field.name
                    })
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
        const newFormulaVariables = []

        for(let i=0; i<occurrences.length; i++) {
            let uuid = generateUUID()
            if (props.field.field_formula_variables[i]) {
                uuid = props.field.field_formula_variables[i].uuid
            }
            newFormulaVariables.push(
                {
                    uuid: uuid,
                    variable_id: occurrences[i]
                }
            )
        }
        props.field.field_formula_variables = newFormulaVariables
    }

    /**
     * Used when the user changes the formula variable in the select.
     * 
     * @param {Object} fieldFormulaVariable - {
     *      variable_id: The variable_id can be either a string or a integer,
     *      uuid: The variable uuid
     * } - This is the object of the formulaVariable, we recieve it from the backend and send it back. It has a uuid
     * and a variable_id, the first is a unique uuid of the variable, to identify which variable we are modifying, the second is
     * the actual field_id we selected as variable.
     * @param {Array<BigIntegers>} data - The selected field instance id. 
     */
    const onChangeFormulaVariable = (fieldFormulaVariable, data) => {
        const formulaVariableIndex = props.field.field_formula_variables.findIndex(
            formulaVariable => formulaVariable.uuid === fieldFormulaVariable.uuid
        )
        let occurrences = getFormulaOccurences(props.field.formula_configuration)
        occurrences[formulaVariableIndex] = data.length > 0 ? data[0] : null
        changeFormulaVariables(occurrences)
        createEditor()
        if (isAutomaticEvaluationRef.current) {
            testFormula(props.field.formula_configuration)
        }
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
                let text = []
                let leaves = []

                if (transaction.state.doc?.children) leaves = transaction.state.doc.children
                else leaves = [transaction.state.doc]
                
                leaves.forEach(leaf => {
                    text = [...text,...leaf.text]
                })
                props.field.formula_configuration = text.join('\n')
                const occurrences = getFormulaOccurences(props.field.formula_configuration)
                changeFormulaVariables(occurrences)
                if (isAutomaticEvaluationRef.current) {
                    testFormula(props.field.formula_configuration, true)
                    if (props.field.formula_configuration !== '') {
                        setIsTestingFormula(true)
                    }
                }
                props.onUpdateField(props.field)
            }
            
            documentLengthRef.current = transaction.state.doc.length
            editorRef.current.update([transaction])
        } 
    }
    
    useEffect(() => {
        if (!['', null, undefined].includes(props.field.formula_configuration) && isAutomaticEvaluation) {
            testFormula(props.field.formula_configuration)
        } else {
            setIsFormulaInvalid(false)
        }
        createEditor()
    }, [])

    useEffect(() => {
        setFormularyFields([...getFormularyFields()])
        createEditor()
    }, [props.field.name, props.field.label_name])

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
                        {isAutomaticEvaluation === false ? (
                            <button
                            style={{border: 0, color: '#0dbf7e'}} 
                            onClick={(e) => {isTestingFormula ? null : testFormula(props.field.formula_configuration)}}
                            >
                                {strings['pt-br']['formularyEditFieldFormulaTestFormulaButtonLabel']}&nbsp;<FontAwesomeIcon icon="play"/>
                            </button>
                        ) : ''} 
                    </FormulariesEdit.FieldFormLabel>
                    <div style={{color: '#00000050'}} >
                        <small>
                            <input type="checkbox" checked={isAutomaticEvaluation} onChange={(e) => {setIsAutomaticEvaluation(!isAutomaticEvaluation)}}/> {'Teste automático'}
                        </small>
                    </div>

                    {isFormulaInvalid ? (
                        <div>
                            <small style={{color: 'red'}}>
                                {strings['pt-br']['formularyEditFieldFormulaTestFormulaNotValidError']}
                            </small>
                        </div>
                    ) : ''}
                    <div style={{border: isFormulaInvalid ? '1px solid red': ''}} ref={textEditorRef}/>
                    {props.field.field_formula_variables.map(fieldFormulaVariable => {
                        const initialFormulaVariablesOptions = formularyFields.filter(field => field.value === fieldFormulaVariable.variable_id)
                        return (
                            <FormulariesEdit.SelectorContainer key={fieldFormulaVariable.uuid}>
                                <Select 
                                    options={formularyFields} 
                                    initialValues={initialFormulaVariablesOptions} 
                                    onChange={(data) => onChangeFormulaVariable(fieldFormulaVariable, data)} 
                                />
                            </FormulariesEdit.SelectorContainer>
                        )
                    })}
                    {isTestingFormula ? (
                        <Spinner animation="border" size="sm"/>
                    ) : (
                        <div>
                            {isFormulaInvalid ? (
                                <div>
                                    <small style={{color: 'red', whiteSpace: 'pre-wrap'}}>
                                        {formulaInvalidError}
                                    </small>
                                </div>
                            ) : ''}
                            {result !== '' ? (
                                <div>
                                    <small>
                                        {strings['pt-br']['formularyEditFieldFormulaTestFormulaResult']}&nbsp;
                                    </small>
                                    <small style={{color: 'green'}}>
                                        {result}
                                    </small>
                                </div>
                            ) : ''}
                        </div>
                    )}
                </FormulariesEdit.FieldFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula