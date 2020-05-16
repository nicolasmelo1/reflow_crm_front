import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default styled(Form.Control)`
    outline: none;
    border: 2px solid #f2f2f2;
    margin: 0;
    
    &:focus {
        outline: none;
        border: 2px solid #0dbf7e;
        box-shadow: none
    }
`