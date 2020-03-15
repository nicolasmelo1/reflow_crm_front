import styled from 'styled-components'

export default styled.div`
    color: ${props=> props.isTableButton ? '#0dbf7e': '#f2f2f2'} !important;
    border: 1px solid #bfbfbf;
    height: ${props=> props.isTableButton ? '': '100%'};
    background-color: #444;
    text-align: left;
    position: relative;
    user-select: none;
`