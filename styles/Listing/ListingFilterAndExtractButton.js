import styled from 'styled-components'
import Button from 'react-bootstrap/Button'

export default styled(Button)`
    background-color: #444444;
    border: 0;
    margin: 5px 10px 5px 0;
    width: 126px;
    padding: 5px 5px;
    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`