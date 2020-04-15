import styled from 'styled-components'

export default styled.div`
    margin: auto;
    text-align: center;
    margin: 0 10px 5px 10px;
    ${props=> props.isTableButton ? '': 'cursor: pointer;'};
    height: 20px
`