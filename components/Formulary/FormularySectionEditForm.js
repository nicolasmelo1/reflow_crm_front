import React, { useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { FormulariesEdit }  from 'styles/Formulary';
import { types, strings } from 'utils/constants';
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
                {strings['pt-br']['formularyEditSectionSelectionLabel']}
            </FormulariesEdit.Section.Formulary.FormTypeLabel>
            <FormulariesEdit.ButtonsContainer>
                {props.types.data.form_type.map(formType=> (
                    <FormulariesEdit.Button key={formType.id} onClick={e=>{onSetFormType(formType.id)}} isOpen={props.section.type === formType.id} isConditional={props.isConditional}>
                        <p>{types('pt-br', 'form_type', getFixedFormType(formType.type))}</p>
                        <small>
                            {getFixedFormType(formType.type)==='multi_form'? strings['pt-br']['formularyEditMultipleSectionDescription'] : strings['pt-br']['formularyEditSingleSectionDescription']}
                        </small>
                    </FormulariesEdit.Button>
                ))}
            </FormulariesEdit.ButtonsContainer>
            <Row>
                <FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
                    <FormulariesEdit.Section.Formulary.ConditionalButton>
                        {strings['pt-br']['formularyEditIsConditionalButtonLabel']}<input type="checkbox" checked={props.isConditional} onChange={e => {onChangeIsConditional(e)}}/>
                    </FormulariesEdit.Section.Formulary.ConditionalButton>
                </FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
            </Row>
            {props.isConditional ? (
                <Row>
                    <FormulariesEdit.Section.Formulary.ConditionalFormularyContainer>
                        <FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                            {strings['pt-br']['formularyEditConditionalFieldSelectorLabel']}
                        </FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                        <FormulariesEdit.SelectorContainer>
                            <Select 
                            options={conditionalFieldOptions} 
                            initialValues={initialConditionalFieldOption} 
                            onChange={onChangeConditionalField} 
                            optionColor={'#444'}
                            optionBackgroundColor={'#f2f2f2'}
                            optionDividerColor={'#0dbf7e'} 
                            />
                        </FormulariesEdit.SelectorContainer>
                        <FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                            {strings['pt-br']['formularyEditConditionalConditionalTypeSelectorLabel']}
                        </FormulariesEdit.Section.Formulary.ConditionalFormLabel> 
                        <FormulariesEdit.SelectorContainer>
                            <Select 
                            options={conditionalTypesOptions} 
                            initialValues={initialConditionalType} 
                            onChange={onChangeConditionalType} 
                            optionColor={'#444'}
                            optionBackgroundColor={'#f2f2f2'}
                            optionDividerColor={'#0dbf7e'} 
                            />
                        </FormulariesEdit.SelectorContainer>
                        <FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                            {strings['pt-br']['formularyEditConditionalValueInputLabel']}
                        </FormulariesEdit.Section.Formulary.ConditionalFormLabel> 
                        <FormulariesEdit.InputField
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