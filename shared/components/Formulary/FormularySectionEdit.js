import React, { useState, useEffect, memo } from 'react'
import { View } from 'react-native'
import FormularyFieldEdit from './FieldsEdit'
import FormularySectionEditForm from './FormularySectionEditForm'
import Overlay from '../../styles/Overlay'
import Alert from '../Utils/Alert'
import { strings } from '../../utils/constants'
import { FormulariesEdit } from '../../styles/Formulary'
import deepCopy from '../../utils/deepCopy'
import delay from '../../utils/delay'
import isEqual from '../../utils/isEqual'
import generateUUID from '../../utils/generateUUID'


let previousSectionProps = {
    formName: '',
    previousProps: {}
}
const makeDelay = delay(1000)

/**
 * This component controls the edition state of a SINGLE Section only,
 * it holds the formulary to change the section type and 
 * section conditionals but also holds all of the fields of the section. This section component
 * also holds most of the logics of the fields like create a new field, delete a field or even a 
 * simple helper when the field is moved to an empty section
 * 
 * @param {Function} onUpdateFormularySettingsState - Updates the formulary settings state by 
 * reference. Update by reference is not used by many react developers and mind seem kinda counter intuitive, 
 * it is possibly even an antipatern but since we use pure components for sections and fields, update by reference, 
 * seemed as a good solution. To understand more on how this works read the explanation of the function in `FormularySectionsEdit`
 * component.
 * @param {Object} section - Holds the section data, to understand how this data is shaped you might want to look `onAddNewSection()`
 * function in the `FormularySectionsEdit` component. 
 * @param {Function} onRemoveSection - Everything like remove, add or move sections are handled by the parent component
 * since we need to have access of the hole data structure. The function in the parent component takes care of submiting this to the 
 * backend.
 * @param {Boolean} isMoving - While we are moving a section, all of the sections collapses its fields, and when we stop moving
 * the fields shows up again.
 * @param {Function} onReorderSection - All of the reorders should be handled in the `FormularySectionsEdit` since we need to access the hole
 * structure of the data in order to make a reorder of fields and sections.
 * @param {Function} onReorderField - Same as above but for fields instead of sections
 * @param {Function} setIsMoving - changes the isMoving state
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff.
 * @param {Function} onCreateDraftFile - This function is used to upload and handle drafts, we use this to upload default
 * values, and since an attachment can contain default values we need to use this in order to upload attachments as a default value.
 * @param {Object} dropEventForFieldInEmptySection - Usually the user drops fields on other fields, but sometimes what happens is that 
 * the user wants to drop fields on empty sections, but how can we do that since we update the field INSIDE of the field component? We use props.
 * This props is an object that hold `movedFieldUUID` and `targetSectionUUID`, with this we can search the indexes of the moved field and the
 * index of the target section.
 * @param {Function} setDropEventForFieldInEmptySection - Set the `dropEventForFieldInEmptySection` state. Usually used onDrop event when you drop a field
 * inside of an empty section.
 * @param {Function} retrieveFormularyData - This is a pure component, this means it doesn't change when the props change, it only changes when it is open. But sometimes
 * we want to get the hole data structure updated, how does we do that? With a callback function that returns to us the data, this way we can retrieve the state updated
 * but without compromising the purity of the components. We usually use this to retrieve field options.
 * @param {Function} onUpdateFormularySettingsField - Redux action used for updating the field settings in the backend.
 * @param {Function} onCreateFormularySettingsField - Redux action used for creating a new field in the backend, this just calls an api.
 * @param {Function} onRemoveFormularySettingsField - Redux action used for removing an existing field from the backend database.
 * @param {Function} onUpdateFormularySettingsSection - Redux action used for updating an existing section in the backend database.
 * @param {Function} onCreateFormularySettingsSection - Redux action used for creating a section in the backend database.
 * @param {Function} onTestFormularySettingsFormulaField - Redux action used for calling the backend to test the formula, this should be deprecated soon.
 * @param {String} formName - Similar to formId, this is the name of the formulary, this is usually set in the url when in the home screnn.
 * @param {BigInteger} formId - This is the id of the formulary you are editing.
 * @param {Array<Object>} userOptions - The user options to display on the user field type, just for this actually.
 */
const FormularySectionEdit = (props) => {
    const isMountedRef = React.useRef(false)
    const isMovingSectionRef = React.useRef(false)
    const [errors, setErrors] = useState({})
    const [openedSection, setOpenedSection] = useState(false)
    const [isConditional, setIsConditional] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    // ------------------------------------------------------------------------------------------
    /**
     * Changes the label name of the section (remember that the section name (the one that works like an id) is created
     * in the backend, and NOT on the front-end)
     * 
     * @param {String} sectionLabelName - The new section label name
     */
    const onChangeSectionName = (sectionLabelName) => {
        props.section.label_name = sectionLabelName
        onUpdateSection(props.section)
        setErrors({})
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user enables or disables a section we call this function
     */
    const onDisableSection = () => {
        props.section.enabled = !props.section.enabled 
        onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Adds a new field below all of the fields in the section. As default we create always a text field type.
     */
    const onAddNewField = () => {
        const uuid = generateUUID()
        const defaultFieldData = {
            id: null,
            field_option: [],
            field_default_field_values: [],
            form_field_as_option : null,
            name: '',
            uuid: uuid,
            form: props.section.id,
            formula_configuration: null,
            field_formula_variables: [],
            is_long_text_rich_text: false,
            label_name: '',
            placeholder: '',
            required: false,
            order: 0,
            is_unique: false,
            field_is_hidden: false,
            label_is_hidden: false,
            date_configuration_auto_create: false,
            date_configuration_auto_update:	false,
            number_configuration_allow_negative: true,
            number_configuration_allow_zero: true,
            enabled: true,
            date_configuration_date_format_type: (props.types.data.field_date_format_type && props.types.data.field_date_format_type.filter(dateFormat=> dateFormat.type === 'date').length > 0) ? props.types.data.field_date_format_type.filter(dateFormat=> dateFormat.type=== 'date')[0].id : 1,
            period_configuration_period_interval_type: (props.types.data.field_period_interval_type && props.types.data.field_period_interval_type.filter(periodFormat=> periodFormat.type === 'date').length > 0) ? props.types.data.field_period_interval_type.filter(periodFormat=> periodFormat.type === 'date')[0].id : 4,
            number_configuration_number_format_type: (props.types.data.field_number_format_type && props.types.data.field_number_format_type.filter(numberFormat=> numberFormat.type === 'number').length > 0) ? props.types.data.field_number_format_type.filter(numberFormat=> numberFormat.type === 'number')[0].id : 1,
            type: null
        }
        props.section.form_fields.push(defaultFieldData)
        props.onUpdateFormularySettingsState()
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Removes a field from the section based on a field a uuid. 
     * 
     * @param {String} fieldUUID - The uuid of the field to be removed
     */
    const onRemoveField = (fieldUUID) => {
        const fieldIndex = props.section.form_fields.findIndex(field => field.uuid === fieldUUID)
        
        if (fieldIndex !== -1) {
            if (props.section.form_fields[fieldIndex].id !== null) {
                props.onRemoveFormularySettingsField(props.formId, props.section.form_fields[fieldIndex].id)
            }
            props.section.form_fields.splice(fieldIndex, 1)
            props.onUpdateFormularySettingsState()
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Submit to the backend in real time the changes in the section, if the section is created adds the id to the section,
     * if not just update the section with the data that you inserted here. It's important to understand that this must respect 
     * a delay of certain seconds.
     * 
     * @param {Object} sectionData - check `onAddNewSection` function in the FormularySectionsEdit for reference of the data recieved
     */
    const onSubmitSectionChanges = (sectionData) => {
        const handleErrors = (response) => {
            if (response.data.status === 'error' && response.data.error !== null && response.data.error.reason && response.data.error.detail) {
                if (response.data.error.reason.includes('must_be_unique') && response.data.error.detail.includes('label_name')) {
                    const errors = {}
                    errors[sectionData.uuid] = 'must_be_unique'
                    setErrors(errors)
                }
            }
        }

        makeDelay(() => {
            // makes a copy of the section
            const bodyToUpload = deepCopy(sectionData)
            if (![null, -1].includes(bodyToUpload.id)) {
                props.onUpdateFormularySettingsSection(bodyToUpload, props.formId, bodyToUpload.id).then(response => {
                    handleErrors(response)
                })
            } else {
                props.onCreateFormularySettingsSection(bodyToUpload, props.formId).then(response => {
                    if (response && response.status === 200 && response.data.data !== null && isMountedRef.current) {
                        props.section.id = response.data.data.id
                        props.onUpdateFormularySettingsState()
                    }
                    handleErrors(response)
                })
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * THIS IS REQUIRED BECAUSE OF YOUR BELOVED TRASH GOOGLE CHROME, IF WE DISMISS THE SCROLL DIRECTLY WHEN THE USER
     * MOVES IT CAUSES A BUG. The bug is: the scroll goes back to the top and the drag is dismissed.
     * 
     * @param {Boolean} isMoving - Set to true if the user is moving a section, and false if not. 
     */

    const setIsMovingSection = (data) => {
        if (data === true) {
            setTimeout(() => {if (isMovingSectionRef.current) props.setIsMoving(true)}, 100)
        } else {
            props.setIsMoving(false)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handles when the dragging of the section start, with this we automatically collapse the fields and lets the user freely 
     * drag the section so he can reorder them.
     * 
     * @param {import('react').SyntheticEvent} e - The event object recieved by onDragStart event. 
     */
    const onDragSectionStart = (e) => {
        if (process.env['APP'] === 'web') {
            let sectionContainer = e.currentTarget.closest('.section-container')
            let elementRect = sectionContainer.getBoundingClientRect()
            const buttonRect = e.currentTarget.getBoundingClientRect()
            e.dataTransfer.setDragImage(sectionContainer, elementRect.width - (window.innerWidth - buttonRect.right - buttonRect.width), 20)
            e.dataTransfer.setData('sectionUUIDToMove', JSON.stringify(props.section.uuid))
            isMovingSectionRef.current = true
            setIsMovingSection(isMovingSectionRef.current)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user drops a section in a certain position, what we actually do is get the index of the section and then
     * call the callback function in the parent component
     * 
     * @param {*} e 
     */
    const onDrop = (sectionUUIDToMove, movedFieldUUID) => {
        if (sectionUUIDToMove !== '' && props.section.uuid !== sectionUUIDToMove) {
            let movedSectionUUID = JSON.parse(sectionUUIDToMove)
            try {
                const sectionDataToUpdate = props.onReorderSection(movedSectionUUID, props.section.uuid)
                onUpdateSection(sectionDataToUpdate)
            } catch (e) {
                if (e instanceof ReferenceError) {
                    console.warn(e.message)
                } else {
                    throw e
                }
            }
        }
        if (movedFieldUUID !== '' && props.section.form_fields.length === 0) {
            movedFieldUUID = JSON.parse(movedFieldUUID)
            props.setDropEventForFieldInEmptySection({
                movedFieldUUID: movedFieldUUID,
                targetSectionUUID: props.section.uuid
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function to be called whenever the user change something in the section.
     */
    const onUpdateSection = (sectionData) => {
        props.onUpdateFormularySettingsState()
        onSubmitSectionChanges(sectionData)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * We call the function to update the section here because this way we update the dragged element and not
     * the one that was dropped. Also set isMoving to false to identify that the user is not moving anything
     */
    const onDragEnd = () => {
        isMovingSectionRef.current = false
        setIsMovingSection(isMovingSectionRef.current)
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
    useEffect(()=>{
        setIsConditional(props.section?.conditional_on_field !== null || props.section?.conditional_value !== null || props.section?.conditional_type !== null)
    }, [props.section])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <FormulariesEdit.Section.Container>
                <Alert 
                alertTitle={strings['pt-br']['formularyEditRemoveSectionAlertTitle']} 
                alertMessage={strings['pt-br']['formularuEditRemoveSectionAlertContent']} 
                show={showAlert} 
                onHide={() => setShowAlert(false)} 
                onAccept={() => {
                    setShowAlert(false)
                    props.onRemoveSection(props.section.uuid)
                }}
                onAcceptButtonLabel={strings['pt-br']['formularuEditRemoveSectionAlertAcceptButtonLabel']}
                />
                <FormulariesEdit.Section.TitleAndIconsContainer 
                isConditional={isConditional} 
                className="section-container" 
                onDragOver={e => {
                    e.preventDefault()
                    e.stopPropagation()
                }} 
                onDrop={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDrop(
                        e.dataTransfer.getData('sectionUUIDToMove'), 
                        e.dataTransfer.getData('fieldUUIDToMove')
                    )
                    e.dataTransfer.clearData()
                }}
                >
                    <div style={{height: '1em', margin: '10px 0 0 0'}}>
                        <Overlay text={strings['pt-br']['formularyEditSectionTrashIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon 
                            size="sm" 
                            icon="trash" 
                            onClick={e=> setShowAlert(true)} 
                            isConditional={isConditional}
                            />
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionEyeIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon 
                            size="sm" 
                            icon="eye" 
                            onClick={e=> onDisableSection()} 
                            isConditional={isConditional}
                            />
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionMoveIconPopover']}>
                            <div 
                            style={{ float:'right' }} 
                            draggable="true" 
                            onDrag={e=> {
                                e.preventDefault()
                                e.stopPropagation()
                            }} 
                            onDragStart={e=> onDragSectionStart(e)} 
                            onDragEnd={e=> {
                                e.preventDefault()
                                e.stopPropagation()
                                onDragEnd()
                            }}
                            >
                                <FormulariesEdit.Icon.SectionIcon 
                                size="sm" 
                                icon="arrows-alt" 
                                isConditional={isConditional}/>
                            </div>
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionIsEditingIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon 
                            size="sm" 
                            icon="pencil-alt" 
                            onClick={e => setOpenedSection(!openedSection)}
                            isEditing={openedSection} 
                            isConditional={isConditional}
                            />
                        </Overlay>
                    </div>
                    {props.section.enabled ? (
                        <React.Fragment>
                            {props.section.show_label_name ? null : (
                                <div style={{ padding: '0 10px'}}>
                                    <small style={{ margin: 0, color: '#ffffff90'}}>
                                        {strings['pt-br']['formularyEditSectionHiddenTitleLabel']}
                                    </small>
                                </div>
                            )}
                            <FormulariesEdit.Section.LabelInput
                            autoComplete={'whathever'} 
                            value={props.section.label_name}
                            placeholder={strings['pt-br']['formularyEditSectionPlaceholderLabel']} 
                            onChange={e=> {onChangeSectionName(e.target.value)}} 
                            isConditional={isConditional}
                            errors={errors[props.section.uuid] && errors[props.section.uuid] === 'must_be_unique'}
                            />
                            {errors[props.section.uuid] && errors[props.section.uuid] === 'must_be_unique' ? (
                                <small style={{color: 'red', padding: '0 10px'}}>
                                    {strings['pt-br']['formularyEditSectionMustBeUniqueErrorLabel']}
                                </small>
                            ): ''}
                        </React.Fragment>
                    ) : (
                        <FormulariesEdit.Section.DisabledLabel 
                        isConditional={isConditional}
                        >
                            {strings['pt-br']['formularyEditSectionDisabledLabel']}
                        </FormulariesEdit.Section.DisabledLabel>
                    )}
                </FormulariesEdit.Section.TitleAndIconsContainer>
                {props.section.enabled && !props.isMoving ? (
                    <div>
                        {openedSection ? (
                            <FormulariesEdit.Section.Formulary.Container isConditional={isConditional}>
                                <FormularySectionEditForm
                                types={props.types}
                                isConditional={isConditional}
                                setIsConditional={setIsConditional}
                                section={props.section}
                                onUpdateSection={onUpdateSection}
                                retrieveFormularyData={props.retrieveFormularyData}
                                />
                            </FormulariesEdit.Section.Formulary.Container>
                        ) : (
                            <div>
                                {![null, -1].includes(props.section.id) ? (
                                    <FormulariesEdit.FieldsContainer>
                                        <div>
                                            {props.section.form_fields.map(field => (
                                                <FormularyFieldEdit
                                                key={field.uuid}
                                                field={field}
                                                onCreateDraftFile={props.onCreateDraftFile}
                                                types={props.types}
                                                onRemoveField={onRemoveField}
                                                onReorderField={props.onReorderField}
                                                userOptions={props.userOptions}
                                                formName={props.formName}
                                                formId={props.formId}
                                                retrieveFormularyData={props.retrieveFormularyData}
                                                setDropEventForFieldInEmptySection={props.setDropEventForFieldInEmptySection}
                                                dropEventForFieldInEmptySection={props.dropEventForFieldInEmptySection}
                                                onUpdateFormularySettingsField={props.onUpdateFormularySettingsField}
                                                onCreateFormularySettingsField={props.onCreateFormularySettingsField}
                                                onUpdateFormularySettingsState={props.onUpdateFormularySettingsState}
                                                onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                                                />
                                            ))}
                                            <FormulariesEdit.AddNewFieldButton text={strings['pt-br']['formularyEditAddNewFieldButtonLabel']} onClick={e=>{onAddNewField()}}/>
                                        </div>
                                    </FormulariesEdit.FieldsContainer>
                                ) : ''}
                            </div>
                        )}
                    </div>
                ) : ''}
            </FormulariesEdit.Section.Container>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

const areEqual = (prevProps, nextProps) => {
    let areThemEqual = true
    if (nextProps.formName !== previousSectionProps.formName) {
        previousSectionProps = {
            formName: nextProps.formName,
            previousProps: {}
        }
    }
    if (Object.keys(previousSectionProps.previousProps).includes(nextProps.section.uuid)) {
        prevProps = previousSectionProps.previousProps[nextProps.section.uuid]
    } else {
        areThemEqual = false
    }
    
    const fieldUUIDsOfSection = nextProps.section.form_fields.map(field => field.uuid)
    if (fieldUUIDsOfSection.includes(nextProps.dropEventForFieldInEmptySection.movedFieldUUID)) {
        areThemEqual = false
    }
    
    let auxiliaryNextProps = deepCopy(nextProps)
    let auxiliaryPrevProps = deepCopy(prevProps)

    delete auxiliaryNextProps.dropEventForFieldInEmptySection
    delete auxiliaryPrevProps.dropEventForFieldInEmptySection
    
    if (!isEqual(auxiliaryPrevProps, auxiliaryNextProps)) {
        areThemEqual = false
    }
    
    previousSectionProps.previousProps[nextProps.section.uuid] = deepCopy(nextProps)
    return areThemEqual
}

export default memo(FormularySectionEdit, areEqual)