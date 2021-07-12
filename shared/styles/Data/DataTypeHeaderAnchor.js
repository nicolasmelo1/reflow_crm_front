import styled from 'styled-components'

export default styled.a`
    display: inline-block;
    margin: 10px 0;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    padding: 0 10px;
    background-color: ${props => props.isSelected ? '#0dbf7e' : 'transparent'} !important;
    color: ${props => props.isSelected ? '#fff' : '#17242D'} !important;
`