import React from 'react'
import { Field } from 'styles/Formulary'
import Datepicker from 'components/Formulary/utils/Datepicker'

const Date = (props) => {
    const inputRef = React.useRef(null)
    return (
        <>
            <Field.Text ref={inputRef} type="text"/>
            <Datepicker input={inputRef} />
        </>
    )
}

export default Date