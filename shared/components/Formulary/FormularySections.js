import React, { useState, useEffect } from 'react'
import FormularySection from './FormularySection'
import { Formularies } from '../../styles/Formulary'
import { strings } from '../../utils/constants'
import { useRouter } from 'next/router'
/**
 * This component controls all sections and contains all sections data. It is one of the main components from the formulary.
 * @param {*} data - defines the WHAT to render from the form. if nothing is provided we build one from scratch
 * @param {Function} setData - sets the data from the formulary main component
 * @param {Array<Object>} sections - defines the HOW to build the formulary, this json contains all of the information about each section, 
 */
const FormularySections = (props) => {
    const [conditionalSections,  setConditionalSections] = useState([])

    const addNewSectionsData = (sectionId) => {
        return {
            id: null,
            form_id: sectionId.toString(),
            dynamic_form_value: []
        }
    }
    
    const onChangeSectionData = (sectionsData, conditionals=conditionalSections) => {
        const newSectionsData = toggleConditionals(sectionsData, conditionals)
        props.setFilledData(props.data.id, [...newSectionsData])
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
        if (section.form_type === 'multi-form') {
            props.data.depends_on_dynamic_form.splice(0,0, addNewSectionsData(section.id))
        } else {
            props.data.depends_on_dynamic_form.push(addNewSectionsData(section.id))
        }
        props.setFilledData(props.data.id, [...props.data.depends_on_dynamic_form])
    }

    const updateSection = (newData, sectionId, sectionDataIndex) => {
        let changedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unchangedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData[sectionDataIndex] = newData
        changedData = changedData.concat(unchangedData)

        onChangeSectionData(changedData)
    }

    const removeSection = (sectionId, sectionDataIndex) => {
        let changedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unChangedData = props.data.depends_on_dynamic_form.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData.splice(sectionDataIndex, 1)
        changedData = changedData.concat(unChangedData)

        onChangeSectionData(changedData)
    }

    function getNewSectionData() {
        return props.sections
            .filter(section => !(!['', null].includes(section.conditional_value) || section.form_type==='multi-form'))
            .map(section=> addNewSectionsData(section.id))
    }

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

    function buildInitialData(conditionals) {
        const newSectionsData = getNewSectionData()
        onChangeSectionData(newSectionsData, conditionals)
    }

    useEffect (() => {
        if (props.sections.length > 0) {
            const conditionals = props.sections.filter(section => !['', null].includes(section.conditional_value))
            if (JSON.stringify(conditionalSections) !== JSON.stringify(conditionals)) {
                setConditionalSections(conditionals)
            }
            if (!props.hasBuiltInitial) {

                if (props.data.id === null) {
                    buildInitialData(conditionals)
                }
                if (props.data.id) {
                    onLoadData(props.data.depends_on_dynamic_form, conditionals)

                }
                props.setFilledHasBuiltInitial(true)
            }
        }
    }, [props.sections, props.data])
   
    return (
        <div>
            { props.sections.filter(section=> (section.form_type==='multi-form' || props.data.depends_on_dynamic_form.map(sectionData => sectionData.form_id.toString()).includes(section.id.toString())) ).map((section, index) => (
                <Formularies.SectionContainer key={index} isConditional={section.conditional_value !== null}>
                    <Formularies.TitleLabel>{ section.label_name }</Formularies.TitleLabel>
                    {section.form_type==='multi-form' ? (
                        <Formularies.MultiForm.AddButton onClick={e=>addSection(e, section)}>
                            {strings['pt-br']['formularyMultiFormAddButtonLabel']}
                        </Formularies.MultiForm.AddButton>
                    ): ''} 
                    {props.data.depends_on_dynamic_form.filter(sectionData=> section.id.toString() === sectionData.form_id.toString()).map((sectionData, index) => (
                        <FormularySection 
                        type={props.type}
                        types={props.types}
                        errors={props.errors}
                        onChangeFormulary={props.onChangeFormulary}
                        key={(sectionData.id) ? sectionData.id: index} 
                        sectionData={sectionData} 
                        files={props.files}
                        updateSection={updateSection}
                        setFilledFiles={props.setFilledFiles}
                        sectionDataIndex={index} 
                        section={section} 
                        fields={section.form_fields}
                        userOptions={props.userOptions}
                        removeSection={section.form_type==='multi-form' ? removeSection: null}
                        />
                    ))}
                </Formularies.SectionContainer>            
            ))}
        </div>
    )
}

export default FormularySections