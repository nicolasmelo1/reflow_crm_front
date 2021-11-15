import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import XLSX from 'xlsx'
import axios from 'axios'
import generateUUID from '../../utils/generateUUID'
import validateEmail from '../../utils/validateEmail'
import { FRONT_END_HOST } from '../../config'
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

    const createNewFields = (fieldName, order, fieldOption=[]) => {
        return {
            id: null,
            field_option: [],
            field_default_field_values: [],
            form_field_as_option : null,
            name: '',
            uuid: generateUUID(),
            form: null,
            number_configuration_mask: '9',
            formula_configuration: null,
            field_formula_variables: [],
            is_long_text_rich_text: false,
            label_name: fieldName,
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
            date_configuration_date_format_type: 1,
            period_configuration_period_interval_type: 4,
            number_configuration_number_format_type: 1,
            type: null
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
                        data: fieldTypeData
                    }
                } else {
                    return {
                        winner: 'option',
                        data: fieldTypeData
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
     * This function will recieve a fieldType object and update it by adding the value to the values array and adding the counter,
     * we go through many logic gates here to check the type of a field. After that we will have the ability to upgrade the fieldType
     * to something else like from `text` to `option` (we can't evaluate this here because we need to know all of the values of the field).
     */
    const fieldTypeFromData = (fieldTypesObject, data) => {
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
            } else if (data % 1 !== 0 && data < 0) {
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
            // Reference: 
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

    const evaluateField = (data, headerName, headerIndex) => {
        let fieldValues = []
        let fieldTypes = createAFieldTypesMatcher()

        // loop ignoring the headers
        for (let i = 1; i < data.length; i++) {
            const rowDataFromColumn = data[i][headerIndex]
            if (rowDataFromColumn !== undefined && rowDataFromColumn !== '') {
                fieldTypeFromData(fieldTypes, data[i][headerIndex])
                fieldValues.push(data[i][headerIndex])
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

        console.log(winnerData)
        //const columnDataWithoutDuplicates = new Set(columnData)
        //console.log(columnDataWithoutDuplicates)
        return [fieldValues, createNewFields(headerName, headerIndex)]
    }

    /**
     * Passes through all of the headers and then get the field data needed to create the new field and set the data of the
     * fields.
     * 
     * @param {Array<Array<*>>} data - An 2D array that represents each row and column of the sheets.
     * @param {PageData} page - This object is created using the `createNewPageData()` function and then used here.
     * We update the .fields
     */
    const evaluateFields = (data, page) => {
        const headers = data[0]
        page.fields.push(headers.map((header, headerIndex) => {
                const [values, fieldData] = evaluateField(data, header, headerIndex)
                return {
                    values,
                    fieldData
                }
            })
        )
    }

    const handleWorkbookPages = (workbook) => {
        let possiblePages = []

        /**workbook.SheetNames.forEach(pageName => {
            let pageData = createNewPageData(pageName)
            const worksheet = workbook.Sheets[pageName]
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            evaluateFields(data, pageData)
            possiblePages.push(pageData)
        })*/
        const representationService = new RepresentationService('number', {},  {
            type: 'currency',
            labelName: 'Monetário',
            precision: 100,
            base: 100,
            prefix: null,
            suffix: null,
            thousandSeparator: '.',
            decimalSeparator: ',',
            hasToEnforceDecimal: true
        })
    
        representationService.representation((1212412123*100000000).toString()).then(value => {
            console.log(value)
        })

        return possiblePages
    }

    const loadWorkbook = (arrayBuffer) => {
        const workbook = XLSX.read(arrayBuffer, {
            type:'array', 
            cellDates: true,
            cellFormula: true,
            cellNF: true,
        })
        handleWorkbookPages(workbook)
        //const worksheetName = workbook.SheetNames[0]
        //const worksheet = workbook.Sheets[worksheetName]
        //const data = XLSX.utils.sheet_to_json(worksheet, {header:1})
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
        return (
            <div>
                <input type={'file'} value={''} onChange={(e) => onUploadFile(e.target.files)}/>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SpreadsheetUploader
