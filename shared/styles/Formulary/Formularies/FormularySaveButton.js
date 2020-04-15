import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    width: 100%;
    padding: 5px;
    color: #0dbf7e;
    border: 1px solid #0dbf7e;
    border-radius: 20px;
    margin-bottom: 10px;
    background-color: transparent;

    &:hover {
        background-color: #0dbf7e;
        border: 1px solid #0dbf7e;
        color: #f2f2f2;
    }
`