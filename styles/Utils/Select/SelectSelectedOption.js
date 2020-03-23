import styled from 'styled-components'

export default styled.button`
    display: inline-block;
    padding: .156rem .375rem;
    margin: .156rem 0 .156rem .375rem;
    background-color: ${props => props.selected ? '#bfbfbf' : props.color};
    border-radius: 5px;
    border: 0;
    color: ${props => props.selected ? '#444' : '#fff'};
    transiton: color 0.3s ease-in-out;
    &:hover {
        color: #444;
        background-color: #bfbfbf
    }
`