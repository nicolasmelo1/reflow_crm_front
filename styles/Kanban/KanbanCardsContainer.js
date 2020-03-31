import styled from 'styled-components'

export default styled.div`
    width: 200px;
    overflow-y: ${props => props.forceScroll ? 'scroll': 'auto'};

    @media(max-width: 640px) {
        max-height: calc(100vh - 367px)
    }
    @media(min-width: 640px) {
        max-height: calc(100vh - 337px)
    }
`