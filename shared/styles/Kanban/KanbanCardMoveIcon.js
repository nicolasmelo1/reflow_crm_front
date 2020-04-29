import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default styled(FontAwesomeIcon)`
    float: right;

    @media(max-width: 640px) {
        font-size: 22px;
    }
`