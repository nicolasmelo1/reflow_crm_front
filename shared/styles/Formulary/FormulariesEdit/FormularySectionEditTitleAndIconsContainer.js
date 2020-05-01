import styled from 'styled-components'

export default styled.div`
    background-color: ${props=> props.isConditional ? '#17242D': '#0dbf7e'};
    border-radius: 10px 10px 0 0;
    padding: 0 5px;
`