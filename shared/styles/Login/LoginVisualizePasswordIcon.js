import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ?
styled(FontAwesomeIcon)`
    align-self: center;
    margin-left: 10px;
    cursor: pointer;
    width: 1.25em !important
`
:
styled(FontAwesomeIcon)`
`