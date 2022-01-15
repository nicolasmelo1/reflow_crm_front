import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    border-radius: 4px;
    border: 0;
    background-color: ${props => props.disabled ? '#bfbfbf' : '#0dbf7e'};
`
:
styled(TouchableOpacity)``