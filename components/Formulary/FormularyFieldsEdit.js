import React from 'react'
import FormularyFieldEdit from './FieldsEdit'

const FormularyFieldsEdit = (props) => {
    return (
        <div>
            {props.fields.map((field, index)=> (
                <FormularyFieldEdit
                key={index}
                field={field}
                types={props.types}
                sectionIndex={props.sectionIndex}
                onUpdateField={props.onUpdateField}
                formulariesOptions={props.formulariesOptions}
                fieldIndex={index}
                />
            ))}
        </div>
    )
}

export default FormularyFieldsEdit