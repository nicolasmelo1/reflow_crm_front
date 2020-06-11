import React, { useState } from 'react'
import Field from '../../../styles/Formulary/Field' 
import Select from '../../Utils/Select'

const User = (props) => {
    const [options, setOptions] = useState([])
    const [data, _] = useState(props.userOptions ? props.userOptions.map(option => ({value: option.id, label: `${option.first_name} ${option.last_name}`})) : [])
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

        async function fetchFormOptions(source) {
            try {
                const response = await agent.http.FORMULARY.getFormularyUserOptions(source, router.query.form, props.field.id)
                
                if (!didCancel) {
                    setOptions(response.data.data.map(option => { return {value: option.form_id, label: option.value} }))
                }
            } catch {}
        }  

        if (options.length === 0) {
            fetchFormOptions(source)
        }
        return () => {
            didCancel = true
            source.cancel()
        }
    },[])
    
    const fieldValue =  (props.values.length === 0) ? []: data.filter(initialOption => initialOption.value.toString() === props.values[0].value.toString())


    return (
        <Field.Select isOpen={isOpen}>
            <Select options={data} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
        </Field.Select>
    )
}

export default User