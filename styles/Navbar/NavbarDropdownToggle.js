import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

export default styled(Dropdown.Toggle)`
    background-color: white !important;
    color: #444444 !important;
    border: 0px white;
    &:hover{
        background-color: white;
        color: #444;
    }
    &:active{
        background-color: white !important;
        color: #444 !important ;
    }
`