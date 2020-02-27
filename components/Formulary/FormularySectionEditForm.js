import React, { useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { FormulariesEdit }  from 'styles/Formulary';
import { types } from 'utils/constants';
import Select from 'components/Utils/Select';

const FormularySectionEditForm = (props) => {
    const onSetFormType = (formTypeId) => {
        props.section.type = formTypeId;
        props.onUpdateSection(props.sectionIndex, {...props.section});
    }

    const getFixedFormType = (formType) => {
        return (formType ==='multi-form') ? 'multi_form': formType;
    }

    const onChangeConditionalField = (data) => {
        props.section.conditional_on_field = data[0]
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const onChangeConditionalValue = (e) => {
        e.preventDefault();
        props.section.conditional_value = e.target.value
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }

    const onChangeConditionalType = (data) => {
        props.section.conditional_type = data[0]
        props.onUpdateSection(props.sectionIndex, {...props.section})
    }
    
    const onChangeIsConditional = (e) => {
        if (!props.isConditional) {
            props.section.condtional_on_field = null
            props.section.conditional_type = null
            props.section.conditional_value = null

            props.onUpdateSection(props.sectionIndex, {...props.section})
        }
        props.setIsConditional(!props.isConditional)
    } 

    const conditionalFieldOptions = props.fieldOptions.map(fieldOption => { return { value: fieldOption.id, label: fieldOption.label_name } })
    const initialConditionalFieldOption = props.fieldOptions.filter(fieldOption=> fieldOption.id === props.section.conditional_on_field).map(fieldOption=> { return { value: fieldOption.id, label: fieldOption.label_name } })

    const initialConditionalType = (props.section.conditional_type && props.types.data.conditional_type) ? props.types.data.conditional_type.filter(conditional=> conditional.id === props.section.conditional_type).map(conditional=> { return { value: conditional.id, label: types('pt-br', 'conditional_type', conditional.type) } }) : []
    const conditionalTypesOptions = (props.types && props.types.data && props.types.data.conditional_type) ? 
        props.types.data.conditional_type.map(conditional=> { return { value: conditional.id, label: types('pt-br', 'conditional_type', conditional.type) } }): []


    return (
        <div>
            <FormulariesEdit.Section.Formulary.FormTypeLabel>
                Qual o tipo da seção?
            </FormulariesEdit.Section.Formulary.FormTypeLabel>
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
                <FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
                    <FormulariesEdit.Section.Formulary.ConditionalButton>
                        Seção é condicional?<input type="checkbox" checked={props.isConditional} onChange={e => {onChangeIsConditional(e)}}/>
                    </FormulariesEdit.Section.Formulary.ConditionalButton>
                </FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
            </Row>
            {props.isConditional ? (
                <Row>
                    <FormulariesEdit.Section.Formulary.ConditionalFormularyContainer>
                        <div>Quando o campo</div>
                        <div style={{border: 0, backgroundColor: 'white', textAlign: 'left'}} > 
                            <Select 
                            options={conditionalFieldOptions} 
                            initialValues={initialConditionalFieldOption} 
                            onChange={onChangeConditionalField} 
                            optionColor={'#444'}
                            optionBackgroundColor={'#f2f2f2'}
                            optionDividerColor={'#0dbf7e'} 
                            />
                        </div>
                        <div> for </div> 
                        <div style={{border: 0, backgroundColor: 'white',  textAlign: 'left'}} > 
                            <Select 
                            options={conditionalTypesOptions} 
                            initialValues={initialConditionalType} 
                            onChange={onChangeConditionalType} 
                            optionColor={'#444'}
                            optionBackgroundColor={'#f2f2f2'}
                            optionDividerColor={'#0dbf7e'} 
                            />
                        </div>
                        <div> valor </div> 
                        <Form.Control 
                        type="text" 
                        value={(props.section.conditional_value) ? props.section.conditional_value : ''} 
                        onChange={e => {onChangeConditionalValue(e)}}
                        />
                    </FormulariesEdit.Section.Formulary.ConditionalFormularyContainer>
                </Row>
            ) : ''}
        </div>
    )
}

export default FormularySectionEditForm