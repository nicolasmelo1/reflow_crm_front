import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ? 
styled(FontAwesomeIcon)`
    font-size: 20px;
    margin: 0 10px;
    color: #17242D
`
:
styled(FontAwesomeIcon)`
    font-size: 20px;
    color: #17242D
`