import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'components/Utils/Select'
import agent from 'redux/agent'

const Connection = (props) => {
    const [selectedGroup, setSelectedGroup] = useState(props.field.form_field_as_option.form_depends_on_group_id)
    const [selectedForm, setSelectedForm] = useState(props.field.form_field_as_option.form_depends_on_id)
    const [fields, setFields] = useState([])

    const onChangeGroup = (data) => {
        setSelectedGroup(data[0])
    }

    const onChangeForm = async (data) => {
        setSelectedForm(data[0])
    }

    const onChangeField = (data) => {
        props.field.form_field_as_option.id = data[0]
        props.field.form_field_as_option.form_depends_on_id = selectedForm
        props.field.form_field_as_option.form_depends_on_group_id = selectedGroup
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const groupOptions = props.formulariesOptions.map(groupOption => { return {value: groupOption.id, label: groupOption.name} })
    const initialGroup = groupOptions.filter(groupOption => selectedGroup === groupOption.value)
    
    const fieldOptions = fields.map(fieldOption => { return {value: fieldOption.id, label: fieldOption.label_name} })
    const initialField = fieldOptions.filter(fieldOption =>  props.field.form_field_as_option.id === fieldOption.value)

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
            const response = await agent.HOME.getFieldOptions(selectedForm)
            if (!didCancel) {
                setFields(response.data.data)
            }
        }  
        
        fetchFieldOptions()
    
        return () => { didCancel = true; };
    }, [selectedForm, selectedGroup])


    return (
        <div>
            <div style={{margin: '10px 0'}}>
                <label style={{color:'#444', margin: '0'}}>Qual o template da conexão?</label>
                <div style={{ backgroundColor:'#fff'}}>
                    <Select 
                    options={groupOptions} 
                    initialValues={initialGroup} 
                    onChange={onChangeGroup} 
                    />
                </div>
                
            </div>
            {initialGroup.length !== 0 ? (
                <div style={{margin: '10px 0'}}>
                    <label style={{color:'#444', margin: '0'}}>Com qual formulário você deseja conectar?</label>
                    <div style={{ backgroundColor:'#fff'}}>
                        <Select 
                        options={formOptions} 
                        initialValues={initialForm} 
                        onChange={onChangeForm} 
                        />
                    </div>
                </div>
            ): ''}
            {initialForm.length !== 0 && initialGroup.length !== 0 ?  (
                <div style={{margin: '10px 0'}}>
                    <label style={{color:'#444', margin: '0'}}>Qual campo será usado como opção?</label>
                    <div style={{ backgroundColor:'#fff'}}>
                        <Select 
                        options={fieldOptions} 
                        initialValues={initialField} 
                        onChange={onChangeField} 
                        />
                    </div>
                </div>
            ): ''}
        </div>
    )
}

export default Connection