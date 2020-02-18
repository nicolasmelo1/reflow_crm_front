import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { 
    FormularySectionEditContainer, 
    FormularySectionEditNameInput, 
    FormularySectionEditIcon, 
    FormularySectionEditIconContainer,
    FormularySectionEditSettingsContainer,
    FormularySectionEditFieldsContainer
} from 'styles/Formulary'

const FormularySectionEdit = (props) => {
    const [openedSections, setOpenedSections] = useState([])


    const onChangeSectionName = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDisableSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()

    }

    const onRemoveSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onMoveSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const goBackToFormulary = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.setIsEditing()
    }

    const openSection = (e, index) => {
        e.preventDefault();
        openedSections[index] = !openedSections[index]
        setOpenedSections([...openedSections])
    }


    useEffect(() => {
        if (props.sections.length !== openedSections.length) {
            setOpenedSections(props.sections.map((_, index) => (index > openedSections.length-1) ? false: openedSections[index]))
        }
    }, [props.sections])

    return (
        <div>
            <button onClick={e=>{goBackToFormulary(e)}}>Voltar</button>
            {props.sections.map((section, index)=> (
                <div key={index}>
                    <FormularySectionEditContainer onClick={e => {openSection(e, index)}}>
                    <Row>
                        <Col>
                            <FormularySectionEditNameInput value={section.label_name} onChange={e=> {onChangeSectionName(e)}} />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <FormularySectionEditIcon size="sm" type="form" icon="eye" onClick={e=>{onDisableSection(e, section, index)}}/>
                                </Col>
                                <Col>
                                    <FormularySectionEditIcon size="sm" type="form" icon="eye" onClick={e=>{onDisableSection(e, section, index)}}/>
                                </Col>
                                <Col>
                                    <FormularySectionEditIcon size="sm" type="form" icon="trash" onClick={e=>{onRemoveSection(e, section, index)}}/>
                                </Col>
                                <Col>
                                    <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveSection(e, section, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                        <FormularySectionEditIcon size="sm" type="form" icon="arrows-alt" />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </FormularySectionEditContainer>
                    <FormularySectionEditSettingsContainer isOpen={openedSections[index]}>
                        Section Settings
                    </FormularySectionEditSettingsContainer>
                    <FormularySectionEditFieldsContainer isOpen={!openedSections[index]}>
                        Section Fields
                    </FormularySectionEditFieldsContainer>
                </div>
            ))}
        </div>
    )
}

export default FormularySectionEdit