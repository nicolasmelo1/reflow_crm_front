import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default styled(Form.Control)`
    border: 0;
    &:focus {
        border: 0;
        box-shadow: none
    }
`