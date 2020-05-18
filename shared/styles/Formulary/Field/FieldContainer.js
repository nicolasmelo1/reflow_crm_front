import styled from 'styled-components'

export default styled.div`
    border-radius: 10px;
    padding: 5px;
    ${props => props.invalid ? 'border: 1px solid red;': ''}
    ${props => props.fieldIsHidden ? 'display: none;' : ''}
`