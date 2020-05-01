import styled from 'styled-components'

export default styled.div`
    position: absolute;
    max-width: 600px;
    z-index: 10;
    background-color: #17242D;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;
    right: 0;
    @media(max-width: 640px) {
        width: 100%;
    };

    @media(min-width: 640px) {
        width: 80vw;
    }
`