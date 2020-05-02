import styled from 'styled-components'

export default styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
    @media(max-width: 420px) {
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '285px' : '305px'});
    }
    @media(min-width: 420px) {
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '195px' : '215px'})
    }
`