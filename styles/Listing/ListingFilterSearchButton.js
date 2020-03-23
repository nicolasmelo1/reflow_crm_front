import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: #fff;
    margin: 5px 5px 0 0;
    border: 0;
    color: #444;
    &:hover {
        background-color: #fff;
        border: 0;
        color: #0dbf7e
    }
    &:active {
        background-color: #fff !important;
        border: 0;
        color: #0dbf7e
    }
`