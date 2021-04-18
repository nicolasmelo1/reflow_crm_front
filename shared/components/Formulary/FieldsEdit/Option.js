import React from 'react'
import { View } from 'react-native'
import { strings } from '../../../utils/constants'
import generateUUID from '../../../utils/generateUUID'
import { FormulariesEdit } from '../../../styles/Formulary'


const Option = (props) => {    
    const getNewFieldOption = (value) => ({
        id: null,
        uuid: generateUUID(),
        option: value
    })
    
    const onChangeFieldOption = (value, index) => {
        if (props.field.field_option[index]) {
            if (value === '') {
                props.field.field_option.splice(index, 1) 
            } else {
                props.field.field_option[index].option = value
            }
        } else {
            props.field.field_option.push(getNewFieldOption(value))
        }
        props.onUpdateField(props.field)
    }

    let fieldOptions = [...props.field.field_option]

    fieldOptions.push(getNewFieldOption(''))

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldOptionLabel']}
                </FormulariesEdit.FieldFormLabel>
                {fieldOptions.map((fieldOption, index) => (
                    <FormulariesEdit.InputField 
                    key={index} 
                    autoComplete={'whathever'} 
                    type="text" 
                    value={fieldOption.option} 
                    onChange={e=>{onChangeFieldOption(e.target.value, index)}}
                    />
                ))}
            </FormulariesEdit.FieldFormFieldContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Option