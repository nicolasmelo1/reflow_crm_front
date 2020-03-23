import styled from 'styled-components'

export default styled.div`
    position: absolute;
    max-width: 600px;
    z-index: 10;
    background-color: #444;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;

    @media(max-width: 440px) {
        width: 90vw;
    };

    @media(min-width: 440px) {
        width: 80vw;
    }
`