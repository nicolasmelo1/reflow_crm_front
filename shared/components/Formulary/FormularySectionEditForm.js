import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FormulariesEdit }  from '../../styles/Formulary'
import { types, strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import Select from '../Utils/Select';

const Row = dynamicImport('react-bootstrap', 'Row')

/**
 * This component controls the formulary for the section, the formulary of the section
 * is used to set conditionals and set the section type that right now can be unique or multiple.
 * 
 * @param {object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {Boolean} isConditional - boolean defined in the parent component that sets it the section is 
 * conditional or not.
 * @param {function} setIsConditional - function defined on the parent component that changes the `isConditional` state
 * @param {object} section - the SINGLE section data
 * @param {Integer} sectionIndex - the index of the section inside of the section array
 * @param {function} onUpdateSection - function helper created in the Formulary component to 
 * update a single section in the data store
 * @param {Array<Object>} fieldOptions - the fieldOptions are all of the fields the user can select when a user selects
 * the `form` field type or when the user creates a conditional section
 */
const FormularySectionEditForm = (props) => {
    const [conditionalFieldOptions, setConditionalFieldOptions] = useState([])
    const [initialConditionalFieldOption, setInitialConditionalFieldOption] = useState([])
    const [conditionalTypesOptions, setConditionalTypesOptions] = useState([])
    const [initialConditionalType, setInitialConditionalType] = useState([])


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
        if (props.isConditional) {
            props.section.conditional_on_field = null
            props.section.conditional_type = null
            props.section.conditional_value = null

            props.onUpdateSection(props.sectionIndex, {...props.section})
        }
        props.setIsConditional(!props.isConditional)
    } 

    useEffect(() => {
        setConditionalFieldOptions(props.fieldOptions.map(fieldOption => { return { value: fieldOption.id, label: fieldOption.label_name } }))
    }, [props.fieldOptions])

    useEffect(() => {
        setInitialConditionalFieldOption(props.fieldOptions.filter(fieldOption=> fieldOption.id === props.section.conditional_on_field).map(fieldOption=> { return { value: fieldOption.id, label: fieldOption.label_name } }))
    }, [props.fieldOptions, props.section.conditional_on_field])

    useEffect(() => {
        setConditionalTypesOptions(props.types.data.conditional_type.map(conditional=> { return { value: conditional.id, label: types('pt-br', 'conditional_type', conditional.type) } }))
    }, [props.types.data.conditional_type])
    
    useEffect(() => {
        setInitialConditionalType(props.types.data.conditional_type.filter(conditional=> conditional.id === props.section.conditional_type).map(conditional=> { return { value: conditional.id, label: types('pt-br', 'conditional_type', conditional.type) } }))
    }, [props.section.conditional_type, props.types.data.conditional_type])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
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
                            {strings['pt-br']['formularyEditIsConditionalButtonLabel']}<input style={{ marginLeft: '10px'}} type="checkbox" checked={props.isConditional} onChange={e => {onChangeIsConditional(e)}}/>
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
                                optionColor={'#17242D'}
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
                                optionColor={'#17242D'}
                                optionBackgroundColor={'#f2f2f2'}
                                optionDividerColor={'#0dbf7e'} 
                                />
                            </FormulariesEdit.SelectorContainer>
                            <FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                                {strings['pt-br']['formularyEditConditionalValueInputLabel']}
                            </FormulariesEdit.Section.Formulary.ConditionalFormLabel> 
                            <FormulariesEdit.InputField
                            autoComplete={'whathever'}
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

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySectionEditForm