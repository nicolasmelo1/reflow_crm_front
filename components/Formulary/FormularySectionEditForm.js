import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormulariesEdit }  from 'styles/Formulary'
import { types } from 'utils/constants'

const FormularySectionEditForm = (props) => {

    const onSetFormType = (formTypeId) => {
        props.section.type = formTypeId
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const getFixedFormType = (formType) => {
        return (formType ==='multi-form') ? 'multi_form': formType
    }
    return (
        <div>
            <label style={{fontWeight: 'bold'}}>Qual o tipo da seção?</label>
            <FormulariesEdit.ButtonsContainer>
                {props.types.data.form_type.map(formType=> (
                    <FormulariesEdit.Button key={formType.id} onClick={e=>{onSetFormType(formType.id)}} isOpen={props.section.type === formType.id} isConditional={props.isConditional}>
                        <p>{types('pt-br', 'form_type', getFixedFormType(formType.type))}</p>
                        <small>
                            {getFixedFormType(formType.type)==='multi_form'? 'Os campos deste tipo de seção PODEM ser duplicados.' : 'Os campos deste tipo de seção NÃO PODEM ser duplicados.'}
                        </small>
                    </FormulariesEdit.Button>
                ))}
            </FormulariesEdit.ButtonsContainer>
            <Row>
                <Col style={{margin: '5px'}}>
                    <label style={{ backgroundColor:'#444',color:'#f2f2f2', fontWeight: 'bold', borderRadius:'10px ', padding: '5px', margin:'0'}}>
                        Seção é condicional?<input type="checkbox" checked={props.isConditional} onChange={e=> {props.setIsConditional(!props.isConditional)}}></input>
                    </label>
                </Col>
            </Row>
            {props.isConditional ? (
                <Row>
                    <Col>
                        Quando o <input style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2'}} type='text'/> for <input style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2'}} type='text'/> a <input style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2'}} type='text'/>
                    </Col>
                </Row>
            ) : ''}
        </div>
    )
}

export default FormularySectionEditForm