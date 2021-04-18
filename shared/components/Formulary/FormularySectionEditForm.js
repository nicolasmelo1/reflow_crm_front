import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FormulariesEdit }  from '../../styles/Formulary'
import { types, strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import Select from '../Utils/Select';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

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
 * @param {function} onUpdateSection - function helper created in the Formulary component to 
 * update a single section in the data store
 * @param {Function} retrieveFormularyData - Since we do not always update the state we use a callback to retrieve the formulary data
 * so we can use it.
 */
const FormularySectionEditForm = (props) => {
    const [conditionalFieldOptions, setConditionalFieldOptions] = useState([])
    const [conditionalTypesOptions, setConditionalTypesOptions] = useState([])
    // ------------------------------------------------------------------------------------------
    /**
     * Changes the section type, it can be either a form or a multi-form, a multi-form is a section that will repeat
     * many times, like comments, or any other stuff, all of the contents of this section will be repeated.
     * 
     * @param {BigInteger} formTypeId - The id of the section type
     */
    const onChangeSectionType = (formTypeId) => {
        props.section.type = formTypeId
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user changes the conditional field we call this function.
     * 
     * @param {Array<BigInteger>} selectedFieldIds - Returns an array of the selected field ids
     */
    const onChangeConditionalField = (selectedFieldIds) => {
        props.section.conditional_on_field = selectedFieldIds.length > 0 ? selectedFieldIds[0] : null
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Changes the conditional value, so when the value matches this condition EXACTLY, we show this section
     * for the user
     * 
     * @param {String} conditionalValue - The condition value to use. While the user is filling the form,
     * when it matches this condition, then we show this section
     */
    const onChangeConditionalValue = (conditionalValue) => {
        props.section.conditional_value = conditionalValue
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeConditionalType = (data) => {
        props.section.conditional_type = data[0]
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeShowLabelName = () => {
        props.section.show_label_name = !props.section.show_label_name
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    const onChangeConditionalExcludesDataIfNotSet = () => {
        props.section.conditional_excludes_data_if_not_set = !props.section.conditional_excludes_data_if_not_set
        props.onUpdateSection(props.section)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user clicks that this section is conditional, we usually do nothing, but when the user unselects
     * we set every conditional field in our section object to null.
     */
    const onChangeIsConditional = () => {
        if (props.isConditional) {
            props.section.conditional_on_field = null
            props.section.conditional_type = null
            props.section.conditional_value = null
            props.section.conditional_excludes_data_if_not_set = true
            props.onUpdateSection(props.section)
        }
        props.setIsConditional(!props.isConditional)
    } 
    // ------------------------------------------------------------------------------------------
    /**
     * Just a handy function used to retrieve the multi-form underlined, this is dumb and might change on the backend
     * 
     * @param {String} formType - The type of the section, this is the name and not the id
     * 
     * @returns {String} - Returns the formated string with an underline if it is a `multi-form` string
     */
    const getFixedFormType = (formType) => {
        return (formType ==='multi-form') ? 'multi_form': formType
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const formularyData = props.retrieveFormularyData()
        let fieldOptions = []
        
        formularyData.depends_on_form.forEach(section => {
            if (section.uuid !== props.section.uuid && section.id !== null) {
                section.form_fields.forEach(field => {
                    if (field.id !== null) {
                        fieldOptions.push({
                            value: field.id,
                            label: field.label_name
                        })
                    }   
                })
            }
        })
        setConditionalFieldOptions(fieldOptions)
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setConditionalTypesOptions(props.types.data.conditional_type.map(conditional=> { return { value: conditional.id, label: types('pt-br', 'conditional_type', conditional.type) } }))
    }, [props.types.data.conditional_type])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                <button 
                onClick={(e) => onChangeShowLabelName()}
                style={{ 
                    color: props.isConditional ? '#f2f2f2' : '#17242D',
                    border: !props.section.show_label_name ? '1px solid #0dbf7e' : '1px solid red', 
                    borderRadius: '10px', 
                    padding: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'transparent',
                    width: '100%',
                    marginBottom: '10px'
                }}
                >
                    <FontAwesomeIcon 
                    style={{
                        color: !props.section.show_label_name ? '#0dbf7e' : 'red', 
                    }}
                    icon={!props.section.show_label_name ? 'check' : 'times'}
                    />
                    &nbsp;{'Ocultar titulo da seção'}
                </button>
                <FormulariesEdit.Section.Formulary.FormTypeLabel>
                    {strings['pt-br']['formularyEditSectionSelectionLabel']}
                </FormulariesEdit.Section.Formulary.FormTypeLabel>
                <FormulariesEdit.ButtonsContainer>
                    {props.types.data.form_type.map(formType=> (
                        <FormulariesEdit.Button 
                        key={formType.id} 
                        onClick={e=>{onChangeSectionType(formType.id)}} 
                        isOpen={props.section.type === formType.id} 
                        isConditional={props.isConditional}
                        >
                            <p>
                                {types('pt-br', 'form_type', getFixedFormType(formType.type))}
                            </p>
                            <small>
                                {getFixedFormType(formType.type)==='multi_form'? strings['pt-br']['formularyEditMultipleSectionDescription'] : strings['pt-br']['formularyEditSingleSectionDescription']}
                            </small>
                        </FormulariesEdit.Button>
                    ))}
                </FormulariesEdit.ButtonsContainer>
                <Row>
                    <FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
                        <FormulariesEdit.Section.Formulary.ConditionalButton>
                            {strings['pt-br']['formularyEditIsConditionalButtonLabel']}
                            <input 
                            style={{ marginLeft: '10px'}} 
                            type="checkbox" 
                            checked={props.isConditional} 
                            onChange={e => {onChangeIsConditional()}}
                            />
                        </FormulariesEdit.Section.Formulary.ConditionalButton>
                    </FormulariesEdit.Section.Formulary.ConditionalButtonContainer>
                </Row>
                {props.isConditional ? (
                    <Row>
                        <FormulariesEdit.Section.Formulary.ConditionalFormularyContainer>
                            <button 
                            onClick={(e) => onChangeConditionalExcludesDataIfNotSet()}
                            style={{ 
                                color: props.isConditional ? '#f2f2f2' : '#17242D',
                                border: props.section.conditional_excludes_data_if_not_set ? '1px solid #0dbf7e' : '1px solid red', 
                                borderRadius: '10px', 
                                padding: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                backgroundColor: 'transparent',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}
                            >
                                <FontAwesomeIcon 
                                style={{
                                    color: props.section.conditional_excludes_data_if_not_set ? '#0dbf7e' : 'red', 
                                }}
                                icon={props.section.conditional_excludes_data_if_not_set ? 'check' : 'times'}
                                />
                                {' As informações são excluidas quando a condicional não for satisfeita'}
                            </button>
                            <FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                                {strings['pt-br']['formularyEditConditionalFieldSelectorLabel']}
                            </FormulariesEdit.Section.Formulary.ConditionalFormLabel>
                            <FormulariesEdit.SelectorContainer>
                                <Select 
                                options={conditionalFieldOptions} 
                                initialValues={conditionalFieldOptions.filter(fieldOption => fieldOption.value === props.section.conditional_on_field)} 
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
                                initialValues={conditionalTypesOptions.filter(conditionalType => conditionalType.value === props.section.conditional_type)} 
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
                            onChange={e => {onChangeConditionalValue(e.target.value)}}
                            />
                        </FormulariesEdit.Section.Formulary.ConditionalFormularyContainer>
                    </Row>
                ) : ''}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySectionEditForm