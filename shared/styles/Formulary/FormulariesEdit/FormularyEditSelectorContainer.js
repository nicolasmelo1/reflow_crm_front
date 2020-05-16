import styled from 'styled-components'

export default styled.div`
    background-color: #fff;
    border-radius: .25rem;
    border: 2px solid ${props => props.isOpen ? '#0dbf7e': '#f2f2f2'};
`