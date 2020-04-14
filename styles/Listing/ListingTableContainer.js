import styled from 'styled-components'

export default styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
    @media(max-width: 640px) {
        max-height: calc(100vh - 355px)
    }
    @media(min-width: 640px) {
        max-height: calc(100vh - 245px)
    }
`