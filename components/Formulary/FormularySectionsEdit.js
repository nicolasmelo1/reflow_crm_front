import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import FormularySectionFieldsEdit from './FormularySectionFieldsEdit'
import { 
    FormularySectionEditContainer, 
    FormularySectionEditNameInput, 
    FormularySectionEditIcon, 
    FormularySectionEditIconContainer,
    FormularySectionEditSettingsContainer,
    FormularySectionEditFieldsContainer,
    FormularySectionEditIconsContainer
} from 'styles/Formulary'

const FormularySectionsEdit = (props) => {
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
                    <FormularySectionEditContainer>
                        <Row>
                            <Col>
                                <FormularySectionEditNameInput value={section.label_name} onChange={e=> {onChangeSectionName(e)}} />
                            </Col>
                        </Row>
                        <FormularySectionEditIconsContainer>
                            <FormularySectionEditIconContainer onClick={e => {openSection(e, index)}} isOpen={openedSections[index]}>
                                <div>
                                    <FormularySectionEditIcon size="sm" type="form" icon="pencil-alt" onClick={e=>{onDisableSection(e, section, index)}}/>
                                </div>
                                <small>{openedSections[index] ? 'Editar Campos': 'Editar Seção'}</small>
                            </FormularySectionEditIconContainer>
                            <FormularySectionEditIconContainer>
                                <div>
                                    <FormularySectionEditIcon size="sm" type="form" icon="eye" onClick={e=>{onDisableSection(e, section, index)}}/>
                                </div>
                                <small>Desativar</small>
                            </FormularySectionEditIconContainer>
                            <FormularySectionEditIconContainer>
                                <div>
                                    <FormularySectionEditIcon size="sm" type="form" icon="trash" onClick={e=>{onRemoveSection(e, section, index)}}/>
                                </div>
                                <small>Apagar</small>
                            </FormularySectionEditIconContainer>
                            <FormularySectionEditIconContainer draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveSection(e, section, index)}} onDragEnd={e=>{onDragEnd(e)}}>
                                <div>
                                    <FormularySectionEditIcon size="sm" type="form" icon="arrows-alt" />
                                </div>
                                <small>Mover</small>
                            </FormularySectionEditIconContainer>
                        </FormularySectionEditIconsContainer>
                    </FormularySectionEditContainer>
                    {openedSections[index] ? (
                        <FormularySectionEditSettingsContainer>
                            <small>Section Settings</small>
                        </FormularySectionEditSettingsContainer>
                    ) : (
                        <FormularySectionEditFieldsContainer>
                            <FormularySectionFieldsEdit
                            fields={section.form_fields}
                            />
                        </FormularySectionEditFieldsContainer>
                    )}
                </div>
            ))}
        </div>
    )
}

export default FormularySectionsEdit