import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: #444444 !important;
    border: 0;
    margin: 5px 0 5px 0;
    padding: 5px 10px;
    &:hover {
        background-color: #0dbf7e !important;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }

    @media(max-width:440px) {
        width: 100%;
    }
`