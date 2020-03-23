import styled from 'styled-components'

export default styled.td`
    ${props=> props.isTableButton ? 'text-align: center;': ''}
    ${props=> props.isTableButton ? '': 'cursor: pointer;'}
    max-height: 20px;
    overflow: hidden;
    max-width: 50px;
    border: 1px solid #f2f2f2 !important;
    text-overflow: ellipsis; 
    white-space: nowrap
`