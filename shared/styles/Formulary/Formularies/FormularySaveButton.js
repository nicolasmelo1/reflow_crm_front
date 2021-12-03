import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.button`
    width: 100%;
    padding: 5px;
    font-weight: bold;
    color: #20253F;
    border: 1px solid #0dbf7e;
    border-radius: 20px;
    margin-bottom: 10px;
    background-color: #0dbf7e;
    
    &:hover {
        background-color: #20253F;
        border: 1px solid #20253F;
        color: #0dbf7e;
    }
`
:
null