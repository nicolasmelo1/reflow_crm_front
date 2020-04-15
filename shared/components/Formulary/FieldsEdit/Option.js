import React, { useState } from 'react'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'

const Option = (props) => {
    const [writingValue, setWritingValue] = useState('')

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
        setWritingValue(value)
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    let fieldOptions = [...props.field.field_option]
    fieldOptions.push({
        id: null,
        option: ''
    })

   
    const setRef = (ref) => {
        if (ref && writingValue !== '' && ref.value === writingValue){
            ref.focus()
        }
    }

    return (
        <FormulariesEdit.FieldFormFieldContainer>
            <FormulariesEdit.FieldFormLabel>
                {strings['pt-br']['formularyEditFieldOptionLabel']}
            </FormulariesEdit.FieldFormLabel>
            {fieldOptions.map((fieldOption, index) => (
                <FormulariesEdit.InputField ref={setRef} key={fieldOption.option} type="text" value={fieldOption.option} onChange={e=>{onChangeFieldOption(e, index)}}/>
            ))}
        </FormulariesEdit.FieldFormFieldContainer>
    )
}

export default Option