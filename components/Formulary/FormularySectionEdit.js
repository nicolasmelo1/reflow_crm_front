import React, { useState } from 'react'
import Fields from './Fields'
import { Col, Row } from 'react-bootstrap'
import FormularyFieldEdit from './FormularyFieldEdit'
import { FormulariesEdit }  from 'styles/Formulary'
import { types } from 'utils/constants'
import FormularySectionEditForm from './FormularySectionEditForm'

const FormularySectionEdit = (props) => {
    const [openedSection, setOpenedSection] = useState(false)
    const [isConditional, setIsConditional] = useState(props.section.conditional_on_field !== null)
    

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

    return (
        <div style={{margin: '5px 0', border: '1px solid #f2f2f2', borderRadius: '10px'}}>
            <FormulariesEdit.SectionContainer isConditional={isConditional}>
                <Row>
                    <Col>
                        <FormulariesEdit.SectionLabelInput
                            value={props.section.label_name} 
                            onChange={e=> {onChangeSectionName(e)}} 
                            isConditional={isConditional}
                            />
                    </Col>
                </Row>
                <FormulariesEdit.ButtonsContainer>
                    <FormulariesEdit.Button onClick={e => {setOpenedSection(!openedSection)}} isOpen={openedSection} isConditional={isConditional}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="pencil-alt" isOpen={openedSection}/>
                        </div>
                        <small>{openedSection ? 'Editar Campos': 'Editar Seção'}</small>
                    </FormulariesEdit.Button>
                    <FormulariesEdit.Button isConditional={isConditional}>
                        <div>
                            <FormulariesEdit.Icon.SectionIcon isConditional={isConditional} size="sm" type="form" icon="eye"/>
                        </div>
                        <small>Desativar</small>
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
            </FormulariesEdit.SectionContainer>
            {openedSection ? (
                <FormulariesEdit.SectionEditionFormularyContainer isConditional={isConditional}>
                    <FormularySectionEditForm
                    types={props.types}
                    isConditional={isConditional}
                    setIsConditional={setIsConditional}
                    section={props.section}
                    sectionIndex={props.sectionIndex}
                    onUpdateSection={props.onUpdateSection}
                    />
                </FormulariesEdit.SectionEditionFormularyContainer>
            ) : (
                <FormulariesEdit.FieldContainer>
                    <FormularyFieldEdit
                    fields={props.section.form_fields}
                    />
                </FormulariesEdit.FieldContainer>
            )}
        </div>
    )
}

export default FormularySectionEdit