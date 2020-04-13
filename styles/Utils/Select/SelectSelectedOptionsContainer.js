import styled from 'styled-components'
//margin: .13rem .75rem;
export default styled.div`
    @media(max-width: 420px) {
        background-color:${props => props.isOpen ? '#fff': 'transparent'};
    }
`