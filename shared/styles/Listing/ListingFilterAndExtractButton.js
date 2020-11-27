import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #17242D;
    border: 0;
    width: 100%;
    padding: 5px 5px;
    text-align: center;
    color: #fff;
    border-radius: .25rem;

    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`
:
null