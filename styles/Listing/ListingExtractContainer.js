import styled from 'styled-components'

export default styled.div`
    position: absolute;
    max-width: 600px;
    z-index: 10;
    background-color: #444;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;
    min-width: 237px;

    @media(max-width: 400px) {
       right:0;
    }
    
    @media(max-width: 311px) {
        left:0;
    }

    @media(max-width: 690px) {
        width: auto;
    }
`