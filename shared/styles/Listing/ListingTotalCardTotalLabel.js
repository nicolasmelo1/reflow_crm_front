import styled from 'styled-components'

export default styled.p`
    margin: 0;
    font-size: 12px;
    ${props => props.isTotal ? 'font-weight: bold;': ''}
`