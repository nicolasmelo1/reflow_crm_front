import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'
import FormularyFieldsEdit from './FormularyFieldsEdit'
import FormularySectionEditForm from './FormularySectionEditForm'
import Overlay from '../../styles/Overlay'
import Alert from '../Utils/Alert'
import { strings } from '../../utils/constants'
import { FormulariesEdit } from '../../styles/Formulary'

/**
 * This component controls the edition state of a SINGLE Section only,
 * it holds the formulary to change the section type and 
 * section conditionals but also holds all of the fields of the section
 * 
 * @param {function} onUpdateSection - function helper created in the parent component to 
 * update a single section in the data store
 * @param {function} onUpdateField - function helper created in the parent component to 
 * update a single field in the data store, this function is passed to the field directly
 * @param {BigInteger} sectionIndex - the index of the section inside of the section array
 * @param {Object} section - the SINGLE section data
 * @param {Boolean} fieldIsMoving - boolean that defines if the field is being dragged or not
 * @param {function} setFieldIsMoving - function to set true or false in the `fieldIsMoving` variable to say
 * if the field is being dragged or not.
 * @param {function} removeSection - function helper created in the parent component to remove a single section
 * @param {function} removeField - function helper created in the parent component to remove a single field
 * @param {Boolean} isMoving - boolean that defines if the section is being dragged or not
 * @param {function} setIsMoving - function to set true or false in the `isMoving` variable to say
 * if the section is being dragged or not.
 * @param {function} onMoveSection - function helper created in the parent component to update 
 * a single section when it has been dragged and dropped
 * @param {function} onMoveField - function helper created in the parent component to update 
 * a single field when it has been dragged and dropped
 * @param {function} onAddNewField - function helper created in the parent component to add a new field in the 
 * storage data
 * @param {object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Array<Object>} fieldOptions - the fieldOptions are all of the fields the user can select when a user selects
 * the `form` field type or when the user creates a conditional section
 * @param {Array<Object>} formulariesOptions - the formulariesOptions are all of the formularies the user can select when a user selects
 * the `form` field type or when the user creates a conditional section
 */
const FormularySectionEdit = (props) => {
    const isMoving = React.useRef(false)
    const formulariesOptions = useSelector(state => state.home.sidebar.initial)
    const [openedSection, setOpenedSection] = useState(false)
    const [isConditional, setIsConditional] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    // ------------------------------------------------------------------------------------------
    const onChangeSectionName = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.section.label_name = e.target.value
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }
    // ------------------------------------------------------------------------------------------
    const onDisableSection = (e) => {
        props.section.enabled = !props.section.enabled 
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }
    // ------------------------------------------------------------------------------------------
    const onRemoveSection = () => {
        props.removeSection(props.sectionIndex)
    }
    // ------------------------------------------------------------------------------------------
    // THIS IS REQUIRED BECAUSE OF YOUR BELOVED TRASH GOOGLE CHROME, IF WE DISMISS THE SCROLL DIRECTLY WHEN THE USER
    // MOVES IT CAUSES A BUG. The bug is: the scroll goes back to the top and the drag is dismissed.
    const setIsMoving = (data) => {
        if (data === true) {
            setTimeout(() => {if (isMoving.current) props.setIsMoving(true)}, 100)
        } else {
            props.setIsMoving(false)
        }
    }
    // ------------------------------------------------------------------------------------------
    const onMoveSection = (e) => {
        let sectionContainer = e.currentTarget.closest('.section-container')
        let elementRect = sectionContainer.getBoundingClientRect()
        const buttonRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(sectionContainer, elementRect.width - (window.innerWidth - buttonRect.right - buttonRect.width), 20)
        e.dataTransfer.setData('sectionIndexToMove', JSON.stringify(props.sectionIndex))
        isMoving.current = true
        setIsMoving(isMoving.current)
    }
    // ------------------------------------------------------------------------------------------
    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.getData('sectionIndexToMove') !== '') {
            let movedSectionIndex = JSON.parse(e.dataTransfer.getData('sectionIndexToMove'))
            props.onMoveSection(movedSectionIndex, props.sectionIndex)
        }
    }
    // ------------------------------------------------------------------------------------------
    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    // ------------------------------------------------------------------------------------------
    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    // ------------------------------------------------------------------------------------------
    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        isMoving.current = false
        setIsMoving(isMoving.current)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(()=>{
        setIsConditional(props.section.conditional_on_field !== null || props.section.conditional_value !== null || props.section.conditional_type !== null)
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
                onHide={() => {
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    onRemoveSection()
                }}
                onAcceptButtonLabel={strings['pt-br']['formularuEditRemoveSectionAlertAcceptButtonLabel']}
                />
                <FormulariesEdit.Section.TitleAndIconsContainer isConditional={isConditional} className="section-container" onDragOver={e => {onDragOver(e)}} onDrop={e => {onDrop(e)}}>
                    <div style={{height: '1em', margin: '10px 0 0 0'}}>
                        <Overlay text={strings['pt-br']['formularyEditSectionTrashIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon size="sm" icon="trash" onClick={e=> {setShowAlert(true)}} isConditional={isConditional}/>
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionEyeIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon size="sm" icon="eye" onClick={e=> {onDisableSection(e)}} isConditional={isConditional}/>
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionMoveIconPopover']}>
                            <div style={{ float:'right' }} draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveSection(e)}} onDragEnd={e=>{onDragEnd(e)}}>
                                <FormulariesEdit.Icon.SectionIcon size="sm" icon="arrows-alt" isConditional={isConditional}/>
                            </div>
                        </Overlay>
                        <Overlay text={strings['pt-br']['formularyEditSectionIsEditingIconPopover']}>
                            <FormulariesEdit.Icon.SectionIcon size="sm" icon="pencil-alt" onClick={e => {setOpenedSection(!openedSection)}} isEditing={openedSection} isConditional={isConditional}/>
                        </Overlay>
                    </div>
                    {props.section.enabled ? (
                        <FormulariesEdit.Section.LabelInput
                        autoComplete={'whathever'} 
                        value={props.section.label_name}
                        placeholder={strings['pt-br']['formularyEditSectionPlaceholderLabel']} 
                        onChange={e=> {onChangeSectionName(e)}} 
                        isConditional={isConditional}
                        />
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
                                sectionIndex={props.sectionIndex}
                                onUpdateSection={props.onUpdateSection}
                                fieldOptions={props.fieldOptions}
                                />
                            </FormulariesEdit.Section.Formulary.Container>
                        ) : (
                            <div>
                                {![null, -1].includes(props.section.id) ? (
                                    <FormulariesEdit.FieldsContainer>
                                        <FormularyFieldsEdit
                                        onCreateDraftFile={props.onCreateDraftFile}
                                        onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                                        fieldIsMoving={props.fieldIsMoving}
                                        setFieldIsMoving={props.setFieldIsMoving}
                                        sectionIndex={props.sectionIndex}
                                        onMoveField={props.onMoveField}
                                        types={props.types}
                                        formName={props.formName}
                                        formId={props.formId}
                                        removeField={props.removeField}
                                        fields={props.section.form_fields}
                                        onAddNewField={props.onAddNewField}
                                        onUpdateField={props.onUpdateField}
                                        userOptions={props.userOptions}
                                        formulariesOptions={formulariesOptions}
                                        />
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

export default FormularySectionEdit