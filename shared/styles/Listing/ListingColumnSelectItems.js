import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

export default styled(Dropdown.Item)`
    background-color: ${props => props.active ? '#17242D' : '#f2f2f2'} !important;
    color: ${props => props.active ? '#f2f2f2' : '#17242D'};
    border: 0;
    display: block;
    width: 100%;
    padding: 5px 10px;
    &:hover {
        background-color: #0dbf7e !important;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`