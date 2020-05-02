import styled from 'styled-components'

export default styled.p`
    margin: ${props => props.isTitle ? '0 0 10px 0' : '0'};
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: ${props => props.isTitle ? '17px' : '15px'};
    color: ${props => props.isTitle ? '#0dbf7e' : '#6a7074'};
    font-weight: ${props => props.isTitle ? 'bold': 'normal'};
`