import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    background-color: #0dbf7e;
    border-radius: 20px;
    border: 0;
    margin: 10px 5px;
    &:hover {
        background-color: #fff;
        color: #0dbf7e
    }
`