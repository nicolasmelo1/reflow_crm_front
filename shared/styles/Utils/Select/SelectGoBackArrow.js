import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Button } from 'react-native'

export default styled(FontAwesomeIcon)`
    ${process.env['APP'] === 'web' ? `
        @media(min-width: 420px) {
            display: none;
        }
        @media(max-width: 420px) {
            margin: 0 10px;
            cursor: pointer;
        }
    `: ''}
`