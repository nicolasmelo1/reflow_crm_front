import styled from 'styled-components'

export default styled.div`
    width: 200px;
    overflow-y: ${props => props.forceScroll ? 'scroll': 'auto'};

    &:after {
        content: "";
        display: block;
        height: 50px;
        width: 100%;
    }

    @media(max-width: 640px) {
        max-height: calc(100vh - 327px)
    }
    @media(min-width: 640px) {
        max-height: calc(100vh - 247px)
    }
`