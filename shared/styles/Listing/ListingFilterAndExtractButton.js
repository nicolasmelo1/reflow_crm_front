import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 1px solid #17242D;
    width: 100%;
    padding: 5px 5px;
    text-align: center;
    color: #17242D;
    border-radius: 50px;

    &:hover {
        background-color: #0dbf7e;
        border: 1px solid #0dbf7e;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }
`
:
null