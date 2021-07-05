import React, { useState, useEffect, memo } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Number from './Number'
import Period from './Period'
import Formula from './Formula'
import Option from './Option'
import Connection from './Connection'
import Datetime from './Datetime'
import Fields from '../Fields'
import { FormulariesEdit }  from '../../../styles/Formulary'
import { types, strings } from '../../../utils/constants'
import deepCopy from '../../../utils/deepCopy'
import Overlay from '../../../styles/Overlay'
import Alert from '../../Utils/Alert'
import agent from '../../../utils/agent'
import isEqual from '../../../utils/isEqual'
import delay from '../../../utils/delay'

let previousFieldProps = {
    formName: '',
    previousProps: {}
}
const makeDelay = delay(1000)

/**
 * This component is used for updating and controlling a single field. This holds all of the formulary data needed
 * in order to create fields in reflow.
 * 
 * @param {Object} field - The object of the field. You can find it's structure in `onAddNewField` function in the 
 * `FormularySectionEdit` component
 * @param {Function} onCreateDraftFile - This function is used to upload and handle drafts, we use this to upload default
 * values, and since an attachment can contain default values we need to use this in order to upload attachments as a default value.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff.
 * @param {Function} onRemoveField - Function defined in `FormularySectionEdit` component used to remove the field, we need to define
 * it in the parent component because we need to have access to the hole fields array data structure.
 * @param {Function} onReorderField - Function defined in `FormularySectionsEdit` component used to reorder field. We defined in the uppermost
 * component because we need to have access to the hole data structure in order to reorder a field.
 * @param {Array<Object>} userOptions - The user options to display on the user field type, just for this actually.
 * @param {String} formName - Similar to formId, this is the name of the formulary, this is usually set in the url when in the home screnn.
 * @param {BigInteger} formId - This is the id of the formulary you are editing.
 * @param {Function} retrieveFormularyData - This is a pure component, this means it doesn't change when the props change, it only changes when it is open. But sometimes
 * we want to get the hole data structure updated, how does we do that? With a callback function that returns to us the data, this way we can retrieve the state updated
 * but without compromising the purity of the components. We usually use this to retrieve field options.
 * @param {Function} setDropEventForFieldInEmptySection - Set the `dropEventForFieldInEmptySection` state. Usually used after the `dropEventForFieldInEmptySection` has been 
 * used.
 * @param {Object} dropEventForFieldInEmptySection - Usually the user drops fields on other fields, but sometimes what happens is that 
 * the user wants to drop fields on empty sections, but how can we do that since we update the field INSIDE of the field component? We use props.
 * This props is an object that hold `movedFieldUUID` and `targetSectionUUID`, with this we can search the indexes of the moved field and the
 * index of the target section.
 * @param {Function} onUpdateFormularySettingsState - Updates the formulary settings state by reference. Update by reference 
 * is not used by many react developers and might seem kinda counter intuitive, it is possibly even an antipatern but since we 
 * use pure components for sections and fields, update by reference seemed as a good solution. To understand more on how this 
 * works read the explanation of the function in `FormularySectionsEdit` component.
 * @param {Function} onUpdateFormularySettingsField - Redux action used for updating the field settings in the backend.
 * @param {Function} onCreateFormularySettingsField - Redux action used for creating a new field in the backend, this just calls an api.
 * @param {Function} onTestFormularySettingsFormulaField - Redux action used for calling the backend to test the formula, this should be deprecated soon.
 */
const FormularyFieldEdit = (props) => {
    const isMountedRef = React.useRef(false)
    const [isFieldTypeSelectorOpen, setIsFieldTypeSelectorOpen] = useState(props.field.id === null)
    const [isEditing, setIsEditing] = useState(props.field.id === null)
    const [fieldErrors, setFieldErrors] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [draftToFileReference, setDraftToFileReference] = useState({})
    const [defaultValueIsOpen, setDefaultValueIsOpen] = useState(false)
    // ------------------------------------------------------------------------------------------
    const onDragFieldStart = (e) => {
        if (process.env['APP'] === 'web') {
            let fieldContainer = e.currentTarget.closest('.field-container')
            let fieldContainerRect = fieldContainer.getBoundingClientRect()
            let elementRect = e.currentTarget.getBoundingClientRect()
            e.dataTransfer.setDragImage(fieldContainer, fieldContainerRect.width - ((fieldContainerRect.width + fieldContainerRect.x) - elementRect.x - (elementRect.width)/2), 20)
            e.dataTransfer.setData('fieldUUIDToMove', JSON.stringify(props.field.uuid))
        }
    }
    // ------------------------------------------------------------------------------------------
    const onDrop = (movedFieldUUID, targetFieldUUID, targetFieldSectionUUID=null) => {
        if (movedFieldUUID !== '') {
            try {
                movedFieldUUID = JSON.parse(movedFieldUUID)
            } catch {}
            if (movedFieldUUID !== targetFieldUUID) {
                try {
                    const fieldDataToUpdate = props.onReorderField(movedFieldUUID, targetFieldUUID, targetFieldSectionUUID)
                    onUpdateField(fieldDataToUpdate)
                } catch (error) {
                    if (error instanceof ReferenceError) {
                        console.warn(error.message)
                    } else {
                        throw error
                    }
                }
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user disables a field it is not visible by the users, it's not even loaded from the backend, with this the user
     * is still able to retrieve the data for this field without deleting it.
     */
    const onDisableField = () => {
        props.field.enabled = !props.field.enabled
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * The same as the section label_name, this is not the name (the slug id of the field), it is the actual label_name
     * that appears on top of the field if `label_is_hidden` is false.
     * 
     * @param {String} fieldName - The string representing the name of the field
     */
    const onChangeFieldName = (fieldName) => {
        props.field.label_name = fieldName
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Changes the type of the field, it can be a text, a option, a connection and so on.
     * 
     * @param {BigInteger} fieldTypeId - The id of the selected field type
     */
    const onChangeFieldType = (fieldTypeId) => {
        props.field.type = fieldTypeId
        onUpdateField(props.field)
        setIsFieldTypeSelectorOpen(false)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is kinda self explanatory, if it's required the user cannot continue without giving a value to it.
     */
    const onChangeRequired = () => {
        props.field.required = !props.field.required
        onUpdateField(props.field)

    }
    // ------------------------------------------------------------------------------------------
    /**
     * This changes if the field is unique, if the field is unique, then needs to exist ONE and JUST ONE
     * data with this value.
     */
    const onChangeIsUnique = () => {
        props.field.is_unique = !props.field.is_unique
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Label is hidden just hides the label and shows the actual field. So the user just update the field and doesn't see 
     * the label.
     */
    const onChangeLabelIsHidden = () => {
        props.field.label_is_hidden = !props.field.label_is_hidden
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Field is hidden just hides the field and shows only the title, this is nice when you want the user to be able to add
     * new connections, or just want a nice title without the field
     */
    const onChangeFieldIsHidden = () => {
        props.field.field_is_hidden = !props.field.field_is_hidden
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is needed because we use the Field component to update the default values, this way we don't
     * need to any special logic to add default values
     * 
     * @param {String} value - The value as string to add.
     */
    const onAddDefaultFieldValue = (__, value) => {
        if (value != '') {
            props.field.field_default_field_values.push({
                id: null,
                value: value
            })
            onUpdateField(props.field)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Similar to `onAddDefaultFieldValue` function. We need this because we use this to remove values from
     * the fields, the fields are used on the formularies, but on this context we just simulate this for adding
     * default fields.
     * 
     * @param {String} value - The removed value
     */
    const onRemoveDefaultFieldValue = (__, value) => {
        props.field.field_default_field_values = props.field.field_default_field_values.filter(defaultFieldValue => defaultFieldValue.value !== value)
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Similar to both `onRemoveDefaultFieldValue` and `onAddDefaultFieldValue` functions. We need this because on the fields
     * we can have many values for a single field, with this we are able to mimic and use this funcionality to add default
     * values to the fields. This function is used to update a field.
     * 
     * @param {String} oldValue - The old value as string that needs to be changed
     * @param {String} newValue - The new value to change the old value to
     */
    const onUpdateDefaultFieldValue = (__, oldValue, newValue) => {
        let hasPassedFirstDefaultValue = false
        // This function only changes singleFormValue, so if the field has two values (it was a multi_option before and now it is a option) we remove the
        // options it had before and fix with only one
        props.field.field_default_field_values = props.field.field_default_field_values.filter(_ => {
            if (hasPassedFirstDefaultValue === false) {
                hasPassedFirstDefaultValue = true
                return true
            } else {
                return false
            }
        })

        for (let i = 0; i<props.field.field_default_field_values.length; i++) {
            if (props.field.field_default_field_values[i].value === oldValue) {
                props.field.field_default_field_values[i].value = newValue
                break
            }
        }
        onUpdateField(props.field)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Adds a new default file attachment value
     * 
     * @param {Blob} file - The file object to add as a default value
     * 
     * @returns {String} - Returns a draft string id
     */
    const onAddDefaultFileAttachment = async (fileName, fieldId, file) => {
        const response = await props.onCreateDraftFile(file)
        if (response && response.status === 200) {
            const draftStringId = response.data.data.draft_string_id
            draftToFileReference[draftStringId] = file.name
            setDraftToFileReference({...draftToFileReference})
            return draftStringId
        }
        return ''
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Retrieves the attachment url to use on the attachments.
     * 
     * @param {String} fileName - The name of the file you want to retrieve the url for
     * 
     * @returns {String} - The url to retrieve the fil
     */
    const onGetAttachmentUrl = async (__, fileName) => {
        return await agent.http.FORMULARY.getFormularySettingsDefaultAttachmentFile(props.formId, props.field.id, fileName)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function used to update the state and also send the information to the backend about the field.
     * 
     * @param {Object} fieldData - The field data, you can see it's structure in `onAddNewField` function in the
     * `FormularySectionEdit` component
     */
    const onUpdateField = (fieldData) => {
        props.onUpdateFormularySettingsState()
        onSubmitFieldChanges(fieldData)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user edits a field, we automatically save or update the field. We give a delay of 1 second, so
     * when the user stops updating the field we automatically update it for him, this way whathever he does is automatically commited
     * without the need of hitting save.
     * 
     * We do this because it's easier to manage this way.
     */
    const onSubmitFieldChanges = (fieldData) => {
        const handleErrors = (responseData) => {
            if (isMountedRef.current) {
                if (responseData.hasOwnProperty('label_name') && responseData.label_name.reason === 'label_name_already_exists') {
                    fieldErrors.push(responseData.label_name.reason)
                    setFieldErrors([...fieldErrors])
                } 
            }
        }

        const dismissErrors = () => {
            if (isMountedRef.current && fieldErrors.length !== 0) {
                setFieldErrors([])
            }
        }

        makeDelay(() => {
            // makes a copy of the section
            const bodyToUpload = deepCopy(fieldData)
            if (![null, -1].includes(bodyToUpload.id)) {
                props.onUpdateFormularySettingsField(bodyToUpload, props.formId, bodyToUpload.id).then(response => {
                    if (response && response.status !== 200 && response?.data?.error) {
                        handleErrors(response?.data?.error)
                    } else {
                        dismissErrors()
                    }}).catch(_ => dismissErrors())
            } else if (props.field.type !== null && props.field.label_name !== '') {
                props.onCreateFormularySettingsField(bodyToUpload, props.formId).then(response => {
                    if (response && response.status === 200 && response.data.data !== null && isMountedRef.current) {
                        props.field.id = response.data.data.id
                        props.onUpdateFormularySettingsState()
                    } else if (response && response.status !== 200 && response?.data?.error) {
                        handleErrors(response?.data?.error)
                    } else {
                        dismissErrors()
                    }
                }).catch(_ => dismissErrors())
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Retrieves if the field has any errors
     * 
     * @returns {Boolean} - Retrieves if the field has any errors, true if it has, otherwise it doesn't have any
     */
    const hasErrors = () => {
        return fieldErrors.includes('label_name_already_exists')
    }
    // ------------------------------------------------------------------------------------------
    /**
     * If you look closely, the defaultFieldValue input is simple, it's just a field but where the label is hidden
     * and the field_is_hidden attribute is set to false.
     * 
     * This way whenever a new field type is created we can set the default value without much issue.
     * 
     * @returns {React.Component<Field>} - The field component to be rendered
     */
    const getDefaultFieldValueInput = () => {
        const fieldData = deepCopy(props.field)
        fieldData.label_is_hidden = true
        fieldData.field_is_hidden = false
        
        const fieldFormValues = props.field.field_default_field_values.map(defaultFieldValue => ({
            id: null,
            field_id: props.field.id,
            field_name: props.field.name,
            value: defaultFieldValue.value
        }))

        return (
            <Fields 
            userOptions={props.userOptions}
            errors={{}}
            field={fieldData}
            formName={props.formName}
            types={props.types}
            draftToFileReference={draftToFileReference}
            fieldFormValues={fieldFormValues}
            getAttachmentUrl={onGetAttachmentUrl}
            addFieldFormValue={onAddDefaultFieldValue}
            removeFieldFormValue={onRemoveDefaultFieldValue}
            updateFieldFormValue={onUpdateDefaultFieldValue}
            getFieldFormValues={() => {return fieldFormValues}}
            onAddFile={onAddDefaultFileAttachment}
            />
        )
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function used to retrieve the fieldTypeName of the field based on it's id
     * 
     * @param {BigInteger} fieldTypeId - The id of the fieldType you want to retrieve the name for
     * 
     * @returns {String} - Returns the name of the field.
     */
    const getFieldTypeNameByFieldTypeId = (fieldTypeId) => {
        const fieldType = props.types.data.field_type.filter(fieldType => fieldType.id === fieldTypeId)
        if (fieldType.length > 0) {
            return fieldType[0].type
        } else {
            return ''
        }
    }
    // ------------------------------------------------------------------------------------------
    const getFieldTypeLabelNameByFieldTypeId = (fieldTypeId) => {
        const fieldType = props.types.data.field_type.filter(fieldType => fieldType.id === fieldTypeId)
        if (fieldType.length > 0) {
            return types('pt-br', 'field_type', fieldType[0].type)
        } else {
            return ''
        }
    }

    // ------------------------------------------------------------------------------------------
    const getIconByFieldTypeName = (fieldTypeName) => {
        switch (fieldTypeName) {
            case 'number':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        1
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                ) 
            case 'text':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        A
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                ) 
            case 'date': 
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'calendar-alt'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'option':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'check'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'form':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'chevron-right'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'attachment':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'paperclip'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'long_text':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'align-left'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'email':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        @
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'multi_option':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'check-double'}/>

                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'id':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        #
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'user':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'user-check'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'period':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        <FontAwesomeIcon icon={'stopwatch'}/>
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
            case 'formula':
                return (
                    <FormulariesEdit.FieldTypeOptionIconContainer>
                        f(x)
                    </FormulariesEdit.FieldTypeOptionIconContainer>
                )
                
        }
        return ''
    }
    // ------------------------------------------------------------------------------------------
    const formularyItemsForFieldTypes = () => {
        const fieldType = getFieldTypeNameByFieldTypeId(props.field.type)

        if (['option', 'multi_option'].includes(fieldType)) {
            return (
                <Option
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                />
            )
        } else if (fieldType === 'number') {
            return (
                <Number
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                retrieveFormularyData={props.retrieveFormularyData}
                formId={props.formId}
                onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                />
            )
        } else if (fieldType === 'period') {
            return (
                <Period
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                />
            )
        } else if (fieldType === 'date') {
            return (
                <Datetime
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                />
            )
        } else if (fieldType === 'form') {
            return (
                <Connection
                formName={props.formName}
                formId={props.formId}
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                />
            )
        } else if (fieldType === 'formula') {
            return (
                <Formula
                field={props.field}
                onUpdateField={onUpdateField}
                types={props.types}
                retrieveFormularyData={props.retrieveFormularyData}
                formId={props.formId}
                onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                />
            )
        } else {
            return null
        }
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMountedRef.current = true
        
        return () => {
            isMountedRef.current = false
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.dropEventForFieldInEmptySection.movedFieldUUID === props.field.uuid)  {
            onDrop(props.field.uuid, null, props.dropEventForFieldInEmptySection.targetSectionUUID)
            props.setDropEventForFieldInEmptySection({
                targetSectionUUID: '',
                movedFieldUUID: ''
            })
        }
    }, [props.dropEventForFieldInEmptySection])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (isEditing === false) {
            if (props.field.field_default_field_values.length > 0) {
                setDefaultValueIsOpen(true)
            } else {
                setDefaultValueIsOpen(false)
            }
        }
    }, [isEditing])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.field.field_default_field_values.length > 0) {
            setDefaultValueIsOpen(true)
        } else {
            setDefaultValueIsOpen(false)
        }
    }, [props.field.field_default_field_values])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //#########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //#########################################################################################//
    const renderWeb = () => {
        return (
            <FormulariesEdit.FieldContainer 
            className="field-container" 
            isEditing={isEditing}
            onDragOver={e=>{
                e.preventDefault()
                e.stopPropagation()
            }} 
            onDrop={e=>{
                e.preventDefault()
                e.stopPropagation()
                onDrop(e.dataTransfer.getData('fieldUUIDToMove'), props.field.uuid)
                e.dataTransfer.clearData()
            }}
            >
                <Alert 
                alertTitle={strings['pt-br']['formularyEditRemoveFieldAlertTitle']} 
                alertMessage={strings['pt-br']['formularuEditRemoveFieldAlertContent']} 
                show={showAlert} 
                onHide={() => {
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    props.onRemoveField(props.field.uuid)
                }}
                onAcceptButtonLabel={strings['pt-br']['formularuEditRemoveFieldAlertAcceptButtonLabel']}
                />
                <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                        {props.field.label_is_hidden ? (
                            <small 
                            style={{color: '#bfbfbf', margin: '0'}}
                            >
                                {props.field.label_name}
                            </small>
                        ) : <small/>}
                        <div style={{height: '1em', margin: '5px'}}>
                            <Overlay text={strings['pt-br']['formularyEditFieldTrashIconPopover']}>
                                <FormulariesEdit.Icon.FieldIcon 
                                size="sm" 
                                icon="trash" 
                                onClick={e=> setShowAlert(true)}
                                />
                            </Overlay>
                            {isFieldTypeSelectorOpen === false ? (
                                <React.Fragment>
                                    <Overlay text={(props.field.enabled) ? strings['pt-br']['formularyEditFieldEyeIconPopover'] : strings['pt-br']['formularyEditFieldEyeSlashIconPopover']}>
                                        <FormulariesEdit.Icon.FieldIcon 
                                        size="sm" 
                                        icon={(props.field.enabled) ? 'eye' : 'eye-slash'} 
                                        onClick={e=> onDisableField()}
                                        />
                                    </Overlay>
                                    <Overlay text={strings['pt-br']['formularyEditFieldMoveIconPopover']}>
                                        <div 
                                        style={{ float:'right' }} 
                                        draggable="true" 
                                        onDragStart={e => {onDragFieldStart(e)}} 
                                        onDrag={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }} 
                                        onDragEnd={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}>
                                            <FormulariesEdit.Icon.FieldIcon 
                                            size="sm" 
                                            icon="arrows-alt"
                                            />
                                        </div>
                                    </Overlay>
                                    <Overlay text={(isEditing) ? strings['pt-br']['formularyEditFieldIsNotEditingIconPopover'] : strings['pt-br']['formularyEditFieldIsEditingIconPopover']}>
                                        <FormulariesEdit.Icon.FieldIcon 
                                        size="sm" 
                                        icon="pencil-alt" 
                                        onClick={e=> setIsEditing(!isEditing)} 
                                        isEditing={isEditing}
                                        />
                                    </Overlay>
                                </React.Fragment>
                            ) : ''}
                        </div>
                    </div>
                    {isFieldTypeSelectorOpen ? (
                        <div>
                            <FormulariesEdit.FieldFormLabel>
                                {'Selecione o tipo do campo'}
                            </FormulariesEdit.FieldFormLabel>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '10px'}}>
                                {props.types.data.field_type.map(fieldType => (
                                    <FormulariesEdit.FieldTypeOptionButton 
                                    key={fieldType.id}
                                    isSelected={fieldType.id === props.field.type}
                                    onClick={(e) => onChangeFieldType(fieldType.id)}>
                                        {getIconByFieldTypeName(fieldType.type)}
                                        &nbsp;
                                        {types('pt-br', 'field_type', fieldType.type)}
                                    </FormulariesEdit.FieldTypeOptionButton>
                                ))}
                            </div>
                        </div>
                    ) : props.field.enabled ? (
                        <div>
                            {props.field.id !== null ? 
                            props.field.type !== null ? (
                                <div>
                                    <Fields 
                                    userOptions={props.userOptions}
                                    errors={{}}
                                    formName={props.formName}
                                    field={props.field}
                                    types={props.types}
                                    fieldFormValues={[]}
                                    />
                                </div>
                            ) : (
                                <p>
                                    {strings['pt-br']['formularyEditFieldNoFieldTypeLabel']}
                                </p>
                            ) : ''}
                            {isEditing ? (
                                <FormulariesEdit.FieldFormularyContainer>
                                    <FormulariesEdit.FieldFormFieldContainer>
                                        <FormulariesEdit.FieldFormLabel>
                                            {strings['pt-br']['formularyEditFieldNameInputLabel']}
                                        </FormulariesEdit.FieldFormLabel>
                                        <FormulariesEdit.InputField 
                                        autoComplete={'whathever'} 
                                        type="text" 
                                        value={props.field.label_name} 
                                        onChange={e=> {onChangeFieldName(e.target.value)}}
                                        errors={hasErrors()}
                                        />
                                        {hasErrors() ? (
                                            <small style={{color: 'red'}}>
                                                {strings['pt-br']['formularyEditFieldNameErrorUniqueValuesOnlyLabel']}
                                            </small>
                                        ) : ''}
                                    </FormulariesEdit.FieldFormFieldContainer>
                                    {props.field.label_name ? (
                                        <div>
                                            <FormulariesEdit.FieldFormFieldContainer>
                                                <FormulariesEdit.FieldFormLabel>
                                                    {strings['pt-br']['formularyEditFieldTypeSelectorLabel']}
                                                </FormulariesEdit.FieldFormLabel>
                                                <FormulariesEdit.FieldTypeButton
                                                onClick={(e) => setIsFieldTypeSelectorOpen(!isFieldTypeSelectorOpen)}>
                                                    {getIconByFieldTypeName(getFieldTypeNameByFieldTypeId(props.field.type))}
                                                    &nbsp;
                                                    {getFieldTypeLabelNameByFieldTypeId(props.field.type)}
                                                </FormulariesEdit.FieldTypeButton>
                                            </FormulariesEdit.FieldFormFieldContainer>
                                            {getFieldTypeNameByFieldTypeId(props.field.type) !== 'form' ? (
                                                <FormulariesEdit.FieldFormFieldContainer>
                                                    <FormulariesEdit.FieldFormLabel>
                                                        {strings['pt-br']['formularyEditFieldDefaultValuesLabel']}
                                                    </FormulariesEdit.FieldFormLabel>
                                                    {defaultValueIsOpen ? (
                                                        <div style={{ margin: '-5px' }}>
                                                            {getDefaultFieldValueInput()}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <small style={{ color: '#6a7074'}}>
                                                                {strings['pt-br']['formularyEditFieldDefaultValuesExplanation']}
                                                            </small>
                                                            <div>
                                                                <FormulariesEdit.FieldFormAddDefaultValueButton onClick={(e) => setDefaultValueIsOpen(true)}>
                                                                    {strings['pt-br']['formularyEditFieldDefaultValuesButton']}
                                                                </FormulariesEdit.FieldFormAddDefaultValueButton>
                                                            </div>
                                                        </div>
                                                    )}
                                                </FormulariesEdit.FieldFormFieldContainer>
                                            ) : ''}
                                            <FormulariesEdit.FieldFormFieldContainer>
                                                <FormulariesEdit.FieldFormCheckbox checked={props.field.required} onChange={onChangeRequired} text={strings['pt-br']['formularyEditFieldIsRequiredCheckboxLabel']}/>
                                                <FormulariesEdit.FieldFormCheckboxDivider/>
                                                <FormulariesEdit.FieldFormCheckbox checked={props.field.label_is_hidden} onChange={onChangeLabelIsHidden} text={strings['pt-br']['formularyEditFieldLabelIsVisibleCheckboxLabel']}/>
                                                <FormulariesEdit.FieldFormCheckboxDivider/>
                                                <FormulariesEdit.FieldFormCheckbox checked={props.field.field_is_hidden} onChange={onChangeFieldIsHidden} text={strings['pt-br']['formularyEditFieldIsVisibleCheckboxLabel']}/>
                                                <FormulariesEdit.FieldFormCheckboxDivider/>
                                                <FormulariesEdit.FieldFormCheckbox checked={props.field.is_unique} onChange={onChangeIsUnique} text={strings['pt-br']['formularyEditFieldIsUniqueCheckboxLabel']}/>
                                            </FormulariesEdit.FieldFormFieldContainer>
                                            {formularyItemsForFieldTypes()}
                                        </div>
                                    ) : ''}
                                </FormulariesEdit.FieldFormularyContainer>
                            ): ''}
                        </div>
                    ) : (
                        <p>
                            {strings['pt-br']['formularyEditFieldDisabledLabel']}
                        </p>
                    )}
                </React.Fragment>  
            </FormulariesEdit.FieldContainer>
        )
    }
    //#########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

const areEqual = (prevProps, nextProps) => {
    let areThemEqual = true

    if (nextProps.formName !== previousFieldProps.formName) {
        previousFieldProps = {
            formName: nextProps.formName,
            previousProps: {}
        }
    }

    if (Object.keys(previousFieldProps.previousProps).includes(nextProps.field.uuid)) {
        prevProps = previousFieldProps.previousProps[nextProps.field.uuid]
    } else {
        areThemEqual = false
    }

    if (nextProps.dropEventForFieldInEmptySection.movedFieldUUID === nextProps.field.uuid) {
        areThemEqual = false
    }

    let auxiliaryNextProps = deepCopy(nextProps)
    let auxiliaryPrevProps = deepCopy(prevProps)

    delete auxiliaryNextProps.dropEventForFieldInEmptySection
    delete auxiliaryPrevProps.dropEventForFieldInEmptySection
    
    if (!isEqual(auxiliaryPrevProps, auxiliaryNextProps)) {
        areThemEqual = false
    }
    
    previousFieldProps.previousProps[nextProps.field.uuid] = deepCopy(nextProps)
    return areThemEqual
}


export default memo(FormularyFieldEdit, areEqual)