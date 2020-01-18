import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default styled(Form.Control)`
    background-color: transparent;
    border: 0px solid black;
    transition: all !important;
    border-bottom: 1px solid #0dbf7e;
    color: #ffffff;
    &:focus {
        color: #ffffff;
        background-color: transparent;
        border-bottom: 1px solid #ffffff;
        box-shadow: none;
        outline: 0;
      }
`
