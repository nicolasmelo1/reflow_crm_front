import React, { useState } from 'react'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'


const Option = (props) => {    
    const onChangeFieldOption = (e, index) => {
        const value = e.target.value
        if (props.field.field_option[index]) {
            if (value === '') {
                props.field.field_option.splice(index, 1) 
            } else {
                props.field.field_option[index].option = value
            }
        } else {
            props.field.field_option.push({
                id: null,
                option: value
            })
        }
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    let fieldOptions = [...props.field.field_option]
    fieldOptions.push({
        id: null,
        option: ''
    })

    return (
        <FormulariesEdit.FieldFormFieldContainer>
            <FormulariesEdit.FieldFormLabel>
                {strings['pt-br']['formularyEditFieldOptionLabel']}
            </FormulariesEdit.FieldFormLabel>
            {fieldOptions.map((fieldOption, index) => (
                <FormulariesEdit.InputField key={index} type="text" value={fieldOption.option} onChange={e=>{onChangeFieldOption(e, index)}}/>
            ))}
        </FormulariesEdit.FieldFormFieldContainer>
    )
}

export default Option