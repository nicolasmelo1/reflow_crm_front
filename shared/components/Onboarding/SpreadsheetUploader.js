import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import XLSX from 'xlsx'
import axios from 'axios'
import generateUUID from '../../utils/generateUUID'
import validateEmail from '../../utils/validateEmail'
import { FRONT_END_HOST, DEFAULT_BASE_NUMBER_FIELD_FORMAT } from '../../config'
import RepresentationService from '../../services/representation'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const SpreadsheetUploader = (props) => {
    const filesToUpload = React.useRef()
    const [pages, setPages] = useState([])
    const [names, setNames] = useState([])

    const createAFieldTypesMatcher = () => {
        const createFieldTypeData = () => {
            return {
                count: 0,
                values: []
            }
        }
        return {
            date: createFieldTypeData(),
            dateAndHour: createFieldTypeData(),
            numberDynamic: createFieldTypeData(),
            numberInteger: createFieldTypeData(),
            numberCurrency: createFieldTypeData(),
            numberPercentage: createFieldTypeData(),
            text: createFieldTypeData(),
            email: createFieldTypeData(),
            textArea: createFieldTypeData(),
            option: createFieldTypeData(),
            user: createFieldTypeData()
        }
    }

    /**
     * Gets the fieldType id from fieldType names. Explained both in `.getDateConfigurationTypeIdByName()` and `.getNumberConfigurationTypeIdByName()`
     * functions, here we compress the options. Instead of the user selecting the `number` fieldType and then selecting which formatting he wants to be used
     * we compress the fieldType with the formatting so that the user can easily select the options of the field in a quick and simple dropdown selection
     * button.
     * 
     * @param {String} fieldTypeName - The name of the fieldType to return the id for.
     * 
     * @returns {number} - The id of the field represented by the fieldType name.
     */
    const getFieldTypeIdByName = (name) => {
        if (props.types?.data) {
            let fieldTypes = []
            if (name === 'date' || name === 'dateAndHour') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'date')   
            } else if (name === 'numberDynamic' || name === 'numberInteger' || name === 'numberCurrency' || name === 'numberPercentage') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'number')
            } else if (name === 'text') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'text')
            } else if (name === 'textArea') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'long_text')
            } else if (name === 'option') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'option')
            } else if (name === 'user') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'user')
            } else if (name === 'email') {
                fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.type === 'email')
            }
            if (fieldTypes.length > 0) {
                return fieldTypes[0].id
            }
        } 
        return 1
    }

    /**
     * When defining the type of the field we compress the number of options the user can select. For example, when selecting a date type the user
     * can select if he wants to be able to select the time also or only the date. For those cases we decided to compress the options to two separate and 
     * distinct options `date` and `dateAndHour`. This means the user will select them both as they were different field types. For us though what changes
     * is only the formating of the field but both of them will evaluate to `date` field type.
     * 
     * @param {'date' | 'dateAndHour'} name - The name of the field type that we compressed to. With we recive any other string we will return null.
     * 
     * @returns {number | null} - The id of the field formatting that we compressed to. Returns null if the `name` is not either 'date' or `dateAndHour`
     */
    const getDateConfigurationTypeIdByName = (name) => {
        if (props.types?.data) {
            let dateConfigurationTypes = []
            if (name === 'date') {
                dateConfigurationTypes = props.types.data.field_date_format_type.filter(dateConfigurationType => dateConfigurationType.type === 'date')
            } else if (name === 'dateAndHour') {
                dateConfigurationTypes = props.types.data.field_date_format_type.filter(dateConfigurationType => dateConfigurationType.type === 'datetime')
            }
            if (dateConfigurationTypes.length > 0) {
                return dateConfigurationTypes[0].id
            }
        }
        return null
    }

    /**
     * When defining the type of the field what we do is compress the options of numbers and dates so the user is able to select without
     * needing to select each individual option of the field. For example on numbers we've got the currency format, the percentage format, the 
     * integer format and the dynamic format. All of that formats are the same field type: `number`. So what we do is decompress these field types
     * we've created to something that reflow can understand.
     * 
     * @param {'numberDynamic' | 'numberInteger' | 'numberCurrency' | 'numberPercentage'} name - The name of the field to decompress in the each 
     * format of the number.
     * 
     * @returns {number | null} - The id of the field type to use or null if the field type is not a number.
     */
    const getNumberConfigurationTypeIdByName = (name) => {
        if (props.types?.data) {
            let numberConfigurationTypes = []
            if (name === 'numberDynamic') {
                numberConfigurationTypes = props.types.data.field_number_format_type.filter(numberConfigurationType => numberConfigurationType.type === 'number')
            } else if (name === 'numberInteger') {
                numberConfigurationTypes = props.types.data.field_number_format_type.filter(numberConfigurationType => numberConfigurationType.type === 'integer')
            } else if (name === 'numberCurrency') {
                numberConfigurationTypes = props.types.data.field_number_format_type.filter(numberConfigurationType => numberConfigurationType.type === 'currency')
            } else if (name === 'numberPercentage') {
                numberConfigurationTypes = props.types.data.field_number_format_type.filter(numberConfigurationType => numberConfigurationType.type === 'percentage')
            }
            if (numberConfigurationTypes.length > 0) {
                return numberConfigurationTypes[0].id
            }
        }
        return null
    }

    const getFieldTypeNameById = (id) => {
        if (props.types?.data?.field_type) {
            let fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.id === id)
            if (fieldTypes.length > 0) {
                return fieldTypes[0].type
            }
        }
        return ''
    }

    const getNumberConfigurationTypeById = (id) => {
        if (props.types?.data?.field_number_format_type) {
            const numberConfigurationTypes = props.types.data.field_number_format_type.filter(numberConfigurationType => numberConfigurationType.id === id)
            if (numberConfigurationTypes.length > 0) {
                return {
                    ...numberConfigurationTypes[0],
                    labelName: numberConfigurationTypes[0].label_name,
                    thousandSeparator: numberConfigurationTypes[0].thousand_separator,
                    decimalSeparator: numberConfigurationTypes[0].decimal_separator,
                    hasToEnforceDecimal: numberConfigurationTypes[0].has_to_enforce_decimal
                }
            }
        }
        return {}
    }   

    const getDateConfigurationTypeById = (id) => {
        if (props.types?.data?.field_date_format_type) {
            const dateConfigurationTypes = props.types.data.field_date_format_type.filter(dateConfigurationType => dateConfigurationType.id === id)
            if (dateConfigurationTypes.length > 0) {
                return {
                    ...dateConfigurationTypes[0],
                    labelName: dateConfigurationTypes[0].label_name
                }
            }
        }
        return {}
    }

    const createNewFields = (fieldName, fieldTypeName, order, fieldOptions=[]) => {
        return {
            id: null,
            field_option: fieldTypeName === 'option' ? fieldOptions : [],
            field_default_field_values: [],
            form_field_as_option : null,
            name: '',
            uuid: generateUUID(),
            form: null,
            number_configuration_mask: '9',
            formula_configuration: null,
            field_formula_variables: [],
            is_long_text_rich_text: false,
            label_name: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
            placeholder: '',
            required: false,
            order: order,
            is_unique: false,
            field_is_hidden: false,
            label_is_hidden: false,
            date_configuration_auto_create: false,
            date_configuration_auto_update:	false,
            number_configuration_allow_negative: true,
            number_configuration_allow_zero: true,
            enabled: true,
            date_configuration_date_format_type: getDateConfigurationTypeIdByName(fieldTypeName),
            period_configuration_period_interval_type: 4,
            number_configuration_number_format_type: getNumberConfigurationTypeIdByName(fieldTypeName),
            type: getFieldTypeIdByName(fieldTypeName),
        }
    }

    /**
     * @typedef {{
     *   pageName: string, 
     *   fields: array, 
     *   data: array
     * }} PageData - All of the data needed to create the pages.
     */
    const createNewPageData = (pageName) => {
        return {
            pageName: pageName,
            fields: [],
            data: []
        }
    }

    /**
     * Gets the winner fieldTypeName from `evaluateField()` function and return a new fieldTypeData
     * as the winner.
     * 
     * For reference: fieldTypeName is one of the keys of the object returned in `createFieldTypeData`
     * 
     * @param {'date'|'dateAndHour'|'numberDynamic'|'numberInteger'|'numberCurrency'|
     * 'numberPercentage'|'text'|'textArea'|'option'|'multiOption'|'email'} fieldTypeWinner - The winner fieldTypeName. 
     * This is one of the keys from the object returned in `createFieldTypeData` function.
     * @param {object} fieldTypeData - The fieldTypeData is the object from each key returned in `createFieldTypeData` function.
     * @param {number} fieldTypeData.count - The number of times the fieldTypeWinner is found in the fieldTypeData.values array.
     * @param {array} fieldTypeData.values - The array of values that are found in the fieldTypeWinner.
     * 
     * @return {{winner: fieldTypeWinner, data: fieldTypeData}} - The new fieldTypeData that will be the winner.
     */
    const upgradeFieldType = (fieldTypeWinner, fieldTypeData) => {
        const isAUser = (value) => {
            const userName = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            const firstName = userName.split(' ')[0]
            return names.includes(firstName)
        }
        if (fieldTypeWinner === 'text') {
            const valuesAsSet = new Set(fieldTypeData.values)
            if (valuesAsSet.size < 15 && valuesAsSet.size > 0) {
                if ([...valuesAsSet].every(value => isAUser(value))) {
                    return {
                        winner: 'user',
                        data: [...valuesAsSet]
                    }
                } else {
                    return {
                        winner: 'option',
                        data: [...valuesAsSet]
                    }
                }
            }
        } 
        return {
            winner: fieldTypeWinner,
            data: fieldTypeData
        }
    }

    /**
     * This updates the `fieldTypesObject` by reference, this means we don't return anything from the function instead just update
     * the object from inside the function, the object recieved in the first parameter after the function has completed it's evaluation
     * will be different than the object before the evaluation.
     * This function will recieve a fieldType object and update it by adding the value to the values array and adding the counter,
     * we go through many logic gates here to check the type of a field. After that we will have the ability to upgrade the fieldType
     * to something else like from `text` to `option` (we can't evaluate this here because we need to know all of the values of the field).
     * 
     * @param {object} fieldTypesObject - Check the `createAFieldTypesMatcher()` function above for reference on how this object will be structured.
     * @param {any} data - The value of the field. 
     */
    const fieldTypeFromData = async (fieldTypesObject, data) => {
        if (data instanceof Date) {
            // safely eval to date representation
            if (data.getMinutes() === 0 && data.getHours() === 0) {
                fieldTypesObject.date.count++
                fieldTypesObject.date.values.push(data)
            } else {
                fieldTypesObject.dateAndHour.count++
                fieldTypesObject.dateAndHour.values.push(data)
            }
        } else if (typeof data === 'number') {
            if (data % 1 === 0) {
                fieldTypesObject.numberInteger.count++
                fieldTypesObject.numberInteger.values.push(data)
            } else if (data % 1 !== 0 && data < 1) {
                fieldTypesObject.numberPercentage.count++
                fieldTypesObject.numberPercentage.values.push(data)
            } else if (data % 1 !== 0 && data.toString().split('.')[1].length <= 3) {
                fieldTypesObject.numberCurrency.count++
                fieldTypesObject.numberCurrency.values.push(data)
            } else {
                fieldTypesObject.numberDynamic.count++
                fieldTypesObject.numberDynamic.values.push(data)
            }
        } else {
            if (data.length > 100) {
                fieldTypesObject.textArea.count++
                fieldTypesObject.textArea.values.push(data)
            } else if (validateEmail(data)) {
                fieldTypesObject.email.count++
                fieldTypesObject.email.values.push(data)
            } else {
                fieldTypesObject.text.count++
                fieldTypesObject.text.values.push(data)
            }
        }
    }

    /**
     * Get the data from the field and create a new field object. The new field object will be added to the `fields` array of the page.
     * This field object will be the 
     */
    const evaluateField = async (data, headerName, headerIndex) => {
        let fieldValues = []
        let fieldTypes = createAFieldTypesMatcher()
        // loop ignoring the headers
        for (let i = 1; i < data.length; i++) {
            const rowDataFromColumn = data[i][headerIndex]
            fieldValues.push(rowDataFromColumn)
            if (rowDataFromColumn !== undefined && rowDataFromColumn !== '') {
                await fieldTypeFromData(fieldTypes, rowDataFromColumn)
            }
        }

        // loop through all of the field types and check the winner.
        let fieldTypeWinner = 'text'
        let lastWinnerCount = 0
        for (const [key, {count}] of Object.entries(fieldTypes)) {
            if (count > lastWinnerCount) {
                fieldTypeWinner = key
                lastWinnerCount = count
            }
        }
        let winnerData = upgradeFieldType(fieldTypeWinner, fieldTypes[fieldTypeWinner])
        return [fieldValues, createNewFields(headerName, winnerData.winner, headerIndex, winnerData.data)]
    }

    /**
     * Passes through all of the values and gets the values to represent them to. 
     * 
     * @param {array} values - The values of the field to get the representation of.
     * @param {object} fieldData - The data of the field to get the representation of. The data of the field is
     * an object exactly like the structure of `createNewFields` function.
     */
    const evaluateFieldValues = async (values, fieldData) => {
        let newValues = []
        const fieldTypeName = getFieldTypeNameById(fieldData.type)
        const dateConfigurationType = getDateConfigurationTypeById(fieldData.date_configuration_date_format_type)
        const numberConfigurationType = getNumberConfigurationTypeById(fieldData.number_configuration_number_format_type)

        for (let i = 0; i < values.length; i++) {
            let value = values[i]
            const representationService = new RepresentationService(
                fieldTypeName, 
                dateConfigurationType,
                numberConfigurationType,  
                null, 
                false
            )

            if (fieldTypeName === 'number') newValues.push(await representationService.representation(value * DEFAULT_BASE_NUMBER_FIELD_FORMAT))
            else newValues.push(await representationService.representation(value))
        }
        return newValues
    }

    /**
     * Passes through all of the headers and then get the field data needed to create the new field and set the data of the
     * fields.
     * 
     * @param {Array<Array<*>>} data - An 2D array that represents each row and column of the sheets.
     * @param {PageData} page - This object is created using the `createNewPageData()` function and then used here.
     * We update the .fields
     */
    const evaluateFields = async (data, page) => {
        const headers = data[0]
        let headerIndex = 0
        for (const header of headers) {
            let [values, fieldData] = await evaluateField(data, header, headerIndex)
            values = await evaluateFieldValues(values, fieldData)
            page.fields.push({
                values,
                fieldData
            })
            headerIndex++
        }
    }

    const handleWorkbookPages = async (workbook) => {
        const possiblePages = []
        for (const pageName of workbook.SheetNames) {
            let pageData = createNewPageData(pageName)
            const worksheet = workbook.Sheets[pageName]
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            await evaluateFields(data, pageData)
            possiblePages.push(pageData)
        }
        setPages([...possiblePages])
    }

    const loadWorkbook = (arrayBuffer) => {
        const workbook = XLSX.read(arrayBuffer, {
            type:'array', 
            cellDates: true,
            cellFormula: true,
            cellNF: true,
        })
        handleWorkbookPages(workbook)
    }    

    const onUploadFile = (files) => {
        if (names.length === 0 && files.length > 0) {
            filesToUpload.current = files[0]
        } else {
            if (files.length > 0 && ![undefined, null].includes(files[0])) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    loadWorkbook(e.target.result)
                }
                reader.readAsArrayBuffer(files[0])
                filesToUpload.current = null
            }
        }
    }

    useEffect(() => {
        // we retrieved all of the names from brazil and appended it to a single json file. This json file is stored in our frontend public repository.
        // By doing this we can automatically convert a field type to a user field type and prompt the user for adding the users of this file.
        axios.get(`${FRONT_END_HOST}/utils/names.json`).then(response => {
            setNames(response.data.names)
            if (filesToUpload.current !== null || filesToUpload.current !== undefined) {
                onUploadFile([filesToUpload.current])
            }
        })
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        console.log(pages)
        return (
            <div>
                {pages.length > 0 ? (
                    <div>
                        {pages.map((page, index) => (
                            <div key={index}>
                                <h1>{page.name}</h1>
                                <div>
                                    <div
                                    style={{ 
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        overflow: 'auto',
                                        maxHeight: '50vh',
                                        maxWidth: 'var(--app-width)'
                                    }}
                                    >
                                        {page.fields.map((field, index) => (
                                            <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            >
                                                <div
                                                style={{
                                                    padding: '10px',
                                                    backgroundColor: '#17242D',
                                                    borderLeft: index !== 0 ? '1px solid #fff': 'none',
                                                }}
                                                >
                                                    <p 
                                                    style={{
                                                        color: '#0dbf7e',
                                                        margin: 0,
                                                    }}
                                                    >
                                                        {field.fieldData.label_name}
                                                    </p>
                                                </div>
                                                {field.values.map((value, valueIndex) => (
                                                    <div
                                                    key={`${index}${valueIndex}`}
                                                    style={{
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                        height: '20px',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    >
                                                        <p 
                                                        style={{
                                                            color: '#0dbf7e',
                                                            margin: 0,
                                                        }}
                                                        >
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <input type={'file'} value={''} onChange={(e) => onUploadFile(e.target.files)}/>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SpreadsheetUploader
