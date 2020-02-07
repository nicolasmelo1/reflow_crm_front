import React, { useState, useEffect } from 'react'
import { FormularySectionTitle, FormularyMultiFormAddNewButton, FormularySectionContainer } from 'styles/Formulary'
import FormularySectionFields from './FormularySectionFields'

/**
 * This component controls all sections and contains all sections data. It is one of the main components from the formulary.
 * @param {*} data - defines the WHAT to render from the form. if nothing is provided we build one from scratch
 * @param {Function} setData - sets the data from the formulary main component
 * @param {Array<Object>} sections - defines the HOW to build the formulary, this json contains all of the information about each section, 
 */
const FormularySection = (props) => {
    const [conditionalSections,  setConditionalSections] = useState(props.sections.filter(element => !['', null].includes(element.conditional_value)))
    const [sections, setSections] = useState([])
    const [sectionsData, setSectionsData] = useState([])


    const addNewSectionsData = (sectionId) => {
        return {
            id: null,
            form_id: sectionId,
            dynamic_form_value: []
        }
    }
    
    const onChangeSectionData = (sections, sectionsData, conditionals=conditionalSections, ) => {
        const [newSections, newSectionsData] = toggleConditionals(sections, sectionsData, conditionals)
        setSections([...newSections])
        setSectionsData([...newSectionsData])
        props.setData(newSectionsData)
    }

    const toggleConditionals = (sections, sectionsData, conditionals) => {
        //CONDITIONALS LOGIC
        let newSections = [...sections]
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
        const sectionIds = newSections.map(section=> section.id.toString())
        const sectionDataIds = newSectionsData.map(sectionData=> sectionData.form_id.toString())

        // this appends or removes the conditionals from the sections and sectionsData states, if the show is set to false we remove,
        // otherwise we add a new section and sectionData, the section must BE ADDED ACCORDING TO THE ORDER RECIEVED FROM THE BACKEND
        // that`s why we use props.sections to open the sections
        conditionalsToToggle.forEach(conditionalToToggle => {
            if (conditionalToToggle.show) {
                if (!sectionIds.includes(conditionalToToggle.id.toString())) {
                    // when we loop, if the section is set to `show === true` we need to append the id to the sectionIds 
                    // to basically say it is in the open state now
                    sectionIds.push(conditionalToToggle.id.toString())

                    newSections = props.sections.filter(section => sectionIds.includes(section.id.toString()))
                }
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
                newSections = newSections.filter(section => !(conditionalToToggle.id.toString() === section.id.toString()))
                newSectionsData = newSectionsData.filter(sectionData => !(conditionalToToggle.id.toString() === sectionData.form_id.toString()))
            }
        })

        return [newSections, newSectionsData]
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

        onChangeSectionData(sections, changedData)
    }

    const removeSection = (sectionId, sectionDataIndex) => {
        let changedData = sectionsData.filter(sectionData=> sectionId.toString() === sectionData.form_id.toString())
        const unchangedData = sectionsData.filter(sectionData=> sectionId.toString() !== sectionData.form_id.toString())

        changedData.splice(sectionDataIndex, 1)
        changedData = changedData.concat(unchangedData)
        onChangeSectionData(sections, changedData)
    }

    /**
     * This effect is used when the user opens the formulary, so when we have the data on HOW 
     * we should render the form. With this we have two options: 1-Build a data if there is none or 
     * 2- Wait for the data to be retrieved from the backend
     */
    useEffect (() => {
        const newSections = props.sections.filter(section=> ['', null].includes(section.conditional_value))
        const conditionals = props.sections.filter(section => !['', null].includes(section.conditional_value))
        setConditionalSections(conditionals)

        if (props.formularyId === null) {
            const newSectionsData = props.sections
                .filter(section => !(!['', null].includes(section.conditional_value) || section.form_type==='multi-form'))
                .map(section=> addNewSectionsData(section.id))
            onChangeSectionData(newSections, newSectionsData, conditionals)
        } else {
            setSections([...newSections])
        }
    }, [props.sections])


    useEffect (() => {
        //setSectionsData(props.data.depends_on_dynamic_form || [])
    }, [props.data])

    return (
        <div>
            {sections.map((section, index) => (
                <FormularySectionContainer key={index} isConditional={section.conditional_value !== null}>
                    <FormularySectionTitle>{ section.label_name }</FormularySectionTitle>
                    {section.form_type==='multi-form' ? (
                        <FormularyMultiFormAddNewButton onClick={e=>addSection(e, section)}>Adicionar</FormularyMultiFormAddNewButton>
                    ): ''} 
                    {sectionsData.filter(sectionData=> section.id.toString() === sectionData.form_id.toString()).map((sectionData, index) => (
                        <FormularySectionFields 
                        key={(sectionsData.id) ? sectionData.id: index} 
                        sectionData={sectionData} 
                        updateSection={updateSection}
                        sectionDataIndex={index} 
                        section={section} 
                        fields={section.form_fields}
                        removeSection={section.form_type==='multi-form' ? removeSection: null}
                        />
                    ))}
                </FormularySectionContainer>            
            ))}
        </div>
    )
}

export default FormularySection