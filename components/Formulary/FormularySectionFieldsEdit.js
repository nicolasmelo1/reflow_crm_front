import React from 'react'

const FormularySectionFieldsEdit = (props) => {
    return (
        <div>
            {props.fields.map(field=> (
                <div>
                    <input value={field.label_name}/>
                </div>
            ))}
        </div>
    )
}

export default FormularySectionFieldsEdit