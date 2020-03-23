import styled from 'styled-components'

export default styled.p`
    ${props=> props.hasBorderBottom ? 'border-bottom: 1px solid #bfbfbf;' : ''}
    padding: 0;
    margin: 5px
`