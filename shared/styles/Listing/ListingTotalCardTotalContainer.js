import styled from 'styled-components'

export default styled.div`
    padding: 0;
    ${props => props.hasBorderBottom ? 'border-bottom: 1px solid #17242D;' : ''}
`