import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import agent from '../../../utils/agent'
import Field from '../../../styles/Formulary/Field' 
import Select from '../../Utils/Select'
import axios from 'axios'


const User = (props) => {
    const router = useRouter()

    const [options, setOptions] = useState([])
    //const [data, _] = useState(props.userOptions ? props.userOptions.map(option => ({value: option.id, label: `${option.first_name} ${option.last_name}`})) : [])
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }
    
    /** 
     * Calls the function just once and never more. To load the options data.
     * Refer here: https://github.com/facebook/react/issues/14326#issuecomment-441680293 
     * and here: https://stackoverflow.com/a/53121021
    */
   useEffect(() => {
        let didCancel = false;
        const cancelToken = axios.CancelToken
        const source = cancelToken.source()

        async function fetchUserOptions(source) {
            try{
                const response = await agent.http.FORMULARY.getFormularyUserOptions(source, router.query.form, props.field.id)
                if (!didCancel) {
                    setOptions(response.data.data.map(option => { return {value: option.id, label: `${option.first_name} ${option.last_name}`} }))
                }
            } catch {}
        }  
        if (options.length === 0) {
            fetchUserOptions(source)
        }
        return () => {
            didCancel = true
            source.cancel()
        }
    },[])
    
    const fieldValue =  (props.values.length === 0) ? []: options.filter(initialOption => initialOption.value.toString() === props.values[0].value.toString())


    return (
        <Field.Select isOpen={isOpen}>
            <Select options={options} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
        </Field.Select>
    )
}

export default User