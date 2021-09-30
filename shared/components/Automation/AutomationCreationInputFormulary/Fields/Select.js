import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select as SelectUtils } from '../../../Utils'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Select = (props) => {
    const [options, setOptions] = useState([])

    const onChangeSelection = (optionValues) => {
        if (optionValues && optionValues.length > 0) {
            const fieldValueUUID = props.records.fieldValue.length > 0 ? props.records.fieldValue.uuid : null
            props.setFieldValue(optionValues[0], props.field.id, props.section.id, fieldValueUUID, props.records.sectionRecordUUID)
        } else if (props.records.fieldValue?.uuid) {
            props.setFieldValue(null, props.field.id, props.section.id, props.records.fieldValue.uuid, props.records.sectionRecordUUID)
        }
    }

    useEffect(() => {
        setOptions(props.field.field_field_options.map(fieldOption => (
            {
                label: fieldOption.option, 
                value: fieldOption.option
            }
        )))
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div
            style={{
                border: '2px solid #bfbfbf',
                borderRadius: '5px'
            }}
            >
                <SelectUtils
                options={options}
                initialValues={ 
                    props.records.fieldValue?.value ? 
                    [{label: props.records.fieldValue.value, value: props.records.fieldValue.value}] : []
                }
                onChange={onChangeSelection}
                />
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Select