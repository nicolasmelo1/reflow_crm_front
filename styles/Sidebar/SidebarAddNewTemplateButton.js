import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: transparent;
    border-radius: 20px;
    border: 1px solid #0dbf7e;
    margin: 10px 5px;
    &:hover {
        border: 1px solid #fff;
        background-color: transparent;
        color: #0dbf7e
    }
`