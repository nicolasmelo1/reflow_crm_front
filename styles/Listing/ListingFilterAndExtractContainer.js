import styled from 'styled-components'

export default styled.div`
    position: relative;
    display: inline-block;
    
    @media(min-width: 640px) {
        width: 126px;
        margin: 0 10px 0 0;
    }
    @media(max-width: 640px) {
        width: 49%;
        ${props=> props.hasLeftMargin ? 'margin: 0 0 0 1%;': 'margin: 0 1% 0 0;' }
    }
`