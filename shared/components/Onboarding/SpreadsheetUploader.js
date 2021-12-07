import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import XLSX from 'xlsx'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Alert from '../Utils/Alert'
import SimplifiedUserModal from '../Users/SimplifiedUserModal'
import { strings, paths } from '../../utils/constants'
import generateUUID from '../../utils/generateUUID'
import validateEmail from '../../utils/validateEmail'
import dynamicImport from '../../utils/dynamicImport'
import agent from '../../utils/agent'
import { FRONT_END_HOST, DEFAULT_BASE_NUMBER_FIELD_FORMAT } from '../../config'
import RepresentationService from '../../services/representation'
import Styled from './styles'

/**
 * SpreadsheetUploader will be responsible for uploading a spreadsheet and bulk creating the formulary data. 
 * _ This component will be responsible to bulk create first the formulary
 * _ Then it will bulk create the formulary data.
 * _ Then it will bulk create the users. 
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const SpreadsheetUploader = (props) => {
    const sourceRef = React.useRef()
    const filesToUpload = React.useRef()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    /** @type {Array<object>} - Each item is a field and each field holds the options as well as the field data.*/
    const [possibleUsers, setPossibleUsers] = useState([])
    const [openedDropdownAtFieldIndex, setOpenedDropdownAtFieldIndex] = useState(null)
    const [showAddNewUsers, setShowAddNewUsers] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showAlertForInvalidFile, setShowAlertForInvalidFile] = useState(false)
    const [users, setUsers] = useState([])
    const [pages, setPages] = useState([])
    const [names, setNames] = useState([])
    const [selectedPageIndex, setSelectedPageIndex] = useState(0)


    const possibleFieldTypes = [
        `date`, 'dateAndHour', 'numberDynamic', 'numberInteger', 
        'numberCurrency', 'numberPercentage', 'text', 'email', 
        'textArea', 'option', 'user'
    ]

    const getFieldTypeLabel = (fieldTypeName) => {
        return strings['pt-br'][`spreadsheetUploader${fieldTypeName.charAt(0).toUpperCase() + fieldTypeName.slice(1)}FieldType`]
    }

    const createAFieldTypesMatcher = () => {
        let response = {}
        possibleFieldTypes.forEach(fieldType => {
            response[fieldType] = {
                count: 0,
                values: []
            }
        })
        return response
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

    /**
     * Retrieves the field_type name from a given field_type id.
     * 
     * @param {number} id - The id of the field_type to get the name for.
     */
    const getFieldTypeNameById = (id) => {
        if (props.types?.data?.field_type) {
            let fieldTypes = props.types.data.field_type.filter(fieldType => fieldType.id === id)
            if (fieldTypes.length > 0) {
                return fieldTypes[0].type
            }
        }
        return ''
    }

    /**
     * Retrives the field_number_format_type object from the given numberConfigurationTypeId.
     * 
     * @param {number} id - The id of the field_number_format_type object to retrieve.
     * 
     * @returns {Object} - The field_number_format_type object.
     */
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

    const createNewField = (fieldName, fieldTypeName, fieldOptions=[]) => {
        /**
         * @typedef {{
         * fieldTypeName: string,
         * field_option: Array<{{option: string}}>,
         * uuid: string,
         * label_name: string,
         * required: boolean,
         * date_configuration_date_format_type: number | null,
         * period_configuration_period_interval_type: number | null,
         * number_configuration_number_format_type: number | null,
         * type: number
         * }} FieldData - The data of the field that we will send to the server.
         */
        return {
            fieldTypeName: fieldTypeName,
            field_option: fieldTypeName === 'option' ? fieldOptions.map(fieldOption => ({ option: fieldOption.toString() })) : [],
            uuid: generateUUID(),
            label_name: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
            required: false,
            date_configuration_date_format_type: getDateConfigurationTypeIdByName(fieldTypeName),
            period_configuration_period_interval_type: null,
            number_configuration_number_format_type: getNumberConfigurationTypeIdByName(fieldTypeName),
            type: getFieldTypeIdByName(fieldTypeName),
        }
    }

    /**
     * @typedef {{
     *   pageName: string, 
     *   fields: array, 
     * }} PageData - All of the data needed to create the pages.
     */
    const createNewPageData = (pageName) => {
        return {
            pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1),
            fields: [],
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
    const upgradeFieldType = (headerIndex, fieldTypeWinner, fieldTypeData) => {
        const isAUser = (value) => {
            const userName = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            const firstName = userName.split(' ')[0]
            return names.includes(firstName)
        }
        if (fieldTypeWinner === 'text') {
            const valuesAsSet = new Set(fieldTypeData.values)
            if (valuesAsSet.size < 15 && valuesAsSet.size > 0) {
                if ([...valuesAsSet].every(value => isAUser(value))) {
                    possibleUsers.push({
                        headerIndex: headerIndex, 
                        data: [...valuesAsSet]
                    })
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
     * This field object will hold the configuration of the number, the date, the period or any other configurations it needs.
     * 
     * @param {Array<[any]>} data - This is a 2d array of the data from the column the first dimension of this array is each line
     * and then each array on each line will represent each column.
     * @param {string} headerName - The name of the header of the column. We will use this as the name of the field.
     * @param {number} headerIndex - The index of the header of the column. We will use this as the index of the field.
     * 
     * @returns {[Array<any>, FieldData]} - Returns an array where the first value is an array of any value type and the second is the actual
     * field data
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
        let winnerData = upgradeFieldType(headerIndex, fieldTypeWinner, fieldTypes[fieldTypeWinner])
        return [fieldValues, createNewField(headerName, winnerData.winner, winnerData.data)]
    }

    /**
     * Passes through all of the values and gets the values to represent them to. 
     * 
     * @param {array} values - The values of the field to get the representation of.
     * @param {object} fieldData - The data of the field to get the representation of. The data of the field is
     * an object exactly like the structure of `createNewField` function.
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
            else if (fieldTypeName === 'user' && users.length > 0) {
                for (const user of users) {
                    if (value.startsWith(user.fullName)) {
                        newValues.push(user.id.toString())
                    }
                }
                newValues.push('')
            } else newValues.push(await representationService.representation(value))
            
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
            const [rawValues, fieldData] = await evaluateField(data, header, headerIndex)
            const values = await evaluateFieldValues(rawValues, fieldData)
            page.fields.push({
                values,
                rawValues,
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
            if (pageData.fields.length > 0) possiblePages.push(pageData)
        }
        setPages([...possiblePages])
        if (possibleUsers.length > 0) {
            setShowAlert(true)
            setPossibleUsers([...possibleUsers])
        }
    }

    /**
     * Function used for submiting the formulary with it's fields and it's data.
     * 
     * @param {Array<PageData>} pages - An array of page data.
     */
    const onSubmitFormulary = () => {
        const getUserActualValue = (value) => {
            for (const user of users) {
                if (user.fullName.startsWith(value)) {
                    return user.id.toString()
                }
            }
            return ''
        }
        const data = {
            name: strings['pt-br']['spreadsheetUploaderNewGroupName'],
            formularies: pages.map(page => ({
                name: page.pageName,
                section_name: page.pageName,
                fields: page.fields.map(({fieldData: {fieldTypeName, ...rest}}) => rest),
                // Reference: https://stackoverflow.com/a/10284006
                data: page.fields[0].values.map((_, index) => ({
                    data_by_each_field: page.fields.map(field => ({
                        field_name: field.fieldData.label_name,
                        value: field.fieldData.fieldTypeName !== 'user' ? field.values[index] : getUserActualValue(field.values[index])
                    }))
                }))
            }))
        }
        setIsSubmitting(true)
        props.onBulkCreateFormulary(data).then(response => {
            props.onSubmitData(response)
            setIsSubmitting(false)
        }).catch(_ => setIsSubmitting(false))
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

    /**
     * Removes a column from the field after the 
     */
    const onRemoveColumn = (fieldIndex) => {
        let newPages = [...pages]
        newPages[selectedPageIndex].fields = newPages[selectedPageIndex].fields.filter((_, i) => i !== fieldIndex)
        if (newPages[selectedPageIndex].fields.length === 0) {
            newPages = newPages.filter((_, i) => i !== selectedPageIndex)
            if (selectedPageIndex !== 0) {
                setSelectedPageIndex(selectedPageIndex - 1)
            }
        }
        setPages([...newPages])
    }

    /**
     * Used when the user changes the type of the column.
     * 
     * @param {number} fieldIndex - The index of the field that the user is changing the type of.
     * @param {string} fieldTypeName - The name of the field type that the user is changing the type of.
     */
    const onChangeColumn = (fieldIndex, newFieldType) => {
        let newPages = [...pages]
        const originalField = newPages[selectedPageIndex].fields[fieldIndex]
        let newFieldData = null
        if (newFieldType === 'option') {
            const valuesAsSet = new Set(originalField.rawValues)
            const options = [...valuesAsSet].map(value => value.toString())
            newFieldData = createNewField(originalField.fieldData.label_name, newFieldType, options)
        } else if (newFieldType === 'user') {
            // when the user selects a user field type, we add this to the `possibleUsers` array
            // and opens the popup to create the users in the platform.
            const valuesAsSet = new Set(originalField.rawValues)
            const userOptions = [...valuesAsSet].map(value => value.toString())
            possibleUsers.push({
                headerIndex: fieldIndex, 
                data: userOptions
            })
            newFieldData = createNewField(originalField.fieldData.label_name, newFieldType, userOptions)
            setPossibleUsers([...possibleUsers])
            setShowAddNewUsers(true)
        } else {
            newFieldData = createNewField(originalField.fieldData.label_name, newFieldType)
        }
        evaluateFieldValues(originalField.rawValues, newFieldData).then(newValues => {
            newPages[selectedPageIndex].fields[fieldIndex].fieldData = newFieldData 
            newPages[selectedPageIndex].fields[fieldIndex].values = newValues 
            setPages([...newPages])            
        })
    }

    /**
     * Removes the possible user column at the the given index, and then updates it to a the `option` field type.
     * 
     * If `possibleUsers` list is empty then we remove the alert, otherwise we show it again so the user can select if the other
     * possible column is a user column.
     * 
     * @param {number} fieldIndex - The index of the field that is a possible user column.
     */
    const onRemovePossibleUserColumn = (fieldIndex) => {
        if (showAlert === true) {
            setShowAlert(false)
            possibleUsers.splice(0, 1)
            onChangeColumn(fieldIndex, 'option')
            if (possibleUsers.length !== 0) {
                setShowAlert(true)
            }
            setPossibleUsers([...possibleUsers])
        }
    }

    /**
     * Callback for when the user clicks to accept to add the users now on the alert.
     * When the user uploads a new file we automatically see if there are names on the list, if there are, 
     * we show an alert asking him if he wants to add the users now. If he wants then we remove all
     * the possible user column and stick to one only. All the other columns will be converted
     * to a `option` field type.
     * 
     * Then we remove the alert and show the modal to add the users in his company.
     * 
     * @param {number} fieldIndex - The index of the column that is a possible user column.
     */
    const onAcceptPossibleUserColumn = (fieldIndex) => {
        for (let i=0; i<pages[selectedPageIndex].fields.length; i++) {
            if (i !== fieldIndex && pages[selectedPageIndex].fields[i].fieldData.fieldTypeName === 'user') {
                onChangeColumn(i, 'option')
            }
        }
        setShowAlert(false)
        setShowAddNewUsers(true)
        setPossibleUsers([possibleUsers[0]])
    }

    /**
     * Callback for when the user clicks the "x" button at the top on the user modal.
     * 
     * When the user don't want to add the users of his company, we convert the possible user column to an option field.
     * we also remove the modal.
     */
    const onCloseSetUsersModal = () => {
        setShowAddNewUsers(false)
        onChangeColumn(possibleUsers[0].headerIndex, 'option')
        setPossibleUsers([])
    }

    const onSubmitUsers = (response) => {
        setShowAddNewUsers(false)
        if (response && response.status === 200) {
            agent.http.USERS.getUsersConfiguration(sourceRef.current).then(response => {
                if (response && response.status === 200) {
                    const usersInCompany = []
                    for (const user of response.data.data) {
                        const fullName = user.first_name + ' ' + user.last_name
                        usersInCompany.push({
                            id: user.id,
                            fullName: fullName,
                            email: user.email
                        })
                    }
                    setUsers(usersInCompany)
                    setPossibleUsers([])
                }
            })
        }
    }

    /**
     * Changes from one page to the other, a page is nothing more that many worksheets in a workbook.
     * 
     * Each page is each worksheet in the workbook.
     * 
     * @param {number} index - The index of the page that the user is changing to.
     */
    const onChangePage = (index) => {
        setSelectedPageIndex(index)
        setOpenedDropdownAtFieldIndex(null)
    }

    const onUploadFile = (files) => {
        if (names.length === 0 && files.length > 0) {
            filesToUpload.current = files[0]
        } else {
            if (files.length > 0 && ![undefined, null].includes(files[0])) {
                if (files[0].name.split('.').pop() === 'xlsx') {              
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        loadWorkbook(e.target.result)
                    }
                    reader.readAsArrayBuffer(files[0])
                    filesToUpload.current = null
                } else {
                    setIsDraggingOver(false)
                    setShowAlertForInvalidFile(true)
                }
            }
        }
    }
    /**
     * This will create an example spreadsheet for the user to be inspired and understand how he should format the sheet. This way it will be kinda obvious how he needs
     * to format the spreadsheet to be able to upload it in reflow.
     * 
     * Reference: https://redstapler.co/sheetjs-tutorial-create-xlsx/
     * And: https://marian-caikovski.medium.com/create-an-xlsx-file-in-a-browser-df52f40961d0
     */
    const onDownloadExampleSpreadsheet = () => {
        if (process.env['APP'] === 'web') {
            const workbook = XLSX.utils.book_new()
            workbook.Props = {
                Title: strings['pt-br']['spreadsheetUploaderExampleSheetTitleLabel'],
                Subject: strings['pt-br']['spreadsheetUploaderExampleSheetSubjectLabel'],
                Author: 'reflow',
                CreatedDate: new Date()
            }
            workbook.SheetNames.push(strings['pt-br']['spreadsheetUploaderExampleSheetWorksheetName'])
            const exampleData = [
                [strings['pt-br']['spreadsheetUploaderExampleSheetClientNameColumn'], 
                strings['pt-br']['spreadsheetUploaderExampleSheetClosingDateColumn'],
                strings['pt-br']['spreadsheetUploaderExampleSheetTotalColumn'], 
                strings['pt-br']['spreadsheetUploaderExampleSheetStatusColumn'], 
                strings['pt-br']['spreadsheetUploaderExampleSheetNotesColumn']], 
                ['Nicolas Leal', new Date(2019, 7, 11), 50000, strings['pt-br']['spreadsheetUploaderExampleSheetStatusColumnPending'], strings['pt-br']['spreadsheetUploaderExampleSheetNotesColumnExampleLabel']],
                ['Lucas Melo', new Date(2020, 1, 7), 50000, strings['pt-br']['spreadsheetUploaderExampleSheetStatusColumnClosed'], strings['pt-br']['spreadsheetUploaderExampleSheetNotesColumnExampleLabel']],
                ['Felipe Veloso', new Date(2020, 8, 19), 20000, strings['pt-br']['spreadsheetUploaderExampleSheetStatusColumnPending'], strings['pt-br']['spreadsheetUploaderExampleSheetNotesColumnExampleLabel']],
            ]
            const worksheet = XLSX.utils.aoa_to_sheet(exampleData)
            workbook.Sheets[strings['pt-br']['spreadsheetUploaderExampleSheetWorksheetName']] = worksheet
            XLSX.writeFile(workbook, `${strings['pt-br']['spreadsheetUploaderExampleSheetFileName']}.xlsx`)
        }
    }

    /**
     * When the user drops the file in the dropzone for the file we just get the file and then activate the onUploadFile function.
     * 
     * @param {Event} event - The event that is triggered when the user drops the file in the dropzone.
     */
    const onDrop = (e) => {
        e.preventDefault()

        if (e.dataTransfer.items && e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === 'file') {
            const file = e.dataTransfer.items[0].getAsFile()
            onUploadFile([file])
        }
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        // we retrieved all of the names from brazil and appended it to a single json file. This json file is stored in our frontend public repository.
        // By doing this we can automatically convert a field type to a user field type and prompt the user for adding the users of this file.
        axios.get(`${FRONT_END_HOST}/utils/names.json`).then(response => {
            setNames(response.data.names)
            if (filesToUpload.current !== null || filesToUpload.current !== undefined) {
                onUploadFile([filesToUpload.current])
            }
        })

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
            <Styled.SpreadsheetUploaderContainer>
                {showAddNewUsers ? (
                    <SimplifiedUserModal
                    callbackOnSubmit={onSubmitUsers}
                    onCloseModal={onCloseSetUsersModal}
                    userFullnamesOrEmails={possibleUsers[0].data.map(value => ([value, '']))}
                    />
                ) : ''}
                <Alert 
                alertTitle={strings['pt-br']['spreadsheetUploaderAlertToAddNewUsersTitle']} 
                alertMessage={strings['pt-br']['spreadsheetUploaderAlertToAddNewUsersMessage'].replace('{}', possibleUsers.length > 0 ? pages[selectedPageIndex].fields[possibleUsers[0].headerIndex].fieldData.label_name : '')} 
                show={showAlert} 
                onHide={() => onRemovePossibleUserColumn(possibleUsers[0].headerIndex)} 
                onAccept={() => onAcceptPossibleUserColumn(possibleUsers[0].headerIndex)}
                onAcceptButtonLabel={strings['pt-br']['spreadsheetUploaderAlertToAddNewUsersAcceptButtonLabel']}
                />
                <Alert 
                alertTitle={strings['pt-br']['spreadsheetUploaderAlertInvalidFileTypeTitle']} 
                alertMessage={strings['pt-br']['spreadsheetUploaderAlertInvalidFileTypeMessage']} 
                show={showAlertForInvalidFile} 
                onHide={() => setShowAlertForInvalidFile(false)} 
                />
                {pages.length > 0 ? (
                    <div>
                        <Styled.SpreadsheetUploaderTitle>
                            {strings['pt-br']['spreadsheetUploaderTitleWhenSelectingFieldTypes']}
                        </Styled.SpreadsheetUploaderTitle>
                        <Styled.SpreadsheetUploaderFormularySelectionContainer>
                            {pages.map((page, index) => (
                                <Styled.SpreadsheetUploaderFormularySelectionButton
                                key={index}
                                isSelected={selectedPageIndex === index}
                                onClick={(e) => onChangePage(index)}
                                >
                                    <Styled.SpreadsheetUploaderFormularySelectionButtonLabel
                                    isSelected={selectedPageIndex === index}
                                    >
                                        {page.pageName}
                                    </Styled.SpreadsheetUploaderFormularySelectionButtonLabel>
                                </Styled.SpreadsheetUploaderFormularySelectionButton>
                            ))}
                        </Styled.SpreadsheetUploaderFormularySelectionContainer>
                        <Styled.SpreadsheetUploaderTableContainer>
                            <Styled.SpreadsheetUploaderTableHeaderContainer>
                                {pages[selectedPageIndex].fields.map((field, index) => (
                                    <Styled.SpreadsheetUploaderTableHeaderWrapper
                                    key={index}
                                    >
                                        <Styled.SpreadsheetUploaderFieldTypeDropdown
                                        index={index}
                                        isLastColumn={index === pages[selectedPageIndex].fields.length - 1}
                                        >
                                            <Styled.SpreadsheetUploaderFieldTypeDropdownButton
                                            onClick={(e) => openedDropdownAtFieldIndex === index ? setOpenedDropdownAtFieldIndex(null) : setOpenedDropdownAtFieldIndex(index)}
                                            >
                                                {getFieldTypeLabel(field.fieldData.fieldTypeName)}
                                                <FontAwesomeIcon icon={'chevron-down'}/>
                                            </Styled.SpreadsheetUploaderFieldTypeDropdownButton>
                                            {openedDropdownAtFieldIndex === index ? (
                                                <Styled.SpreadsheetUploaderFieldTypeDropdownContainerWrapper>
                                                    <Styled.SpreadsheetUploaderFieldTypeDropdownContainer>
                                                        {possibleFieldTypes.map(fieldType => (
                                                            <div
                                                            key={fieldType}
                                                            >
                                                                <Styled.SpreadsheetUploaderFieldTypeDropdownMenuButton 
                                                                onClick={(e) => {
                                                                    setOpenedDropdownAtFieldIndex(null)
                                                                    onChangeColumn(index, fieldType)
                                                                }}
                                                                >
                                                                    {getFieldTypeLabel(fieldType)}
                                                                </Styled.SpreadsheetUploaderFieldTypeDropdownMenuButton>
                                                            </div>
                                                        ))}
                                                    </Styled.SpreadsheetUploaderFieldTypeDropdownContainer>
                                                </Styled.SpreadsheetUploaderFieldTypeDropdownContainerWrapper>
                                            ) : ''}
                                        </Styled.SpreadsheetUploaderFieldTypeDropdown>
                                        <Styled.SpreadsheetUploaderTableHeader
                                        index={index}
                                        isLastColumn={index === pages[selectedPageIndex].fields.length - 1}
                                        >
                                            <Styled.SpreadsheetUploaderTableHeaderLabel>
                                                {field.fieldData.label_name}
                                            </Styled.SpreadsheetUploaderTableHeaderLabel>
                                            <Styled.SpreadsheetUploaderTableHeaderTrashIconButton
                                            onClick={(e) => onRemoveColumn(index)}
                                            >
                                                <Styled.SpreadsheetUploaderTableHeaderTrashIcon icon={'trash'}/>
                                            </Styled.SpreadsheetUploaderTableHeaderTrashIconButton>
                                        </Styled.SpreadsheetUploaderTableHeader>
                                    </Styled.SpreadsheetUploaderTableHeaderWrapper>
                                ))}
                            </Styled.SpreadsheetUploaderTableHeaderContainer>
                            <Styled.SpreadsheetUploaderTableContentContainer>
                                {pages[selectedPageIndex].fields.map((field, index) => (
                                    <Styled.SpreadsheetUploaderTableRow
                                    key={index}
                                    >
                                        {field.values.map((value, valueIndex) => (
                                            <Styled.SpreadsheetUploaderTableContent
                                            key={`${index}${valueIndex}`}
                                            isEven={valueIndex % 2 === 0}
                                            >
                                                <Styled.SpreadsheetUploaderTableContentLabel>
                                                    {value}
                                                </Styled.SpreadsheetUploaderTableContentLabel>
                                            </Styled.SpreadsheetUploaderTableContent>
                                        ))}
                                    </Styled.SpreadsheetUploaderTableRow>
                                ))}
                            </Styled.SpreadsheetUploaderTableContentContainer>
                        </Styled.SpreadsheetUploaderTableContainer>
                        <Styled.SpreadsheetUploaderBottomButtonsContainer>
                            <Styled.SpreadsheetUploaderBottomButton
                            disabled={isSubmitting}
                            onClick={(e) => onSubmitFormulary()}
                            >
                                {strings['pt-br']['spreadsheetUploaderSubmitButtonLabel']}
                            </Styled.SpreadsheetUploaderBottomButton>
                        </Styled.SpreadsheetUploaderBottomButtonsContainer>
                    </div>
                ) : (
                    <Styled.SpreadsheetUploaderClickAndDropContainer
                    isDraggingOver={isDraggingOver}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDraggingOver(true)
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault()
                        setIsDraggingOver(false)
                    }}
                    onDrop={(e) => onDrop(e)}
                    >
                        
                        {isDraggingOver ? (
                            <div>
                                <FontAwesomeIcon icon={'arrow-down'}/>
                                <p>
                                    {strings['pt-br']['spreadsheetUploaderDropTheFilesHereLabel']}
                                </p>

                            </div>
                        ) : (
                            <div>
                                <Styled.SpreadsheetUploaderClickAndDropButtonContainer>
                                    <FontAwesomeIcon icon={'arrow-down'}/>
                                    <p
                                    style={{
                                        margin: 0
                                    }}
                                    >
                                        {strings['pt-br']['spreadsheetUploaderClickOrDragTheFilesHereLabel']}
                                    </p>
                                    <input
                                    style={{
                                        display: 'none'
                                    }}
                                    type={'file'} 
                                    value={''} 
                                    onChange={(e) => onUploadFile(e.target.files)}
                                    />
                                </Styled.SpreadsheetUploaderClickAndDropButtonContainer>
                                <p>
                                    {strings['pt-br']['spreadsheetUploaderOr']}
                                </p>
                                <Styled.SpreadsheetUploaderExampleSheetButton
                                onClick={(e) => onDownloadExampleSpreadsheet()}
                                >
                                    {strings['pt-br']['spreadsheetUploaderExampleSheetDownloadButtonLabel']}
                                </Styled.SpreadsheetUploaderExampleSheetButton>
                            </div>
                        )}
                    </Styled.SpreadsheetUploaderClickAndDropContainer>
                )}
            </Styled.SpreadsheetUploaderContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SpreadsheetUploader
