import styled from 'styled-components'

export default styled.div`
    border: 1px solid #f2f2f2;
    background-color: ${props=> props.isConditional ? '#444': 'white'};
    color: ${props=> props.isConditional ? '#fff': '#444'};
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px
`