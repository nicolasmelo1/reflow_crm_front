import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: ${props => props.markerColor && !['', null, undefined].includes(props.markerColor) ? props.markerColor : 'transparent'}; 
    padding: 3px 10px;
    border-radius: 5px; 
    margin: 3px
`
:
styled(TouchableOpacity)`
    border: 0;
    background-color: ${props => props.markerColor && !['', null, undefined].includes(props.markerColor) ? props.markerColor : 'transparent'}; 
    padding: 10px 10px;
    border-radius: 5px; 
    margin: 3px
`