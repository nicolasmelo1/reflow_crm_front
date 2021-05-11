import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ? 
styled(FontAwesomeIcon)`
    float: right;
    color: #bfbfbf;
    cursor: grab;

    @media(max-width: 740px) {
        font-size: 22px;
    }

    &:active {
        cursor: grabbing;
    }
`
:
styled(FontAwesomeIcon)`
    color: #bfbfbf;
`
