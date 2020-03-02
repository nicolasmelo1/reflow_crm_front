import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'components/Utils/Select'

const Connection = (props) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedForm, setSelectedForm] = useState(null)

    const onChangeGroup = (data) => {
        setSelectedGroup(data[0])
    }

    const onChangeForm = (data) => {
        setSelectedForm(data[0])
    }

    const initialGroup = props.formulariesOptions.filter(groupOption => selectedGroup === groupOption.id).map(groupOption => { return {value: groupOption.id, label: groupOption.name} })
    const groupOptions = props.formulariesOptions.map(groupOption => { return {value: groupOption.id, label: groupOption.name} })
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

    return (
        <div>
            <div style={{margin: '10px 0'}}>
                <label style={{color:'#444', margin: '0'}}>Com qual formulário você deseja conectar?</label>
                <Select 
                options={groupOptions} 
                initialValues={initialGroup} 
                onChange={onChangeGroup} 
                />
            </div>
            {formOptions.length !== 0 ? (
                <div style={{margin: '10px 0'}}>
                    <label style={{color:'#444', margin: '0'}}>Com qual formulário você deseja conectar?</label>
                    <Select 
                    options={formOptions} 
                    initialValues={initialForm} 
                    onChange={onChangeForm} 
                    />
                </div>
            ): ''}
        </div>
    )
}

export default Connection