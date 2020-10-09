import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled.button`
    background-color: #17242D !important;
    border: 0;
    margin: 0;
    padding: 5px 10px;
    color: #f2f2f2;
    border-radius: .25rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #0dbf7e !important;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }

    @media(max-width: 640px) {
        margin: 5px 0 0 0;
        width: 100%;
    }
`