import React, { useState, useEffect } from 'react'
import Select from 'components/Utils/Select'
import agent from 'redux/agent'
import { useRouter } from 'next/router'

const Form = (props) => {
    //props.field.form_field_as_option.field_value.map(option => { return {value: option.form_id, label: option.value} })
    const [options, setOptions] = useState([])
    const router = useRouter()

    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }

    let fieldValue = []
    if(props.values.length !== 0){
        const selectedOption = props.field.form_field_as_option.field_value.filter(option => option.form_id.toString() === props.values[0].value.toString())
        fieldValue = [{ value: selectedOption[0].form_id, label: selectedOption[0].value }]
    }


    useEffect(() => {
        if (options.length === 0) {
            agent.HOME.getFormularyFormFieldOptions(router.query.form, props.field.id).then(response=> {
                setOptions(response.data.data.map(option => { return {value: option.form_id, label: option.value} }))
            })
        }
    })


    return (
        <Select options={options} onChange={onChange} initialValues={fieldValue}/>
    )
}

export default Form