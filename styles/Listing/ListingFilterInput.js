import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default styled(Form.Control)`
    min-width: 100px;
    border-radius: 0 !important;

    &:focus {
        color: #495057;
        background-color: #fff;
        border-color: #0dbf7e;
        outline: 0;
        box-shadow: none;
    }
`