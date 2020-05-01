import styled from 'styled-components'

export default styled.a`
    display: inline-block;
    margin: 10px;
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.isSelected ? '#0dbf7e' : '#17242D'} !important;
`