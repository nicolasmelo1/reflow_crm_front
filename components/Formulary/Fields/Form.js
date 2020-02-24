import React, { useState, useEffect } from 'react'
import Select from 'components/Utils/Select'
import agent from 'redux/agent'
import { useRouter } from 'next/router'

const Form = (props) => {
    const [options, setOptions] = useState([])
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }

    let fieldValue = []
    if(props.values.length !== 0){
        const selectedOption = options.filter(option => option.value.toString() === props.values[0].value.toString())
        if (selectedOption.length !== 0) {
            fieldValue = [{ value: selectedOption[0].value, label: selectedOption[0].label }]
        }
    }

    /** 
     * Calls the function just once and never more. To load the options data.
     * Refer here: https://github.com/facebook/react/issues/14326#issuecomment-441680293 
     * and here: https://stackoverflow.com/a/53121021
    */
    useEffect(() => {
        let didCancel = false;

        async function fetchFormOptions() {
            const response = await agent.HOME.getFormularyFormFieldOptions(router.query.form, props.field.id);
            if (!didCancel) {
                setOptions(response.data.data.map(option => { return {value: option.form_id, label: option.value} }))
            }
        }  

        if (options.length === 0) {
            fetchFormOptions()
        }
        return () => { didCancel = true; };
    },[])


    return (
        <Field.Select isOpen={isOpen}>
            <Select options={options} onChange={onChange} initialValues={fieldValue} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </Field.Select>
    )
}

export default Form