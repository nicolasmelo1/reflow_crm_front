import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ? 
styled(FontAwesomeIcon)`
    cursor: grab;
    color: #bfbfbf;

    &:active {
        cursor: grabbing;
    }
`
:
styled(FontAwesomeIcon)``