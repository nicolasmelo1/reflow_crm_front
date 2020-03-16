import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: transparent;
    border: 1px solid #fff;
    margin: 0 5px 0 0;
    color: #fff;
    &:hover {
        background-color: transparent;
        border: 1px solid #0dbf7e;
        color: #fff;
    }
    &:active {
        background-color: #fff !important;
        border: 0;
        color: black
    }
`