import styled from 'styled-components'

export default styled.div`
    ${props => props.display === 'bottom' ? 
    `
        position: fixed;
        width: 100vw;
        left:0; 
        bottom: 0; 
        z-index:5;
    ` : ''
    }
`