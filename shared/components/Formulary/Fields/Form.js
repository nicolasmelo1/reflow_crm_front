import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import Select from '../../Utils/Select'
import agent from '../../../utils/agent'
import isEqual from '../../../utils/isEqual'
import { Field } from '../../../styles/Formulary'

const Form = (props) => {
    const [initialValue, setInitialValue] = useState([])
    const [searchValue, setSearchValue] = useState(null)
    const [options, setOptions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [page, setPage] = useState({
        current: 1,
        total: 1
    })
    const sourceRef = React.useRef(null)
    const isRequestingInitial = React.useRef(false)

    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }

    const onUpdateInitialValues = (options) => {
        const updateInitialValueState = (oldInitialValue, newInitialValue) => {
            if (!isEqual(oldInitialValue, newInitialValue)) {
                setInitialValue(newInitialValue)
            }
        }

        let fieldValue = []
        if(props.values.length !== 0){
            const selectedOption = options.filter(option => option.value.toString() === props.values[0].value.toString())
            if (selectedOption.length !== 0) {
                fieldValue = [{ value: selectedOption[0].value, label: selectedOption[0].label }]
                updateInitialValueState(initialValue, fieldValue)
            } else if (!isRequestingInitial.current) {
                isRequestingInitial.current = true
                agent.http.FORMULARY.getFormularyFormFieldOptions(sourceRef.current, props.formName, props.field.id, 1, null, props.values[0].value.toString()).then(response => {
                    isRequestingInitial.current = false
                    if (response && response.status === 200 && response.data.data.length > 0) {
                        fieldValue = [{ value: response.data.data[0].form_id, label: response.data.data[0].value }]
                        updateInitialValueState(initialValue, fieldValue)
                    }
                })

            }
        } else {
            updateInitialValueState(initialValue, fieldValue)
        }
    }

    /**
     * When the user reaches the bottom of the page we fetch for more data.
     */
    const fetchMoreOptions = async () => {
        if (page.current < page.total) {
            page.current = page.current+1
            const response = await agent.http.FORMULARY.getFormularyFormFieldOptions(sourceRef.current, props.formName, props.field.id, page.current, searchValue)
            if (response && response.status === 200) {
                const newOptions = response.data.data.map(option => { return {value: option.form_id, label: option.value} })
                setOptions([...options.concat(newOptions)])
                setPage({...page})
            }
        }
        return true        
    }

    const onFilter = async (value) => {
        value = ![null, ''].includes(value) ? value : null
        const response = await agent.http.FORMULARY.getFormularyFormFieldOptions(sourceRef.current, props.formName, props.field.id, 1, value)
        setSearchValue(value)
        if (response && response.status === 200) {
            const newOptions = response.data.data.map(option => { return {value: option.form_id, label: option.value} })
            setOptions(newOptions)
            setPage(response.data.pagination)   
        }
    }

    /** 
     * Calls the function just once and never more. To load the options data.
     * Refer here: https://github.com/facebook/react/issues/14326#issuecomment-441680293 
     * and here: https://stackoverflow.com/a/53121021
    */
    useEffect(() => {
        let didCancel = false;
        const cancelToken = axios.CancelToken
        sourceRef.current = cancelToken.source()

        async function fetchFormOptions() {
            try {
                const response = await agent.http.FORMULARY.getFormularyFormFieldOptions(sourceRef.current, props.formName, props.field.id, page.current);
                if (!didCancel) {
                    const options = response.data.data.map(option => { return {value: option.form_id, label: option.value} })
                    setOptions(options)
                    setPage(response.data.pagination)
                }
            } catch {}
        }  

        if (options.length === 0 && props.type !== 'preview') {
            fetchFormOptions()
        }
        return () => {
            didCancel = true
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        };
    },[])

    useEffect(() => {
        onUpdateInitialValues(options)
    }, [props.values, options])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Select isOpen={isOpen}>
                <Select 
                options={options} 
                onChange={onChange} 
                initialValues={initialValue} 
                isOpen={isOpen} 
                onFilter={onFilter}
                setIsOpen={setIsOpen}
                onScrollBottom={fetchMoreOptions}
                />
            </Field.Select>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Form