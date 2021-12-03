import styled from 'styled-components'

export default styled.a`
    display: inline-block;
    margin: 10px 0;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    padding: 0 10px;
    color: ${props => props.isSelected ? '#0dbf7e' : '#66686E'} !important;
`