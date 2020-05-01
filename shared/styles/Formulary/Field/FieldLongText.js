import styled from 'styled-components'

export default styled.textarea`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 1px solid #0dbf7e;

    &:focus {
        color: #17242D;
        background-color: white;
        border: 1px solid #17242D;
        box-shadow: none;
        outline: 0;
    }
`