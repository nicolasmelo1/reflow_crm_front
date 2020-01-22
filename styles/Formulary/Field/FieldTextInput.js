import styled from 'styled-components'
import { Form } from 'react-bootstrap' 

export default styled(Form.Control)`
    border: 0;
    background-color: white;
    color: #444;
    border: 1px solid #0dbf7e;

    &:focus {
        color: #444;
        background-color: white;
        border: 1px solid #444;
        box-shadow: none;
        outline: 0;
    }
`