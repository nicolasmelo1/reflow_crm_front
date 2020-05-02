import styled from 'styled-components'

export default styled.td`
    text-align: ${props=> props.isTableButton ? 'center': ' left'} !important;
    ${props=> props.isTableButton ? '': 'cursor: pointer;'}
    max-height: 20px;
    overflow: hidden;
    max-width: 50px;
    color: #6a7074;
    font-size: 15px;
    border: 1px solid #f2f2f2 !important;
    text-overflow: ellipsis; 
    white-space: nowrap
`