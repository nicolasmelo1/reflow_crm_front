import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default styled(FontAwesomeIcon)`
    @media(min-width: 420px) {
        display: none;
    }
    @media(max-width: 420px) {
        margin: 0 10px;
        cursor: pointer;
    }
`