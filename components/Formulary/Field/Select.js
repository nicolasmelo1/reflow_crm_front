import React from 'react'
import { Field } from 'styles/Formulary'


const Select = (props) => (
    <div>
        <Field.Text type="text"/>
        <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', height:'100px', width: '100px', backgroundColor:'black', zIndex: 10}}></div>
        </div>
    </div>
)

export default Select