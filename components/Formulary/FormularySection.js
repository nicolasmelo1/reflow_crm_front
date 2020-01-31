import React, { useState, useEffect } from 'react'
import { FormularySectionTitle, FormularyMultiFormAddNewButton, FormularySectionContainer } from 'styles/Formulary'
import FormularySectionFields from './FormularySectionFields'


const FormularySection = (props) => {
    const [conditionalSections,  setConditionalSections] = useState(props.sections.filter(element => !['', null].includes(element.conditional_value)))
    // okay, so this is a little bit strange, we need to check weather the sction is conditional or a multi, if it is one of them it will return true
    // then we invert it so it turns to false (because we don't want it)
    const [sections, setSections] = useState([])
    const [sectionsData, setSectionsData] = useState([])

    useEffect (() => {
        setSections(props.sections.filter(section=> ['', null].includes(section.conditional_value)))
        /*setSectionsData(props.sections
            .filter(section => !(!['', null].includes(section.conditional_value) || section.form_type==='multi-form'))
            .map(section=> {
                return {
                    id: null,
                    form_id: section.id,
                    dynamic_form_value: []
                }
            }))*/
        setSectionsData([
            {
                "id": "1230", 
                "form_id": "98", 
                "dynamic_form_value": []
            }, {
                "id": "1229", 
                "form_id": "96", 
                "dynamic_form_value": [
                    {
                        "id": "4157", 
                        "value": "1199", 
                        "field_name": "corretor"
                    }, {
                        "id": "4158", 
                        "value": "Garantia", 
                        "field_name": "produto"
                    }, {
                        "id": "4159", 
                        "value": "25/12/2019", 
                        "field_name": "previsaodefechamento"
                    }, {
                        "id": "4160", 
                        "value": "2.000,00",
                        "field_name": "valor_1"
                    }, {
                        "id": "4161", 
                        "value": "Negocia\u00e7\u00e3o", 
                        "field_name": "status_1"
                    }, {
                        "id": "4208", 
                        "value": "2100", 
                        "field_name": "calculo"
                    }
                ]
            },
            {
                "id": "1250", 
                "form_id": "99", 
                "dynamic_form_value": [
                    {
                        "id": "123123123123", 
                        "value": "teste",
                        "field_name": "historico"
                    }
                ]
            }
        ])
    }, [props.sections])

    const addSection = (e, section) => {
        e.preventDefault()
        sectionsData.push({
            id: null,
            form_id:section.id,
            dynamic_form_value: []
        })
        setSectionsData([...sectionsData])
    }

    const updateSection = (newData, sectionId, sectionDataIndex) => {
        let changedData = sectionsData.filter(sectionData=> sectionId === sectionData.form_id)
        const unchangedData = sectionsData.filter(sectionData=> sectionId !== sectionData.form_id)

        changedData[sectionDataIndex] = newData
        changedData = changedData.concat(unchangedData)

        setSectionsData([...changedData])
    }

    const removeSection = (sectionId, sectionDataIndex) => {
        let changedData = sectionsData.filter(sectionData=> sectionId === sectionData.form_id)
        const unchangedData = sectionsData.filter(sectionData=> sectionId !== sectionData.form_id)

        changedData.splice(sectionDataIndex, 1)
        changedData = changedData.concat(unchangedData)
        setSectionsData([...changedData])
    }

    console.log(sectionsData)
    return (
        <div>
            {sections.map((section, index) => (
                <FormularySectionContainer key={index}>
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