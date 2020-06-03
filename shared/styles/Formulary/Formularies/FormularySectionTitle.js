import styled from 'styled-components'

export default styled.h2`
    color: ${props => props.isConditional ? '#f2f2f2' : '#0E5741'}; 
    border-bottom: 2px solid #0dbf7e;
`