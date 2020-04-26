import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-native'

export default process.env['APP'] === 'web' ?  
styled(FontAwesomeIcon)`
    @media(min-width: 420px) {
        display: none;
    }
    @media(max-width: 420px) {
        margin: 0 10px;
        cursor: pointer;
    }
`
:
styled(Button)`
`