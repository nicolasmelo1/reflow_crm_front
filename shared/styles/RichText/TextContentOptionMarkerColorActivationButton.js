import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: #000; 
    background-color: ${props => props.markerColor && !['', null, undefined].includes(props.markerColor) ? props.markerColor : 'transparent'}; 
    border: 1px solid #bfbfbf;
    border-radius: 5px
`
:
styled(TouchableOpacity)``