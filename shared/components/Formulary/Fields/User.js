import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import agent from '../../../utils/agent'
import Field from '../../../styles/Formulary/Field' 
import Select from '../../Utils/Select'
import axios from 'axios'


const User = (props) => {
    const [options, setOptions] = useState([])
    //const [data, _] = useState(props.userOptions ? props.userOptions.map(option => ({value: option.id, label: `${option.first_name} ${option.last_name}`})) : [])
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }
    
    useEffect(() => {
        if (props.values.length > 1) {
            props.singleValueFieldsHelper(props.values[0].value)
        }
    }, [props.values])
    
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
                const response = await agent.http.FORMULARY.getFormularyUserOptions(source, props.formName, props.field.id)
                if (!didCancel) {
                    setOptions(response.data.data.map(option => { return {value: option.id, label: `${option.first_name} ${option.last_name}`} }))
                }
            } catch {}
        }  
        if (options.length === 0 && props.type !== 'preview') {
            fetchUserOptions(source)
        }
        return () => {
            didCancel = true
            source.cancel()
        }
    },[])
    
    const fieldValue =  (props.values.length === 0) ? []: options.filter(initialOption => initialOption.value.toString() === props.values[0].value.toString())

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Select isOpen={isOpen}>
                <Select options={options} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
            </Field.Select>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default User