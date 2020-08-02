import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 0;
    color: #0dbf7e;
`
:
styled(TouchableOpacity)``