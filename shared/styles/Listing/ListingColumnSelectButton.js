import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.button`
    border: 1px solid #17242D;
    background-color: #fff !important;
    margin: 0;
    padding: 5px 10px;
    color: #17242D;
    border-radius: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }

    @media(max-width: 640px) {
        margin: 5px 0 0 0;
        width: 100%;
    }
`
:
null