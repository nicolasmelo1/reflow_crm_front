import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.button`
    color: #17242D;
    background-color: transparent;
    border: 1px solid #17242D;
    padding: 5px 10px;
    border-radius: 50px;

    &:hover {
        background-color: #0dbf7e;
        border: 1px solid #0dbf7e;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }

    @media(min-width: 640px) {
        width: auto;
    }
    @media(max-width: 640px) {
        width: 100%;
    }
` 
:
null