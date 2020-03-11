import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(Button)`
    color: white; 
    border: 0; 
    border-radius: 10px 10px 0 0;
    text-align: center; 
    background-color:#0dbf7e; 
    padding: 20px 40px; 
    float: right; 
    display: block; 
    font-size: 20px; 
    margin-right: 15px;
    &:hover {
        background-color:#444; 
    }
    &:active {
        background-color:#444 !important; 
    }
`