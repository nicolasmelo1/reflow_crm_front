import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default styled(React.forwardRef(({error, ...rest}, ref) => <Form.Control {...rest} ref={ref}/>))`
    outline: none;
    border: 2px solid ${props => props.error ? 'red': '#f2f2f2'};
    margin: 0;
    
    &:focus {
        outline: none;
        border: 2px solid ${props => props.error ? 'red': '#0dbf7e'};
        box-shadow: none
    }
`