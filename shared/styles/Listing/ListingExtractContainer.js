import styled from 'styled-components'

export default styled.div`
    position: absolute;
    z-index: 10;
    background-color: #17242D;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;
    min-width: 237px;

    @media(max-width: 640px) {
       right:0;
       width: calc(var(--app-width) - 40px);
    }
`