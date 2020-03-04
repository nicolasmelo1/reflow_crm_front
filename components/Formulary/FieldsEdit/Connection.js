import React, { useState, useEffect } from 'react'
import Select from 'components/Utils/Select'
import agent from 'redux/agent'
import { strings } from 'utils/constants'
import { FormulariesEdit }  from 'styles/Formulary'

const Connection = (props) => {
    const [selectedGroup, setSelectedGroup] = useState((props.field.form_field_as_option) ? props.field.form_field_as_option.form_depends_on_group_id : null)
    const [selectedForm, setSelectedForm] = useState((props.field.form_field_as_option) ? props.field.form_field_as_option.form_depends_on_id : null)
    const [fields, setFields] = useState([])

    const onChangeGroup = (data) => {
        setSelectedGroup(data[0])
    }

    const onChangeForm = async (data) => {
        setSelectedForm(data[0])
    }

    const onChangeField = (data) => {
        props.field.form_field_as_option = {
            id : data[0],
            form_depends_on_id: selectedForm,
            form_depends_on_group_id: selectedGroup
        }
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const groupOptions = props.formulariesOptions.map(groupOption => { return {value: groupOption.id, label: groupOption.name} })
    const initialGroup = groupOptions.filter(groupOption => selectedGroup === groupOption.value)
    
    const fieldOptions = fields.map(fieldOption => { return {value: fieldOption.id, label: fieldOption.label_name} })
    const initialField = fieldOptions.filter(fieldOption => (props.field.form_field_as_option) ? props.field.form_field_as_option.id === fieldOption.value : false)

    let formOptions = []
    let initialForm = []

    for (let groupIndex = 0; groupIndex < props.formulariesOptions.length; groupIndex++) {
        if (props.formulariesOptions[groupIndex].id === selectedGroup) {
            for (let formIndex = 0; formIndex < props.formulariesOptions[groupIndex].form_group.length; formIndex++) {
                const data = {
                    value: props.formulariesOptions[groupIndex].form_group[formIndex].id,
                    label: props.formulariesOptions[groupIndex].form_group[formIndex].label_name
                }

                if (props.formulariesOptions[groupIndex].form_group[formIndex].id === selectedForm) {
                    initialForm.push(data)
                }
                formOptions.push(data)
            }
        }
    }
    
    // See Components/Formulary/Fields/Form.js for details and explanation
    useEffect(() => {
        let didCancel = false;

        async function fetchFieldOptions() {
            if (selectedForm) {
                const response = await agent.HOME.getFieldOptions(selectedForm)
                if (!didCancel && response.status === 200) {
                    setFields(response.data.data)
                }
            }
        }  
        
        fetchFieldOptions()

        return () => { didCancel = true; };
    }, [selectedForm, selectedGroup])

    return (
        <div>
            <div style={{margin: '10px 0'}}>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldConnectionTemplateSelectorLabel']}
                </FormulariesEdit.FieldFormLabel>
                <FormulariesEdit.SelectorContainer>
                    <Select 
                    options={groupOptions} 
                    initialValues={initialGroup} 
                    onChange={onChangeGroup} 
                    />
                </FormulariesEdit.SelectorContainer>
                
            </div>
            {initialGroup.length !== 0 ? (
                <div style={{margin: '10px 0'}}>
                    <FormulariesEdit.FieldFormLabel>
                        {strings['pt-br']['formularyEditFieldConnectionFormularySelectorLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.SelectorContainer>
                        <Select 
                        options={formOptions} 
                        initialValues={initialForm} 
                        onChange={onChangeForm} 
                        />
                    </FormulariesEdit.SelectorContainer>
                </div>
            ): ''}
            {initialForm.length !== 0 && initialGroup.length !== 0 ?  (
                <div style={{margin: '10px 0'}}>
                    <FormulariesEdit.FieldFormLabel>
                        {strings['pt-br']['formularyEditFieldConnectionFieldSelectorLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.SelectorContainer>
                        <Select 
                        options={fieldOptions} 
                        initialValues={initialField} 
                        onChange={onChangeField} 
                        />
                    </FormulariesEdit.SelectorContainer>
                </div>
            ): ''}
        </div>
    )
}

export default Connection