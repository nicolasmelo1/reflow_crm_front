import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.button`
    background-color: #0dbf7e;
    border: 0;
    width: 100%;
    color: #fff;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 4px;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    font-size: 13px;

    &:hover {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }

    @media(min-width: 740px) {
        width: auto;
    }
    @media(max-width: 740px) {
        width: 100%;
    }
` 
:
null