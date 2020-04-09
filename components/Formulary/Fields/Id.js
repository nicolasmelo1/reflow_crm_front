import React from 'react'
import Field from 'styles/Formulary/Field'


const Id = (props) => {
    return (
        <div>
            {props.values.length === 0 ? (
                <Field.Id.Description>
                    Esse valor é gerado automaticamente
                </Field.Id.Description>
            ): (
                <Field.Id.Value>
                    {props.values[0].value}
                </Field.Id.Value>
            )}
        </div>
    )
}
export default Id