import styled from 'styled-components'
import { Form } from 'react-bootstrap' 

export default styled(Form.Control)`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 2px solid #F2F2F2;

    &:focus {
        color: #17242D;
        background-color: white;
        border: 1px solid #0dbf7e;
        box-shadow: none;
        outline: 0;
    }
`