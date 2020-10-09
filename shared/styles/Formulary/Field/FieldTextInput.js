import styled from 'styled-components'
import { Form } from 'react-bootstrap' 

export default styled(Form.Control)`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 2px solid #F2F2F2 !important;

    &:focus {
        color: #17242D;
        background-color: white;
        border: 2px solid #0dbf7e !important;
        box-shadow: none !important;
        outline: 0;
    }
`