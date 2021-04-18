import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View } from 'react-native'
import FormularySectionEdit from './FormularySectionEdit'
import { FormulariesEdit }  from '../../styles/Formulary'
import { strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import generateUUID from '../../utils/generateUUID'
import deepCopy from '../../utils/deepCopy'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component controls all of the sections, we keep most of the primary functions here, since that when we change
 * something we actually change the hole structure of the data, the redux reducer actually keep the complete structure
 * but most of the time we want to change parts of it, we could write many reducers but to keep it simple we prefer to keep
 * the redux dumb, and change always the hole data. This is why we have most functions for sections and fields here.
 * 
 * @param {function} onRemoveFormularySettingsField - the function from the redux action to remove a field
 * @param {function} onUpdateFormularySettingsField - the function from the redux action to update a field
 * @param {function} onCreateFormularySettingsField - the function from the redux action to create a new field  
 * @param {function} onRemoveFormularySettingsSection - the function from the redux action to remove a section
 * @param {function} onUpdateFormularySettingsSection - the function from the redux action to update a section
 * @param {function} onCreateFormularySettingsSection - the function from the redux action to create a new section                   
 * @param {function} onChangeFormularySettingsState - the function from redux action to change the store data, 
 * we don't make any backend calls on this function, just change the state.        
 * @param {BigInteger} formId - the ID of the current formulary we are editing.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff                        
 * @param {Object} data - this is the main data that we use to update formularies.
 * @param {Array<Object>} formulariesOptions - on field_type === `form` we usually need to connect a field with a 
 * field from another formulary.
 */
const FormularySectionsEdit = (props) => {
    const sourceRef = React.useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMoving, setIsMoving] = useState(false)
    const [dropEventForFieldInEmptySection, setDropEventForFieldInEmptySection] = useState({
        movedFieldUUID: '',
        targetSectionUUID: ''
    })
    const [formularySettingsData, _setFormularySettingsData] = useState({})
    const formularySettingsDataRef = React.useRef(formularySettingsData)

    const setFormularySettingsData = (data) => {
        formularySettingsDataRef.current = data
        _setFormularySettingsData(data)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Used for reordering fields from section to section and inside the same section. This also supports
     * to send fields to empty sections, for that you might want to use `dropEventForFieldInEmptySection`
     * state where we store both the moved field uuid and the targetsectionUUID where the field should go.
     * 
     * When you are trying to drop on an empty section you might want to set the `targetSectionUUID`, when this parameter
     * is defined `targetFieldUUID` is ignored.
     * 
     * @param {String} movedFieldUUID - The uuid of the moved field
     * @param {(null, String)} targetFieldUUID - The uuid of the field where the moved field is being dropped
     * @param {(null, String)} targetSectionUUID - If you are dropping the field on an empty section, this must be defined
     * @returns 
     */
    const onReorderField = (movedFieldUUID, targetFieldUUID, targetSectionUUID=null) => {
        let movedSectionIndex = null
        let targetSectionIndex = targetSectionUUID !== null ? formularySettingsData.depends_on_form.findIndex(section => section.uuid === targetSectionUUID) : null
        let movedFieldIndex = null
        let targetFieldIndex = targetSectionUUID !== null ? 0 : null

        const sections = formularySettingsDataRef.current.depends_on_form
        // https://youtu.be/61amWGUL3vs
        // Reference: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/label
        // P.S.: I also didn't knew after searching
        indexSearchFromUUIDs:
        for (let sectionIndex=0; sectionIndex < sections.length; sectionIndex++) {
            for (let fieldIndex=0; fieldIndex < sections[sectionIndex].form_fields.length; fieldIndex++) {
                switch (sections[sectionIndex].form_fields[fieldIndex].uuid) {
                    case movedFieldUUID:
                        movedFieldIndex = fieldIndex
                        movedSectionIndex = sectionIndex
                        break
                    case targetFieldUUID:
                        targetFieldIndex = fieldIndex
                        targetSectionIndex = sectionIndex
                        break
                }
                
                if (movedFieldIndex !== null && targetFieldIndex !== null) {
                    break indexSearchFromUUIDs
                }
            }
        }
    
        const areIndexesDefined = movedFieldIndex !== null && targetFieldIndex !== null && targetSectionIndex !== null && movedSectionIndex !== null

        if (areIndexesDefined) {
            const movedElement = {...formularySettingsDataRef.current.depends_on_form[movedSectionIndex].form_fields[movedFieldIndex]}
            let newArrayWithoutMoved = [...formularySettingsDataRef.current.depends_on_form]
            const targetSectionId = newArrayWithoutMoved[targetSectionIndex].id
            let confirmation = true
            if (movedElement.form !== targetSectionId) {
                confirmation = confirm(`ALERTA!\nMover os campos entre seções oculta os dados desse campo, deseja continuar?`)
            }
            if (confirmation) {
                movedElement.form = targetSectionId
                newArrayWithoutMoved[movedSectionIndex].form_fields = [...formularySettingsDataRef.current.depends_on_form[movedSectionIndex].form_fields.filter((_, index) => index !== movedFieldIndex)]
                newArrayWithoutMoved[targetSectionIndex].form_fields.splice(targetFieldIndex, 0, movedElement)
                formularySettingsDataRef.current.depends_on_form = newArrayWithoutMoved
            }
            return reorder(formularySettingsDataRef.current).depends_on_form[targetSectionIndex].form_fields[targetFieldIndex]
        } else {
            throw ReferenceError('Either the `movedFieldUUID` or `targetFieldUUID` argument does not exists')
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * You might ask yourself, why this is here?
     * 
     * This is here because when we move a section we modify the hole tree of objects since we move one value from one place to another
     * because we need access for the hole tree we modify it in the root and not on the leaf.
     * 
     * Notice one thing: THIS DOESN'T CHANGE THE STATE, it changes the state object but we not call the 
     * `onUpdateFormularySettingsState()` to change the state. This is resposability of your component.
     * We need this for committing to the backend before changing the state.
     * 
     * @param {String} movedSectionUUID - The uuid of the moved section to use, this is the uuid from the section that is being dragged
     * @param {String} targetSectionUUID - The uuid of the moved section target, this is the uuid from the section where you are dropping, the dragged
     * element will assume it's place.
     */
    const onReorderSection = (movedSectionUUID, targetSectionUUID) => {
        let movedSectionIndex = null
        let targetSectionIndex = null

        // We loop through all of the elements to find the indexes, it's faster than findIndex because we loop
        // just once, and we might endup not having to iterate through all of the items.
        for (let sectionIndex = 0; sectionIndex < formularySettingsDataRef.current.depends_on_form.length; i++) {
            switch (formularySettingsDataRef.current.depends_on_form[sectionIndex].uuid) {
                case movedSectionUUID:
                    movedSectionIndex = sectionIndex
                    break
                case targetSectionUUID:
                    targetSectionIndex = sectionIndex
                    break
            }
            if (movedSectionIndex !== null && targetSectionIndex !== null) {
                break
            }
        }

        if (targetSectionIndex !== null && movedSectionIndex !== null) {
            let newArrayWithoutMoved = formularySettingsDataRef.current.depends_on_form.filter((_, index) => index !== movedSectionIndex)
            newArrayWithoutMoved.splice(targetSectionIndex, 0, formularySettingsDataRef.current.depends_on_form[movedSectionIndex])
            formularySettingsDataRef.current.depends_on_form = newArrayWithoutMoved

            return reorder(formularySettingsDataRef.current).depends_on_form[targetSectionIndex]
        } else {
            throw ReferenceError('Either the `movedSectionUUID` or `targetSectionUUID` argument does not exists')
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Adds a new section at the bottom of the formulary
     */
    const onAddNewSection = () => {
        const defaultSectionData = {
            id:	null,
            show_label_name: true,
            conditional_excludes_data_if_not_set: true,
            conditional_on_field: null,
            conditional_value: null,
            conditional_type: null,
            show_label_name: true,
            form_fields: [],
            form_name: '',
            label_name: '',
            uuid: generateUUID(),
            order: 0,
            enabled: true,
            type: (props.types.data.form_type && props.types.data.form_type.filter(formType=> formType.type === 'form').length > 0) ? props.types.data.form_type.filter(formType=> formType.type === 'form')[0].id : 1,
            group: null
        }

        formularySettingsData.depends_on_form.push(defaultSectionData)
        onUpdateFormularySettingsState()
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Removes a section based on its uuid. With the uuid we retrieve the index, and then we remove it accordingly.
     * 
     * @param {String} sectionUUID - The uuid of the section
     */
    const onRemoveSection = (sectionUUID) => {
        const sectionIndex = formularySettingsData.depends_on_form.findIndex(section => section.uuid === sectionUUID)
        if (sectionIndex !== -1) {
            if (formularySettingsData.depends_on_form[sectionIndex].id !== null) {
                props.onRemoveFormularySettingsSection(props.formId, formularySettingsData.depends_on_form[sectionIndex].id)
            }
            formularySettingsData.depends_on_form.splice(sectionIndex, 1)
            onUpdateFormularySettingsState()
        }
    } 
    // ------------------------------------------------------------------------------------------
    /**
     * Updates the state of the hole formulary. This works similarly as the rich text. The idea is simple:
     * When we send a props down to a component, if it's a object we pass the reference to this object and NOT the value.
     * 
     * What this means is:
     * 
     * ```
     * reference = {current: 10}
     * value = 10
     * 
     * const testReferenceAndValue = (referenceVariable, valueVariable) => {
     *      referenceVariable.current++
     *      valueVariable++
     * }
     * 
     * console.log(reference.current) // will print 10
     * console.log(value) // will print 10
     * 
     * testReferenceAndValue(reference, value)
     * 
     * console.log(reference.current) // will print 11
     * console.log(value) // will print 10
     * ```
     * 
     * Notice that when we access the reference.current OUTSIDE of the function it will print 11, but the value, will remain the same.
     * This happens because we passed `reference` as a reference, and not as value, the referenceVariable inside of the function
     * is the same object as the reference. But the `valueVariable` is not the same as `value`. That's because on one we passed the variable
     * as a reference, and on the other we passed as value. 
     * 
     * This applies here, when we pass a `section` props on a .map() function to a component, and then we pass a `field` props aftewards we are actually
     * passing the original field and section. So in those components if we do props.section.label_name = 'name' and then call `onUpdateFormularySettingsState`
     * callback from the parent component. The `formularySettingsData` will hold the section with the updated name. 
     * 
     * That's why we need global auxiliary variables for the memo on the children components.
     */
    const onUpdateFormularySettingsState = () => {
        const reordededFormularySettingsData = reorder(formularySettingsData)
        setFormularySettingsData({...reordededFormularySettingsData})
    }
    // ------------------------------------------------------------------------------------------
    const reorder = (data) => {
        data.depends_on_form = data.depends_on_form.map((section, sectionIndex) => {
            section.form_fields = section.form_fields.map((field, fieldIndex) => {
                field.order = fieldIndex+1
                return field
            })
            section.order = sectionIndex+1
            return section
        })
        return data
    }
    // ------------------------------------------------------------------------------------------
    const retrieveFormularyData = () => {
        return deepCopy(formularySettingsData)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        /** 
         * Gets the data needed to build the formulary settings page, this component automatically renders the isLoading as true, 
         * so when it finishes retrieving the formulary data from the backend (even if it fails, it goes to false)
         */
        sourceRef.current = axios.CancelToken.source()
        props.onGetFormularySettings(sourceRef.current, props.formId).then(response => {
            if (response && response.status === 200) {
                setFormularySettingsData(response.data.data)
            }
            setIsLoading(false)
        }).catch(_ => setIsLoading(false))

        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])
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
            <div>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column',width: '100%', alignItems: 'center', justifyContent: 'center', color: '#0dbf7e'}}>
                        <p>{strings['pt-br']['formularyEditLoadingFormularyData']}</p>
                        <Spinner animation="border"/>
                    </div>
                ) : (
                    <React.Fragment>
                        {formularySettingsData.depends_on_form ? formularySettingsData.depends_on_form.map((section, index)=> (
                            <React.Fragment key={section.uuid}>
                                <FormularySectionEdit
                                onUpdateFormularySettingsState={onUpdateFormularySettingsState}
                                section={section} 
                                onRemoveSection={onRemoveSection}
                                isMoving={isMoving}
                                onReorderSection={onReorderSection}
                                onReorderField={onReorderField}
                                setIsMoving={setIsMoving}
                                types={props.types} 
                                onCreateDraftFile={props.onCreateDraftFile}
                                dropEventForFieldInEmptySection={dropEventForFieldInEmptySection}
                                setDropEventForFieldInEmptySection={setDropEventForFieldInEmptySection}
                                retrieveFormularyData={retrieveFormularyData}
                                onUpdateFormularySettingsField={props.onUpdateFormularySettingsField}
                                onCreateFormularySettingsField={props.onCreateFormularySettingsField}
                                onRemoveFormularySettingsField={props.onRemoveFormularySettingsField}
                                onUpdateFormularySettingsSection={props.onUpdateFormularySettingsSection}
                                onCreateFormularySettingsSection={props.onCreateFormularySettingsSection}
                                onTestFormularySettingsFormulaField={props.onTestFormularySettingsFormulaField}
                                formName={props.formName}
                                formId={props.formId}
                                userOptions={props.userOptions}
                                />
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                    <div style={{ width: '100%', border: '1px dashed #bfbfbf'}}/>
                                </div>
                            </React.Fragment>
                        )): ''}
                        
                        <FormulariesEdit.AddNewSectionButton text={strings['pt-br']['formularyEditAddNewSectionButtonLabel']} onClick={e=>{onAddNewSection()}} />
                    </React.Fragment>
                )}
                </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySectionsEdit