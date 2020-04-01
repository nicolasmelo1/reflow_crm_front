import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: white;
    border: 0;
    color: red;
    border-radius: 0;

    &:hover {
        background-color: white;
        border: 0;
        color: red;
    }
    &:active {
        background-color: white !important;
        border: 0;
        color: red;
    }
`