import styled from 'styled-components'

export default styled.input`
    border: 0;
    border-bottom: 2px solid ${props => props.isConditional ? '#0dbf7e': '#444'};
    color: #f2f2f2;
    width: 100%;
    font-weight: bold;
    font-size: 2rem;
    background-color: transparent;
    
    &:focus {
        outline: none;
    }
`