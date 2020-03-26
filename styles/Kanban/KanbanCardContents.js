import styled from 'styled-components'

export default styled.p`
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${props => props.isTitle ? '#0dbf7e' : 'inherit'};
    font-weight: ${props => props.isTitle ? 'bold': 'normal'};
`