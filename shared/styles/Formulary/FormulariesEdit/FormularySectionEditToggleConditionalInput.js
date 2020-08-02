import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    background-color: #0dbf7e;
    
    &:focus {
        outline: none;
    }
`
:
styled(Text)``