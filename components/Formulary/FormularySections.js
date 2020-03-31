import React, { useState, useEffect } from 'react'
import { Formularies } from 'styles/Formulary'
import FormularySection from './FormularySection'
import { strings } from 'utils/constants'

/**
 * This component controls all sections and contains all sections data. It is one of the main components from the formulary.
 * @param {*} data - defines the WHAT to render from the form. if nothing is provided we build one from scratch
 * @param {Function} setData - sets the data from the formulary main component
 * @param {Array<Object>} sections - defines the HOW to build the formulary, this json contains all of the information about each section, 
 */
const FormularySections = (props) => {
    const [conditionalSections,  setConditionalSections] = useState([])
    const [sectionsData, setSectionsData] = useState([])

    const addNewSectionsData = (sectionId) => {
        return {
            id: null,
            form_id: sectionId,
            dynamic_form_value: []
        }
    }
    
    const onChangeSectionData = (sectionsData, conditionals=conditionalSections) => {
        const newSectionsData = toggleConditionals(sectionsData, conditionals)
        setSectionsData([...newSectionsData])
        props.setData(newSectionsData)
    }

    const toggleConditionals = (sectionsData, conditionals) => {
        //CONDITIONALS LOGIC
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
            if (conditionalToToggle.show) {
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

        return newSectionsData
    }


    const addSection = (e, section) => {
        e.preventDefault()
        sectionsData.push(addNewSectionsData(section.id))
        setSectionsData([...sectionsData])
    }

    const updateSection = (newData, sectionId, sectionDataIndex) => {
        let changedData = sectionsData.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unchangedData = sectionsData.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData[sectionDataIndex] = newData
        changedData = changedData.concat(unchangedData)

        onChangeSectionData(changedData)
    }

    const removeSection = (sectionId, sectionDataIndex) => {
        let changedData = sectionsData.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unchangedData = sectionsData.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData.splice(sectionDataIndex, 1)
        changedData = changedData.concat(unchangedData)

        onChangeSectionData(changedData)
    }


    function buildInitialData(conditionals) {

        const newSectionsData = props.sections
                .filter(section => !(!['', null].includes(section.conditional_value) || section.form_type==='multi-form'))
                .map(section=> addNewSectionsData(section.id))
        onChangeSectionData(newSectionsData, conditionals)
    }
    /**
     * This effect is used to sync between the redux and this component. First the sections, the sections are usually HOW we render so it MUST render first
     * second is the data, the data is WHAT to render so it usually needs to be loaded second. We use the same effect because sometimes the order of the ones that 
     * loads first and second might change. If we only check props.data changes, we can't know that the sections were updated.
     * 
     * When you make a change the changes propagate upper in the hierarchy, but since the upper data is equal the data here, we don't go down when a
     * change is made. When the user load some data is the only moment the data propagate down in the hierarchy
     */
    useEffect (() => {
        const conditionals = props.sections.filter(section => !['', null].includes(section.conditional_value))
        if (JSON.stringify(conditionalSections) !== JSON.stringify(conditionals)) {
            setConditionalSections(conditionals)
        }

        const sectionIds = props.sections.map(section => section.id.toString())
        const sectionDataIds = (props.data.depends_on_dynamic_form) ? props.data.depends_on_dynamic_form.map(sectionData=> sectionData.form_id.toString()) : []
        const formDataLoadedIsFromFormBuilded = sectionDataIds.every(sectionDataId=> sectionIds.includes(sectionDataId))

        if (props.sections.length > 0 && (JSON.stringify(props.data.depends_on_dynamic_form) !== JSON.stringify(sectionsData) || !formDataLoadedIsFromFormBuilded)) {
            if (props.data.depends_on_dynamic_form && formDataLoadedIsFromFormBuilded) {
                onChangeSectionData(props.data.depends_on_dynamic_form, conditionals)
            } else {
                buildInitialData(conditionals)
            }
        }
    }, [props.sections, props.data])

    return (
        <div>
            { props.sections.filter(section=> (section.form_type==='multi-form' || sectionsData.map(sectionData => sectionData.form_id.toString()).includes(section.id.toString())) ).map((section, index) => (
                <Formularies.SectionContainer key={index} isConditional={section.conditional_value !== null}>
                    <Formularies.TitleLabel>{ section.label_name }</Formularies.TitleLabel>
                    {section.form_type==='multi-form' ? (
                        <Formularies.MultiForm.AddButton onClick={e=>addSection(e, section)}>
                            {strings['pt-br']['formularyMultiFormAddButtonLabel']}
                        </Formularies.MultiForm.AddButton>
                    ): ''} 
                    {sectionsData.filter(sectionData=> section.id.toString() === sectionData.form_id.toString()).map((sectionData, index) => (
                        <FormularySection 
                        errors={props.errors}
                        onChangeFormulary={props.onChangeFormulary}
                        key={(sectionsData.id) ? sectionData.id: index} 
                        sectionData={sectionData} 
                        updateSection={updateSection}
                        sectionDataIndex={index} 
                        section={section} 
                        fields={section.form_fields}
                        types={props.types}
                        removeSection={section.form_type==='multi-form' ? removeSection: null}
                        />
                    ))}
                </Formularies.SectionContainer>            
            ))}
        </div>
    )
}

export default FormularySections