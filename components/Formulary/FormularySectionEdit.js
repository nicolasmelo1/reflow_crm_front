import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import FormularyFieldsEdit from './FormularyFieldsEdit'
import { FormulariesEdit }  from 'styles/Formulary'
import FormularySectionEditForm from './FormularySectionEditForm'

const FormularySectionEdit = (props) => {
    const [openedSection, setOpenedSection] = useState(false)
    const [isConditional, setIsConditional] = useState(false)

    const onChangeSectionName = (e) => {
        e.preventDefault()
        e.stopPropagation()
        props.section.label_name = e.target.value
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const onDisableSection = (e) => {
        props.section.enabled = !props.section.enabled 
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const onRemoveSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onMoveSection = (e) => {
        let sectionContainer = e.currentTarget.closest('.section-container')
        let elementRect = e.currentTarget.getBoundingClientRect()
        e.dataTransfer.setDragImage(sectionContainer, elementRect.width-elementRect.left - ( elementRect.right - elementRect.width ), 20)
        e.dataTransfer.setData('sectionIndexToMove', JSON.stringify(props.sectionIndex))
        props.setIsMoving(true)
    }

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.getData('sectionIndexToMove') !== '') {
            let movedSectionIndex = JSON.parse(e.dataTransfer.getData('sectionIndexToMove'))
            props.onMoveSection(movedSectionIndex, props.sectionIndex)
        }
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
        props.setIsMoving(false)
    }


    useEffect(()=>{
        setIsConditional(props.section.conditional_on_field !== null || props.section.conditional_value !== null || props.section.conditional_type !== null)
    }, [props.section])

    return (
        <FormulariesEdit.Section.Container>
            <FormulariesEdit.Section.TitleAndIconsContainer isConditional={isConditional} className="section-container" onDragOver={e => {onDragOver(e)}} onDrop={e => {onDrop(e)}}>
                <Row>
                    <Col>
                    {props.section.enabled ? (
                        <FormulariesEdit.Section.LabelInput
                        value={props.section.label_name} 
                        onChange={e=> {onChangeSectionName(e)}} 
                        isConditional={isConditional}
                        />
                    ) : (
                        <h2>
                            A seção está desativada
                        </h2>
                    )}
                        
                    </Col>
                </Row>
                <FormulariesEdit.ButtonsContainer>
                    <FormulariesEdit.Button onClick={e => {setOpenedSection(!openedSection)}} isOpen={openedSection} isConditional={isConditional}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="pencil-alt" isOpen={openedSection}/>
                        </div>
                        <small>{openedSection ? 'Editar Campos': 'Editar Seção'}</small>
                    </FormulariesEdit.Button>
                    <FormulariesEdit.Button isConditional={isConditional} onClick={e=> {onDisableSection(e)}}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="eye"/>
                        </div>
                        <small>{props.section.enabled ? 'Desativar': 'Ativar'}</small>
                    </FormulariesEdit.Button>
                    <FormulariesEdit.Button isConditional={isConditional}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="trash" />
                        </div>
                        <small>Apagar</small>
                    </FormulariesEdit.Button>
                    <FormulariesEdit.Button isConditional={isConditional} draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveSection(e)}} onDragEnd={e=>{onDragEnd(e)}}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="arrows-alt" />
                        </div>
                        <small>Mover</small>
                    </FormulariesEdit.Button>
                </FormulariesEdit.ButtonsContainer>
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
                            {props.section.id ? (
                                <FormulariesEdit.FieldContainer>
                                    <FormularyFieldsEdit
                                    fieldIsMoving={props.fieldIsMoving}
                                    setFieldIsMoving={props.setFieldIsMoving}
                                    sectionIndex={props.sectionIndex}
                                    onMoveField={props.onMoveField}
                                    types={props.types}
                                    fields={props.section.form_fields}
                                    onAddNewField={props.onAddNewField}
                                    onUpdateField={props.onUpdateField}
                                    formulariesOptions={props.formulariesOptions}
                                    />
                                </FormulariesEdit.FieldContainer>
                            ) : ''}
                        </div>
                    )}
                </div>
            ) : ''}
        </FormulariesEdit.Section.Container>
    )
}

export default FormularySectionEdit