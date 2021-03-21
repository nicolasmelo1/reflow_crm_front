import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import FormularySection from './FormularySection'
import { Formularies } from '../../styles/Formulary'
import { strings } from '../../utils/constants'


/**
 * This component controls all sections and contains all sections data. It is one of the main components from the formulary.
 * 
 * @param {String} formName - The currently form opened form_name 
 * @param {('full'|'preview'|'embbed')} type - this have some differeces on what is shown to the user,
 * - embbed - is the formulary that is used to embed in external websites and urls, so, for the external world. 
 * it deactivates funcionalities like: add new or edit connection field is not available, cannot edit.
 * - preview - the formulary is fully functional, except it doesn't have a save button
 * - full - usually the formulary that is used in the home page.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} errors - Those are the errors recieved from the backend, sometimes it can contain the `detail` and `reason` keys
 * and sometimes it can contain the `data` keys
 * @param {Object} onChangeFormulary - When the user clicks `add new` or `edit` in the formulary we need to fetch the data for a new formulary.
 * @param {Object} data - defines the WHAT to render from the form. If nothing is provided we build one from scratch.
 * @param {Boolean} isAuxOriginalInitial - defines if the current formulary is from the list of connected formularies. When the user clicks
 * the `add new` or `edit` button in a form field, we need to open the connected formulary in place
 * @param {Function} setFilledIsAuxOriginalInitial - sets the isAuxOriginalInitial state.
 * @param {Boolean} hasBuiltInitial - Used for checking if we already built the initial formulary data. This is important because on the first render
 * we build the formulary here and not on the parent component
 * @param {Function} setFilledHasBuiltInitial - Function for changing the hasBuiltInitial state.
 * @param {Function} setFilledData - sets the data from the formulary main component
 * @param {Array<Object>} sections - defines the HOW to build the formulary, this json contains all of the information about each section, 
 */
const FormularySections = (props) => {
    const [conditionalSections,  setConditionalSections] = useState([])
    const [sectionsToLoad, setSectionsToLoad] = useState([])
    // ------------------------------------------------------------------------------------------
    const addNewSectionsData = (sectionId) => {
        return {
            id: null,
            form_id: sectionId.toString(),
            dynamic_form_value: []
        }
    }
    // ------------------------------------------------------------------------------------------
    const onChangeSectionData = (sectionsData, conditionals=conditionalSections) => {
        const newSectionsData = toggleConditionals(sectionsData, conditionals)
        props.setFilledData(props.data.id, [...newSectionsData])
    }
    // ------------------------------------------------------------------------------------------
    const toggleConditionals = (sectionsData, conditionals) => {
        let newSectionsData = [...sectionsData]
        let formValues = sectionsData.map(sectionData=> sectionData.dynamic_form_value)
        formValues = [].concat(...formValues);

        // for conditionals we run through all sections formvalues, filter the conditionals with the field and checks if the value
        // matches the conditional value telling if it is to show the conditional or not
        const conditionalsToToggle = conditionals.map(conditionalSection => {
            const filteredFormValues = formValues.filter(formValue => conditionalSection.conditional_on_field_name === formValue.field_name)
            return {
                id: conditionalSection.id,
                form_type: conditionalSection.form_type,
                show: filteredFormValues.some(formValue => {
                    // IMPORTANT: for new conditional types you might want to change this
                    switch (conditionalSection.conditional_type_type) {
                        case 'equal':
                            return formValue.value === conditionalSection.conditional_value
                    }
                })
            }
        })

        // sectionIds are all sectionIds shown in the current state
        const sectionDataIds = newSectionsData.map(sectionData=> sectionData.form_id.toString())

        // this appends or removes the conditionals from the  sectionsData state, if the show is set to false we remove,
        // otherwise we add a new sectionData
        conditionalsToToggle.forEach(conditionalToToggle => {
            if (conditionalToToggle.show && conditionalsToToggle.form_type !== 'multi-form') {
                // we check if the sectionId is already in the sectionData array and if the section is a multiForm, 
                // this way we can safely append a new sectionData
                if (!sectionDataIds.includes(conditionalToToggle.id.toString()) && conditionalToToggle.form_type !== 'multi-form') {
                    newSectionsData = newSectionsData.concat(
                        props.sections
                        .filter(section => conditionalToToggle.id === section.id)
                        .map(section=> addNewSectionsData(section.id))
                    )
                }
            } else if (!conditionalToToggle.show) {
                newSectionsData = newSectionsData.filter(sectionData => !(conditionalToToggle.id.toString() === sectionData.form_id.toString()))
            }
        })

        const conditionalsNotToToggleIds = conditionalsToToggle
            .filter(conditionalToToggle => !conditionalToToggle.show)
            .map(conditionalToToggle => conditionalToToggle.id)
        
        setSectionsToLoad(props.sections.filter(section => !conditionalsNotToToggleIds.includes(section.id)))
        return newSectionsData
    }
    // ------------------------------------------------------------------------------------------
    function getNewSectionData() {
        return props.sections
            .filter(section => !(!['', null].includes(section.conditional_value) || section.form_type==='multi-form'))
            .map(section=> addNewSectionsData(section.id))
    }
    // ------------------------------------------------------------------------------------------
    function onLoadData(sectionsData, conditionals) {
        let newSectionsData = getNewSectionData()
        const sectionsDataIds = sectionsData.map(sectionData=> sectionData.form_id)
        
        newSectionsData.forEach(sectionData => {
            if (!sectionsDataIds.includes(sectionData.form_id)) {
                sectionsData.push(sectionData)
            }
        })
        newSectionsData = toggleConditionals(sectionsData, conditionals)
        props.setFilledData(props.data.id, [...newSectionsData])
        //onChangeSectionData(sectionsData, conditionals)
    }
    // ------------------------------------------------------------------------------------------
    function buildInitialData(conditionals) {
        const newSectionsData = getNewSectionData()
        onChangeSectionData(newSectionsData, conditionals)
    }
    // ------------------------------------------------------------------------------------------
    const addSection = (e, section) => {
        e.preventDefault()
        if (section.form_type === 'multi-form') {
            props.data.depends_on_dynamic_form.splice(0,0, addNewSectionsData(section.id))
        } else {
            props.data.depends_on_dynamic_form.push(addNewSectionsData(section.id))
        }
        props.setFilledData(props.data.id, [...props.data.depends_on_dynamic_form])
    }
    // ------------------------------------------------------------------------------------------
    const updateSection = (newData, sectionId, sectionDataIndex) => {
        let changedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unchangedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData[sectionDataIndex] = newData
        changedData = changedData.concat(unchangedData)

        onChangeSectionData(changedData)
    }
    // ------------------------------------------------------------------------------------------
    const removeSection = (sectionId, sectionDataIndex) => {
        let changedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unChangedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData.splice(sectionDataIndex, 1)
        changedData = changedData.concat(unChangedData)

        onChangeSectionData(changedData)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect (() => {
        if (props.sections.length > 0) {
            const conditionals = props.sections.filter(section => !['', null].includes(section.conditional_value))
            if (JSON.stringify(conditionalSections) !== JSON.stringify(conditionals)) {
                setConditionalSections(conditionals)
            }

            // Okay, so here we really need to be REALLLY careful, because really easily we can enter
            // on an infinite loop. If you see, we always finish the conditional here changing the state
            // that`s because on a second pass, the state is not valid to enter the conditional again.
            // We validate two conditionals: the first is if the data has been built, the other is to signal
            // if the data is a AuxOriginalInitial. The first is really straight forward, but the second not really.
            // If you already inserted data in a formulary and clicked `add new` from the connected `field_type`
            // you actually save Original Initial formulary in a variable, when you save or you click to go back,
            // to the original initial formulary, you need to load the data, the problem is, we already built the form
            // so we actually don't want to build again, but instead, load the data that we saved in the variable.
            if (!props.hasBuiltInitial || props.isAuxOriginalInitial) {
                if (props.data.depends_on_dynamic_form.length === 0 && !props.isAuxOriginalInitial) {
                    buildInitialData(conditionals)
                } else if (props.data.id !== null || props.data.depends_on_dynamic_form.length > 0 || props.isAuxOriginalInitial) {
                    onLoadData(props.data.depends_on_dynamic_form, conditionals)
                }
                if (!props.hasBuiltInitial) props.setFilledHasBuiltInitial(true)
                if (props.isAuxOriginalInitial) props.setFilledIsAuxOriginalInitial(false)
            }
        }
    }, [props.sections, props.data])
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
                {sectionsToLoad.map((section, index) => (
                    <Formularies.SectionContainer key={index} isConditional={section.conditional_value !== null} isMultiSection={section.form_type==='multi-form'}>
                        <Formularies.TitleLabel isConditional={section.conditional_value !== null}>{ section.label_name }</Formularies.TitleLabel>
                        {section.form_type==='multi-form' ? (
                            <Formularies.MultiForm.AddButton onClick={e=>addSection(e, section)}>
                                {strings['pt-br']['formularyMultiFormAddButtonLabel']}
                            </Formularies.MultiForm.AddButton>
                        ): ''} 
                        {props.data.depends_on_dynamic_form.filter(sectionData=> section.id.toString() === sectionData.form_id.toString()).map((sectionData, index) => (
                            <FormularySection 
                            formName={props.formName}
                            isSectionConditional={section.conditional_value !== null}
                            type={props.type}
                            types={props.types}
                            errors={props.errors}
                            onChangeFormulary={props.onChangeFormulary}
                            key={(sectionData.id) ? sectionData.id: index} 
                            sectionData={sectionData} 
                            updateSection={updateSection}
                            onAddFile={props.onAddFile}
                            draftToFileReference={props.draftToFileReference}
                            sectionDataIndex={index} 
                            section={section} 
                            fields={section.form_fields}
                            removeSection={section.form_type==='multi-form' ? removeSection: null}
                            />
                        ))}
                    </Formularies.SectionContainer>            
                ))}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySections