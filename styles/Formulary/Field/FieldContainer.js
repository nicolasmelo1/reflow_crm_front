import styled from 'styled-components'

export default styled.div`
    ${props => props.isHidden ? 'display: none;': ''}
`