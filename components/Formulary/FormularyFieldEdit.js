import React from 'react'
import Fields from './Fields'
import { FormulariesEdit }  from 'styles/Formulary'

const FormularyFieldEdit = (props) => {
    return (
        <div>
            {props.fields.map((field, index)=> (
                <div key={index} style={{borderTop: '2px solid #f2f2f2', padding: '5px'}}>
                    <div style={{height: '1em', margin: '5px'}}>
                        <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="trash"/>
                        <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="eye"/>
                        <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="arrows-alt" />
                        <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="pencil-alt"/>
                            
                    </div> 
                    <Fields 
                    errors={{}}
                    field={field}
                    fieldFormValues={[]} 
                    />
                </div>
            ))}
        </div>
    )
}

export default FormularyFieldEdit