import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.textColor && !['', null, undefined].includes(props.textColor) ? props.textColor : '#000'}; 
    border: 0;
    background-color: transparent; 
    border-radius: 5px
`
:
styled(TouchableOpacity)``