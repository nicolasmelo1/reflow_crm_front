import styled from 'styled-components'

export default styled.td`
    text-align: center;
    padding: 5px 2px;
    font-size: 14px;
    color: ${props=> props.isCurrentMonth ? '#0dbf7e' : '#bfbfbf'};
    background-color: ${props=> props.isSelectedDay ? '#fff': 'transparent'};
    border-radius: 5px;
    cursor: pointer;
    width: 14.2857142857%
`