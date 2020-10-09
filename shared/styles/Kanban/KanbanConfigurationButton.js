import styled from 'styled-components'

export default styled.button`
    color: #f2f2f2;
    background-color: #17242D;
    border: 0;
    padding: 5px 10px;
    border-radius: .25rem;

    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }

    @media(min-width: 640px) {
        width: auto;
    }
    @media(max-width: 640px) {
        width: 100%;
    }
`