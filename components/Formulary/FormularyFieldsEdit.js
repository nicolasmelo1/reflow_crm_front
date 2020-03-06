import React from 'react'
import FormularyFieldEdit from './FieldsEdit'
import { FormulariesEdit }  from 'styles/Formulary'

const FormularyFieldsEdit = (props) => {
    return (
        <div>
            {props.fields.map((field, index)=> (
                <FormularyFieldEdit
                key={index}
                field={field}
                types={props.types}
                fieldIsMoving={props.fieldIsMoving}
                onMoveField={props.onMoveField}
                setFieldIsMoving={props.setFieldIsMoving}
                sectionIndex={props.sectionIndex}
                onUpdateField={props.onUpdateField}
                formulariesOptions={props.formulariesOptions}
                fieldIndex={index}
                />
            ))}
            <FormulariesEdit.AddNewFieldButton text="Adicionar novo campo" onClick={e=>{props.onAddNewField(props.sectionIndex)}}/>

        </div>
    )
}

export default FormularyFieldsEdit