import styled from 'styled-components'

export default styled.div`
    height: 100%;
    width: 100%;
    text-align: center;
    color: ${props => props.isConditional ? '#f2f2f2': '#444'};
    background-color: ${props => props.isConditional ? '#444': '#0dbf7e'};
    padding: 5px;
    border-radius: 0 0 10px 10px;
    transition: height 0.3s ease-in-out;
    overflow: hidden
`