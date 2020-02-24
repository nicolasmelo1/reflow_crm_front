import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormulariesEdit }  from 'styles/Formulary'
import { types } from 'utils/constants'
import Select from 'components/Utils/Select'

const FormularySectionEditForm = (props) => {
    const [conditionalField, setConditionalField] = useState([])
    const onSetFormType = (formTypeId) => {
        props.section.type = formTypeId
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const getFixedFormType = (formType) => {
        return (formType ==='multi-form') ? 'multi_form': formType
    }

    const initialConditionalFieldValue =  (conditionalField.length!==0) ? [{ value: conditionalField[0], label: conditionalField[0] }]: []


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
                    <Col style={{ display: 'inline-block'}}>
                        <div>Quando o campo</div>
                        <div style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2', margin:'auto', maxWidth:'200px', textAlign: 'left'}} > 
                            <Select 
                            options={[{value:'teste', label:'teste'},{value:'teste2', label:'teste2'}]} 
                            initialValues={initialConditionalFieldValue} 
                            onChange={setConditionalField} 
                            optionColor={'#444'}
                            optionBackgroundColor={'#f2f2f2'}
                            optionDividerColor={'#0dbf7e'} 
                            searchValueColor={'#f2f2f2'}/>
                        </div>
                        <div> for </div> 
                        <input style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2'}} type='text'/> 
                        <div> valor </div> 
                        <input style={{border: 0, backgroundColor: 'transparent', borderBottom: '1px solid #f2f2f2'}} type='text'/>
                    </Col>
                </Row>
            ) : ''}
        </div>
    )
}

export default FormularySectionEditForm